import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, exchangeCodeForToken } from "../_shared/truelayer.ts";

/**
 * TrueLayer OAuth redirect target.
 *
 * TrueLayer redirects the user's browser here with ?code=...&state=... after
 * they finish authorising at their bank. We:
 *
 *   1. Look up the pending auth row by `state` to recover the user + provider.
 *   2. Exchange the code for access + refresh tokens.
 *   3. Insert a row into connected_banks with status='active' and a 90-day
 *      PSD2 consent expiry.
 *   4. Delete the pending row.
 *   5. Return an HTML page that redirects the browser into the mobile app
 *      via the `subtracker://bank-connected?bank_id=<id>` deep link.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (error) {
    return htmlResponse(errorPage(error, errorDescription));
  }
  if (!code || !state) {
    return htmlResponse(errorPage("missing_params", "code and state required"));
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const admin = createClient(supabaseUrl, serviceKey);

    // Look up the pending auth row.
    const { data: pending, error: pendingErr } = await admin
      .from("truelayer_pending_auths")
      .select("*")
      .eq("state", state)
      .maybeSingle();

    if (pendingErr || !pending) {
      console.error("Pending lookup failed:", pendingErr);
      return htmlResponse(errorPage("invalid_state", "This link has expired"));
    }

    const redirectUri = `${supabaseUrl}/functions/v1/truelayer-callback`;
    const tokens = await exchangeCodeForToken({ code, redirectUri });

    const now = new Date();
    const tokenExpiresAt = new Date(
      now.getTime() + tokens.expires_in * 1000
    ).toISOString();
    // PSD2 strong-customer-authentication window: 90 days from consent.
    const expiresAt = new Date(
      now.getTime() + 90 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Persist the connected bank. We keep requisition_id populated with the
    // refresh_token so the rest of the app (which was written against the
    // GoCardless shape) still has a stable external identifier — but sync
    // uses access_token/refresh_token directly.
    const { data: bank, error: bankErr } = await admin
      .from("connected_banks")
      .insert({
        user_id: pending.user_id,
        institution_id: pending.provider_id,
        institution_name: pending.provider_name,
        institution_logo: pending.provider_logo,
        requisition_id: tokens.refresh_token ?? null,
        provider_country: pending.provider_country,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        token_expires_at: tokenExpiresAt,
        status: "active",
        connected_at: now.toISOString(),
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (bankErr || !bank) {
      console.error("Bank insert error:", bankErr);
      return htmlResponse(
        errorPage("db_error", "Could not save your bank connection")
      );
    }

    // Best-effort cleanup; don't block the redirect if this fails.
    await admin.from("truelayer_pending_auths").delete().eq("state", state);

    return htmlResponse(successPage(bank.id));
  } catch (err) {
    console.error("Callback error:", err);
    return htmlResponse(
      errorPage("exchange_failed", (err as Error).message ?? "Unknown error")
    );
  }
});

function htmlResponse(html: string): Response {
  return new Response(html, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function successPage(bankId: string): string {
  const deepLink = `subtracker://bank-connected?bank_id=${encodeURIComponent(bankId)}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Bank connected</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
           display: flex; flex-direction: column; align-items: center;
           justify-content: center; min-height: 100vh; margin: 0;
           background: #fafaf9; color: #1c1917; text-align: center; padding: 24px; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    p { color: #78716c; margin: 4px 0; }
    .btn { display: inline-block; margin-top: 24px; padding: 14px 28px;
           background: #4F46E5; color: white; border-radius: 12px;
           text-decoration: none; font-weight: 600; }
    .spinner { width: 32px; height: 32px; border: 3px solid #e7e5e4;
               border-top-color: #4F46E5; border-radius: 50%;
               animation: spin 0.8s linear infinite; margin-bottom: 24px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <h1>Bank connected</h1>
  <p>Returning you to SubTracker...</p>
  <a class="btn" href="${deepLink}">Open SubTracker</a>
  <script>
    setTimeout(function () { window.location.href = ${JSON.stringify(deepLink)}; }, 300);
  </script>
</body>
</html>`;
}

function errorPage(code: string, message: string | null): string {
  const deepLink = `subtracker://bank-connected?error=${encodeURIComponent(code)}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Connection failed</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
           display: flex; flex-direction: column; align-items: center;
           justify-content: center; min-height: 100vh; margin: 0;
           background: #fafaf9; color: #1c1917; text-align: center; padding: 24px; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    p { color: #78716c; margin: 4px 0; max-width: 320px; }
    code { background: #f5f5f4; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
    .btn { display: inline-block; margin-top: 24px; padding: 14px 28px;
           background: #4F46E5; color: white; border-radius: 12px;
           text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Connection failed</h1>
  <p>${(message ?? "Please try again.").replace(/</g, "&lt;")}</p>
  <p><code>${code}</code></p>
  <a class="btn" href="${deepLink}">Back to SubTracker</a>
</body>
</html>`;
}
