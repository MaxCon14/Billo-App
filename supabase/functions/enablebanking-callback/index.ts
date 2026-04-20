import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, createSession } from "../_shared/enablebanking.ts";

/**
 * Enable Banking OAuth redirect target.
 *
 * Enable Banking redirects the user's browser here with ?code=...&state=...
 * We:
 *   1. Look up the pending auth row by `state`.
 *   2. Call POST /sessions to exchange the code for a session (+ account list).
 *   3. Store session_id in connected_banks.access_token and account UIDs in
 *      connected_banks.refresh_token (as JSON array).
 *   4. Delete the pending row.
 *   5. Return an HTML page that deep-links back into the app.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDesc = url.searchParams.get("message") ?? url.searchParams.get("error_description");

  if (error) return htmlResponse(errorPage(error, errorDesc));
  if (!code || !state) return htmlResponse(errorPage("missing_params", "code and state are required"));

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: pending, error: pendingErr } = await admin
      .from("truelayer_pending_auths")
      .select("*")
      .eq("state", state)
      .maybeSingle();

    if (pendingErr || !pending) {
      console.error("Pending lookup failed:", pendingErr);
      return htmlResponse(errorPage("invalid_state", "This link has expired or is invalid"));
    }

    // Exchange the code for a session (includes account list)
    const session = await createSession(code);

    const accountUids = (session.accounts ?? []).map((a) => a.uid);

    const now = new Date();
    const expiresAt = session.valid_until
      ? new Date(session.valid_until).toISOString()
      : new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data: bank, error: bankErr } = await admin
      .from("connected_banks")
      .insert({
        user_id: pending.user_id,
        institution_id: pending.provider_id,
        institution_name: pending.provider_name,
        institution_logo: pending.provider_logo,
        // Reuse access_token for session_id, refresh_token for account UIDs JSON
        access_token: session.session_id,
        refresh_token: JSON.stringify(accountUids),
        token_expires_at: expiresAt,
        requisition_id: session.session_id,
        provider_country: pending.provider_country,
        status: "active",
        connected_at: now.toISOString(),
        expires_at: expiresAt,
      })
      .select("id")
      .single();

    if (bankErr || !bank) {
      console.error("Bank insert error:", bankErr);
      return htmlResponse(errorPage("db_error", "Could not save your bank connection"));
    }

    await admin.from("truelayer_pending_auths").delete().eq("state", state);

    return htmlResponse(successPage(bank.id));
  } catch (err) {
    console.error("Callback error:", err);
    return htmlResponse(errorPage("exchange_failed", (err as Error).message ?? "Unknown error"));
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
  const intentLink = `intent://bank-connected?bank_id=${encodeURIComponent(bankId)}#Intent;scheme=subtracker;package=com.subtracker.app;end`;
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
           background: #0A0A0A; color: #FFFFFF; text-align: center; padding: 24px; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    p { color: #787878; margin: 4px 0; }
    .btn { display: inline-block; margin-top: 24px; padding: 14px 28px;
           background: #F5E642; color: #0A0A0A; border-radius: 999px;
           text-decoration: none; font-weight: 700; font-size: 15px; }
    .spinner { width: 32px; height: 32px; border: 3px solid #2A2A2A;
               border-top-color: #F5E642; border-radius: 50%;
               animation: spin 0.8s linear infinite; margin-bottom: 24px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <h1>Bank connected!</h1>
  <p>Returning you to Billo...</p>
  <a class="btn" id="openBtn" href="${deepLink}">Open Billo</a>
  <script>
    var isAndroid = /Android/i.test(navigator.userAgent);
    var link = isAndroid ? ${JSON.stringify(intentLink)} : ${JSON.stringify(deepLink)};
    document.getElementById('openBtn').href = link;
    setTimeout(function () { window.location.href = link; }, 300);
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
           background: #0A0A0A; color: #FFFFFF; text-align: center; padding: 24px; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    p { color: #787878; margin: 4px 0; max-width: 320px; }
    code { background: #1E1E1E; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #EF4444; }
    .btn { display: inline-block; margin-top: 24px; padding: 14px 28px;
           background: #F5E642; color: #0A0A0A; border-radius: 999px;
           text-decoration: none; font-weight: 700; font-size: 15px; }
  </style>
</head>
<body>
  <h1>Connection failed</h1>
  <p>${(message ?? "Please try again.").replace(/</g, "&lt;")}</p>
  <p><code>${code}</code></p>
  <a class="btn" href="${deepLink}">Back to App</a>
</body>
</html>`;
}
