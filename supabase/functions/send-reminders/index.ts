import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Daily CRON job to send renewal reminders.
 * Triggered by pg_cron: SELECT cron.schedule('send-reminders', '0 9 * * *', $$...$$);
 *
 * Checks for upcoming subscription renewals and sends notifications
 * based on each user's reminder_days_before preference.
 */
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

    // Get all active subscriptions with renewal notifications enabled
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select(`
        id, name, amount, currency, next_billing_date, notify_before_renewal,
        user_id, profiles!inner(
          id, full_name, notification_email, notification_push, reminder_days_before
        )
      `)
      .eq("is_active", true)
      .eq("notify_before_renewal", true);

    if (error) {
      console.error("Query error:", error);
      throw error;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let sentCount = 0;

    for (const sub of subscriptions || []) {
      const profile = (sub as any).profiles;
      const reminderDays = profile?.reminder_days_before ?? 3;
      const billingDate = new Date(sub.next_billing_date);
      billingDate.setHours(0, 0, 0, 0);

      const daysUntil = Math.ceil(
        (billingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Send reminder if the billing date is exactly reminderDays away
      if (daysUntil !== reminderDays) continue;

      const title = "Upcoming Renewal";
      const body = `${sub.name} ($${sub.amount} ${sub.currency}) renews in ${daysUntil} day${daysUntil === 1 ? "" : "s"}`;

      // Create in-app notification
      await supabase.from("notifications").insert({
        user_id: sub.user_id,
        subscription_id: sub.id,
        type: "renewal_reminder",
        title,
        body,
      });

      // Send email notification if enabled
      if (profile?.notification_email && resendApiKey) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "SubTracker <notifications@subtracker.app>",
              to: [sub.user_id], // In production, fetch email from auth.users
              subject: `${sub.name} renews in ${daysUntil} days`,
              html: `
                <h2>Renewal Reminder</h2>
                <p>Your subscription to <strong>${sub.name}</strong> will renew in <strong>${daysUntil} day${daysUntil === 1 ? "" : "s"}</strong>.</p>
                <p>Amount: <strong>$${sub.amount} ${sub.currency}</strong></p>
                <p>Renewal date: <strong>${sub.next_billing_date}</strong></p>
                <br>
                <p><a href="https://subtracker.app">Open SubTracker</a></p>
              `,
            }),
          });
        } catch (emailError) {
          console.error("Email send error:", emailError);
        }
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
