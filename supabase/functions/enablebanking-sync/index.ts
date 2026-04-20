import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, fetchTransactions } from "../_shared/enablebanking.ts";

// ─── Subscription detection helpers ──────────────────────────────────────────

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

function normalize(name: string): string {
  return (name || "").toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");
}

function cleanMerchantName(raw: string): string {
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

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Sync transactions from Enable Banking and run subscription detection.
 *
 * Body: { bank_id: string }
 * Auth: Bearer token from Supabase auth
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return jsonResponse({ error: "Authorization required" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const admin = createClient(supabaseUrl, serviceKey);

    const jwt = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await admin.auth.getUser(jwt);
    if (authError || !user) return jsonResponse({ error: "Unauthorized" }, 401);

    const { bank_id } = await req.json();
    if (!bank_id) return jsonResponse({ error: "bank_id required" }, 400);

    const { data: bank, error: bankErr } = await admin
      .from("connected_banks")
      .select("*")
      .eq("id", bank_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (bankErr || !bank) return jsonResponse({ error: "Bank connection not found" }, 404);

    // access_token stores the Enable Banking session_id
    // refresh_token stores JSON array of account UIDs
    if (!bank.access_token) {
      await admin.from("connected_banks").update({ status: "expired" }).eq("id", bank.id);
      return jsonResponse({ error: "Session missing, please reconnect", bank_status: "expired" }, 401);
    }

    let accountUids: string[] = [];
    try {
      accountUids = JSON.parse(bank.refresh_token ?? "[]");
    } catch {
      accountUids = [];
    }

    if (accountUids.length === 0) {
      return jsonResponse({ error: "No accounts found on this connection" }, 422);
    }

    // Fetch 90 days of transactions
    const dateTo = new Date().toISOString().split("T")[0];
    const dateFrom = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

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

    for (const uid of accountUids) {
      try {
        const txns = await fetchTransactions({ accountUid: uid, dateFrom, dateTo });
        for (const t of txns) {
          const rawAmount = parseFloat(t.transaction_amount?.amount ?? "0");
          // Enable Banking returns positive amounts; DBIT = debit (expense) = negative
          const isDebit = (t.credit_debit_indicator ?? "DBIT") === "DBIT";
          const amount = isDebit ? -Math.abs(rawAmount) : Math.abs(rawAmount);
          allTransactions.push({
            transaction_id:
              t.transaction_id ?? t.entry_reference ?? `${uid}-${t.booking_date}-${rawAmount}`,
            booking_date: t.booking_date,
            amount,
            currency: t.transaction_amount?.currency ?? "EUR",
            creditor_name: t.creditor_name ?? null,
            debtor_name: t.debtor_name ?? null,
            description:
              t.remittance_information_unstructured ??
              (t.remittance_information ?? [])[0] ??
              t.additional_information ??
              null,
            raw_data: t as unknown as Record<string, unknown>,
          });
        }
      } catch (err) {
        console.error(`Failed to fetch transactions for account ${uid}:`, err);
        // Session may have expired
        if ((err as Error).message?.includes("401") || (err as Error).message?.includes("403")) {
          await admin.from("connected_banks").update({ status: "expired" }).eq("id", bank.id);
          return jsonResponse({ error: "Session expired, please reconnect", bank_status: "expired" }, 401);
        }
      }
    }

    // Upsert into bank_transactions
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
      for (let i = 0; i < rows.length; i += 500) {
        await admin
          .from("bank_transactions")
          .upsert(rows.slice(i, i + 500), { onConflict: "transaction_id" });
      }
    }

    const now = new Date();
    await admin
      .from("connected_banks")
      .update({
        status: "active",
        last_synced_at: now.toISOString(),
      })
      .eq("id", bank.id);

    // ─── Subscription detection ───────────────────────────────────────────
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
      txns.sort(
        (a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
      );
      const isKnownMerchant = KNOWN_MERCHANTS.some((m) => key.includes(m));
      const intervals: number[] = [];
      if (txns.length >= 2) {
        for (let i = 0; i < txns.length - 1; i++) {
          const d1 = new Date(txns[i].booking_date).getTime();
          const d2 = new Date(txns[i + 1].booking_date).getTime();
          intervals.push(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
        }
      }
      const avgInterval =
        intervals.length > 0
          ? intervals.reduce((a, b) => a + b, 0) / intervals.length
          : 30;
      const isConsistentInterval =
        intervals.length === 0 ||
        intervals.every((i) => Math.abs(i - avgInterval) / avgInterval < 0.4);
      const isRecurring = txns.length >= 2 && isConsistentInterval && avgInterval >= 5;
      const amounts = txns.map((t) => Math.abs(t.amount));
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const isConsistentAmount =
        amounts.every((a) => Math.abs(a - avgAmount) / avgAmount < 0.05) ||
        amounts.length === 1;
      const isSmallAmount = avgAmount < 150;

      if (isKnownMerchant || (isRecurring && isConsistentAmount && isSmallAmount)) {
        candidates.push({
          name: cleanMerchantName(txns[0].creditor_name || txns[0].description || key),
          amount: Math.round(avgAmount * 100) / 100,
          currency: txns[0].currency,
          billing_cycle: inferBillingCycle(intervals),
          last_charged: txns[0].booking_date,
          next_billing_date: inferNextDate(txns[0].booking_date, avgInterval),
          category_hint: inferCategory(key),
        });
      }
    }

    const { data: existingSubs } = await admin
      .from("subscriptions")
      .select("name")
      .eq("user_id", user.id);
    const existingNames = new Set(
      (existingSubs ?? []).map((s: { name: string }) => normalize(s.name))
    );

    const { data: existingDetected } = await admin
      .from("detected_subscriptions")
      .select("name")
      .eq("user_id", user.id)
      .eq("status", "pending");
    const existingDetectedNames = new Set(
      (existingDetected ?? []).map((s: { name: string }) => normalize(s.name))
    );

    const newCandidates = candidates.filter((c) => {
      const norm = normalize(c.name);
      return !existingNames.has(norm) && !existingDetectedNames.has(norm);
    });

    if (newCandidates.length > 0) {
      await admin.from("detected_subscriptions").insert(
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

    return jsonResponse({
      transactions_fetched: allTransactions.length,
      subscriptions_detected: newCandidates.length,
      bank_status: "active",
    });
  } catch (error) {
    console.error("Sync error:", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Internal server error" },
      500
    );
  }
});
