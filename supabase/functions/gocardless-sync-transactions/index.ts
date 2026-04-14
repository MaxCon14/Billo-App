import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GC_BASE = "https://bankaccountdata.gocardless.com/api/v2";

// ─── Known subscription merchants for detection ────────────────────────────
const KNOWN_MERCHANTS = [
  "netflix", "spotify", "apple", "google", "microsoft", "adobe",
  "amazon prime", "disney", "hbo", "youtube", "dropbox", "icloud",
  "onedrive", "notion", "slack", "zoom", "canva", "figma", "github",
  "chatgpt", "openai", "claude", "midjourney", "grammarly", "duolingo",
  "headspace", "calm", "strava", "myfitnesspal", "nytimes", "linkedin",
  "deezer", "tidal", "audible", "kindle", "playstation", "xbox",
  "nintendo", "twitch", "patreon", "substack", "medium", "expressvpn",
  "nordvpn", "1password", "lastpass", "dashlane", "malwarebytes",
  "hulu", "paramount", "peacock", "crunchyroll", "tinder", "bumble",
  "coursera", "udemy", "skillshare", "masterclass", "peloton",
  "doordash", "uber", "instacart", "hellofresh", "proton", "mullvad",
  "revolut", "wise", "coinbase", "robinhood",
];

// ─── Category hints ─────────────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, string> = {
  netflix: "Streaming", hulu: "Streaming", disney: "Streaming",
  hbo: "Streaming", paramount: "Streaming", peacock: "Streaming",
  crunchyroll: "Streaming", youtube: "Streaming",
  spotify: "Music", deezer: "Music", tidal: "Music", audible: "Music",
  apple: "Productivity", google: "Productivity", microsoft: "Productivity",
  adobe: "Productivity", notion: "Productivity", slack: "Productivity",
  zoom: "Productivity", canva: "Productivity", figma: "Productivity",
  github: "Productivity", grammarly: "Productivity",
  dropbox: "Cloud Storage", icloud: "Cloud Storage", onedrive: "Cloud Storage",
  playstation: "Gaming", xbox: "Gaming", nintendo: "Gaming", twitch: "Gaming",
  duolingo: "Productivity", coursera: "Productivity", udemy: "Productivity",
  skillshare: "Productivity", masterclass: "Productivity",
  headspace: "Fitness", calm: "Fitness", strava: "Fitness",
  myfitnesspal: "Fitness", peloton: "Fitness",
  nordvpn: "Other", expressvpn: "Other", proton: "Other", mullvad: "Other",
  "1password": "Other", lastpass: "Other", dashlane: "Other",
  nytimes: "News & Reading", linkedin: "Productivity",
  substack: "News & Reading", medium: "News & Reading",
  kindle: "News & Reading", patreon: "Other",
  tinder: "Other", bumble: "Other",
  chatgpt: "Productivity", openai: "Productivity", claude: "Productivity",
  midjourney: "Productivity",
  revolut: "Finance", wise: "Finance", coinbase: "Finance", robinhood: "Finance",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalize(name: string): string {
  return (name || "").toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");
}

function cleanMerchantName(raw: string): string {
  // Capitalize first letter of each word, strip noise
  return raw
    .replace(/[*#_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function inferBillingCycle(intervals: number[]): string {
  if (intervals.length === 0) return "monthly";
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  if (avg <= 10) return "weekly";
  if (avg <= 20) return "monthly"; // bi-weekly treated as monthly in context
  if (avg <= 45) return "monthly";
  if (avg <= 100) return "quarterly";
  if (avg <= 200) return "semi_annual";
  return "yearly";
}

function inferNextDate(lastDate: string, avgInterval: number): string {
  const d = new Date(lastDate);
  d.setDate(d.getDate() + Math.round(avgInterval));
  return d.toISOString().split("T")[0];
}

function inferCategory(key: string): string | null {
  for (const [merchant, cat] of Object.entries(CATEGORY_MAP)) {
    if (key.includes(merchant)) return cat;
  }
  return null;
}

/**
 * Syncs transactions from GoCardless and runs subscription detection.
 *
 * Body: { requisition_id: string }
 * Auth: Bearer token from Supabase auth
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

    // Extract user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: { user }, error: authError } = await createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    ).auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { requisition_id } = await req.json();
    if (!requisition_id) {
      return new Response(
        JSON.stringify({ error: "requisition_id required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get bank row
    const { data: bank } = await supabase
      .from("connected_banks")
      .select("*")
      .eq("requisition_id", requisition_id)
      .eq("user_id", user.id)
      .single();

    if (!bank) {
      return new Response(
        JSON.stringify({ error: "Bank connection not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get GoCardless access token
    const { data: tokenData } = await supabase.functions.invoke(
      "gocardless-get-token",
      { body: {} }
    );

    if (!tokenData?.access) {
      return new Response(
        JSON.stringify({ error: "Failed to obtain access token" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = tokenData.access;

    // Fetch requisition to get account IDs
    const reqRes = await fetch(`${GC_BASE}/requisitions/${requisition_id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!reqRes.ok) {
      const err = await reqRes.text();
      console.error("Requisition fetch error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to fetch requisition" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const requisition = await reqRes.json();
    const accountIds: string[] = requisition.accounts || [];

    if (accountIds.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No accounts linked yet. The bank authorization may still be pending.",
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch transactions for each account
    let totalFetched = 0;
    const allTransactions: Array<{
      transaction_id: string;
      booking_date: string;
      amount: number;
      currency: string;
      creditor_name: string | null;
      debtor_name: string | null;
      description: string | null;
      raw_data: Record<string, unknown>;
    }> = [];

    for (const accountId of accountIds) {
      const txnRes = await fetch(
        `${GC_BASE}/accounts/${accountId}/transactions/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!txnRes.ok) {
        console.error(`Failed to fetch transactions for account ${accountId}`);
        continue;
      }

      const txnData = await txnRes.json();
      const booked = txnData?.transactions?.booked || [];

      for (const txn of booked) {
        allTransactions.push({
          transaction_id: txn.transactionId || txn.internalTransactionId || crypto.randomUUID(),
          booking_date: txn.bookingDate || txn.valueDate,
          amount: parseFloat(txn.transactionAmount?.amount || "0"),
          currency: txn.transactionAmount?.currency || "EUR",
          creditor_name: txn.creditorName || null,
          debtor_name: txn.debtorName || null,
          description: txn.remittanceInformationUnstructured || txn.additionalInformation || null,
          raw_data: txn,
        });
      }
    }

    // Upsert transactions into bank_transactions
    if (allTransactions.length > 0) {
      const rows = allTransactions.map((t) => ({
        user_id: user.id,
        bank_id: bank.id,
        transaction_id: t.transaction_id,
        booking_date: t.booking_date,
        amount: t.amount,
        currency: t.currency,
        creditor_name: t.creditor_name,
        debtor_name: t.debtor_name,
        description: t.description,
        raw_data: t.raw_data,
      }));

      // Batch upsert in chunks of 500
      for (let i = 0; i < rows.length; i += 500) {
        const chunk = rows.slice(i, i + 500);
        await supabase
          .from("bank_transactions")
          .upsert(chunk, { onConflict: "transaction_id" });
      }
      totalFetched = allTransactions.length;
    }

    // Update bank status
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 90);

    await supabase
      .from("connected_banks")
      .update({
        status: "active",
        connected_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        last_synced_at: now.toISOString(),
      })
      .eq("id", bank.id);

    // ─── Subscription Detection ───────────────────────────────────────────

    // Group transactions by normalized creditor/description (debits only)
    const debits = allTransactions.filter((t) => t.amount < 0);
    const grouped = new Map<string, typeof allTransactions>();

    for (const txn of debits) {
      const key = normalize(txn.creditor_name || txn.description || "");
      if (!key) continue;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(txn);
    }

    const candidates: Array<{
      name: string;
      amount: number;
      currency: string;
      billing_cycle: string;
      last_charged: string;
      next_billing_date: string;
      category_hint: string | null;
    }> = [];

    for (const [key, txns] of grouped) {
      // Sort by date descending
      txns.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());

      const isKnownMerchant = KNOWN_MERCHANTS.some((m) => key.includes(m));

      // Check recurrence: at least 2 transactions with consistent intervals
      let isRecurring = false;
      const intervals: number[] = [];
      if (txns.length >= 2) {
        for (let i = 0; i < txns.length - 1; i++) {
          const d1 = new Date(txns[i].booking_date).getTime();
          const d2 = new Date(txns[i + 1].booking_date).getTime();
          intervals.push(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
        }
        // Check if intervals are somewhat consistent (within 40% of avg)
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const isConsistentInterval = intervals.every(
          (i) => Math.abs(i - avgInterval) / avgInterval < 0.4
        );
        isRecurring = isConsistentInterval && avgInterval >= 5;
      }

      // Check amount consistency
      const amounts = txns.map((t) => Math.abs(t.amount));
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const isConsistentAmount =
        amounts.every((a) => Math.abs(a - avgAmount) / avgAmount < 0.05) || amounts.length === 1;

      const isSmallAmount = avgAmount < 150;

      if (isKnownMerchant || (isRecurring && isConsistentAmount && isSmallAmount)) {
        const avgInt =
          intervals.length > 0
            ? intervals.reduce((a, b) => a + b, 0) / intervals.length
            : 30;

        candidates.push({
          name: cleanMerchantName(txns[0].creditor_name || txns[0].description || key),
          amount: Math.round(avgAmount * 100) / 100,
          currency: txns[0].currency,
          billing_cycle: inferBillingCycle(intervals),
          last_charged: txns[0].booking_date,
          next_billing_date: inferNextDate(txns[0].booking_date, avgInt),
          category_hint: inferCategory(key),
        });
      }
    }

    // Check existing subscriptions to avoid duplicates
    const { data: existingSubs } = await supabase
      .from("subscriptions")
      .select("name")
      .eq("user_id", user.id);

    const existingNames = new Set(
      (existingSubs || []).map((s: { name: string }) => normalize(s.name))
    );

    // Also check existing detected_subscriptions to avoid duplicates
    const { data: existingDetected } = await supabase
      .from("detected_subscriptions")
      .select("name")
      .eq("user_id", user.id)
      .eq("status", "pending");

    const existingDetectedNames = new Set(
      (existingDetected || []).map((s: { name: string }) => normalize(s.name))
    );

    // Insert new detected subscriptions
    const newCandidates = candidates.filter((c) => {
      const norm = normalize(c.name);
      return !existingNames.has(norm) && !existingDetectedNames.has(norm);
    });

    if (newCandidates.length > 0) {
      await supabase.from("detected_subscriptions").insert(
        newCandidates.map((c) => ({
          user_id: user.id,
          bank_id: bank.id,
          name: c.name,
          amount: c.amount,
          currency: c.currency,
          billing_cycle: c.billing_cycle,
          last_charged: c.last_charged,
          next_billing_date: c.next_billing_date,
          category_hint: c.category_hint,
          status: "pending",
        }))
      );
    }

    return new Response(
      JSON.stringify({
        transactions_fetched: totalFetched,
        subscriptions_detected: newCandidates.length,
        bank_status: "active",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
