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

    const body = await req.json();
    const { webhook_type, webhook_code, item_id } = body;

    console.log(`Plaid webhook: ${webhook_type} - ${webhook_code} for item ${item_id}`);

    if (webhook_type === "TRANSACTIONS") {
      // Fetch the plaid item to get user context
      const { data: plaidItem } = await supabase
        .from("plaid_items")
        .select("*")
        .eq("plaid_item_id", item_id)
        .single();

      if (!plaidItem) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (webhook_code === "SYNC_UPDATES_AVAILABLE") {
        // Trigger subscription detection for this user
        await supabase.functions.invoke("detect-subscriptions", {
          body: { user_id: plaidItem.user_id, plaid_item_id: item_id },
        });
      }

      // Update last synced timestamp
      await supabase
        .from("plaid_items")
        .update({ last_synced_at: new Date().toISOString() })
        .eq("id", plaidItem.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
