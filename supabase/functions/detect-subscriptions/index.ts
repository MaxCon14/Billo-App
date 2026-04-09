import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Transaction {
  transaction_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name: string | null;
}

/**
 * Detects recurring subscription patterns from transaction data.
 * Groups transactions by merchant, checks for monthly recurrence,
 * and creates subscription entries for newly detected patterns.
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

    const { user_id, plaid_item_id } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch recent transactions for this user
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user_id)
      .order("date", { ascending: false })
      .limit(500);

    if (!transactions || transactions.length === 0) {
      return new Response(JSON.stringify({ detected: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Group transactions by merchant
    const merchantGroups = new Map<string, Transaction[]>();
    for (const txn of transactions) {
      const key = (txn.merchant_name || txn.name || "").toLowerCase().trim();
      if (!key) continue;
      if (!merchantGroups.has(key)) merchantGroups.set(key, []);
      merchantGroups.get(key)!.push(txn);
    }

    // Detect recurring patterns (3+ transactions with similar amounts and ~30 day intervals)
    const detected: Array<{ name: string; amount: number; next_billing_date: string }> = [];

    for (const [merchant, txns] of merchantGroups) {
      if (txns.length < 3) continue;

      // Check if amounts are consistent (within 10% variance)
      const amounts = txns.map((t) => Math.abs(t.amount));
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const isConsistentAmount = amounts.every(
        (a) => Math.abs(a - avgAmount) / avgAmount < 0.1
      );
      if (!isConsistentAmount) continue;

      // Check for monthly-ish intervals (25-35 days)
      const dates = txns.map((t) => new Date(t.date).getTime()).sort((a, b) => b - a);
      const intervals: number[] = [];
      for (let i = 0; i < dates.length - 1; i++) {
        intervals.push((dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24));
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const isMonthly = avgInterval >= 25 && avgInterval <= 35;

      if (isMonthly) {
        const nextDate = new Date(dates[0] + avgInterval * 24 * 60 * 60 * 1000);
        detected.push({
          name: txns[0].merchant_name || txns[0].name || merchant,
          amount: Math.round(avgAmount * 100) / 100,
          next_billing_date: nextDate.toISOString().split("T")[0],
        });
      }
    }

    // Create subscription entries for newly detected subscriptions
    let created = 0;
    for (const sub of detected) {
      // Check if already tracked
      const { data: existing } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user_id)
        .ilike("name", `%${sub.name}%`)
        .limit(1);

      if (existing && existing.length > 0) continue;

      await supabase.from("subscriptions").insert({
        user_id,
        name: sub.name,
        amount: sub.amount,
        billing_cycle: "monthly",
        next_billing_date: sub.next_billing_date,
        is_active: true,
        auto_detected: true,
      });

      // Notify user of detected subscription
      await supabase.from("notifications").insert({
        user_id,
        type: "new_detected",
        title: "New subscription detected",
        body: `We found a recurring charge for ${sub.name} ($${sub.amount}/mo)`,
      });

      created++;
    }

    return new Response(JSON.stringify({ detected: detected.length, created }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Detection error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
