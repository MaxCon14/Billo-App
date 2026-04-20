import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    let sentCount = 0;

    // ─── 1. Renewal reminders ─────────────────────────────────────────────────
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select(`
        id, name, amount, currency, next_billing_date, notify_before_renewal,
        user_id, profiles!inner(
          id, full_name, notification_email, notification_push, reminder_days_before
        )
      `)
      .eq("is_active", true)
      .eq("notify_before_renewal", true)
      .eq("is_trial", false);

    if (subError) throw subError;

    for (const sub of subscriptions ?? []) {
      const profile = (sub as any).profiles;
      const reminderDays = profile?.reminder_days_before ?? 3;
      const billingDate = new Date(sub.next_billing_date);
      billingDate.setHours(0, 0, 0, 0);

      const daysUntil = Math.ceil(
        (billingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntil !== reminderDays) continue;

      const title = "Upcoming Renewal";
      const body = `${sub.name} ($${sub.amount} ${sub.currency}) renews in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`;

      await supabase.from("notifications").insert({
        user_id: sub.user_id,
        subscription_id: sub.id,
        type: "renewal_reminder",
        title,
        body,
      });

      if (profile?.notification_email && resendApiKey) {
        await sendEmail(resendApiKey, sub.user_id, {
          subject: `${sub.name} renews in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`,
          html: `
            <h2>Renewal Reminder</h2>
            <p>Your subscription to <strong>${sub.name}</strong> will renew in <strong>${daysUntil} day${daysUntil === 1 ? "" : "s"}</strong>.</p>
            <p>Amount: <strong>${sub.amount} ${sub.currency}</strong></p>
            <p>Renewal date: <strong>${sub.next_billing_date}</strong></p>
          `,
        });
      }

      sentCount++;
    }

    // ─── 2. Trial ending tomorrow reminders ──────────────────────────────────
    const { data: trials, error: trialError } = await supabase
      .from("subscriptions")
      .select(`
        id, name, trial_ends_at, user_id,
        profiles!inner(
          id, full_name, notification_email, notification_push
        )
      `)
      .eq("is_active", true)
      .eq("is_trial", true)
      .eq("trial_ends_at", tomorrowStr);

    if (trialError) throw trialError;

    for (const trial of trials ?? []) {
      const profile = (trial as any).profiles;

      const title = "⚠️ Trial ends tomorrow";
      const body = `Your ${trial.name} free trial ends tomorrow. Cancel now to avoid being charged.`;

      await supabase.from("notifications").insert({
        user_id: trial.user_id,
        subscription_id: trial.id,
        type: "trial_ending",
        title,
        body,
      });

      if (profile?.notification_email && resendApiKey) {
        await sendEmail(resendApiKey, trial.user_id, {
          subject: `⚠️ Your ${trial.name} trial ends tomorrow`,
          html: `
            <h2>Your free trial ends tomorrow</h2>
            <p>Your <strong>${trial.name}</strong> free trial ends on <strong>${trial.trial_ends_at}</strong>.</p>
            <p>If you don't want to be charged, <strong>cancel your subscription before tomorrow</strong>.</p>
            <br>
            <p><a href="https://billo.app" style="background:#F5E642;color:#000;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:700;">Open Billo to cancel</a></p>
          `,
        });
      }

      sentCount++;
    }

    return new Response(
      JSON.stringify({ success: true, reminders_sent: sentCount }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Reminder error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function sendEmail(
  apiKey: string,
  userId: string,
  opts: { subject: string; html: string }
) {
  // Fetch the user's email from auth
  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  const { data: { user } } = await admin.auth.admin.getUserById(userId);
  if (!user?.email) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Billo <notifications@billo.app>",
        to: [user.email],
        subject: opts.subject,
        html: opts.html,
      }),
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}
