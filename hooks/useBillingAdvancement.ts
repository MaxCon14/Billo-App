import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getNextBillingDate } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import type { BillingCycle } from "@/types/subscription";

interface OverdueSub {
  id: string;
  next_billing_date: string;
  billing_cycle: string;
}

/**
 * Advances next_billing_date for any subscription whose billing date has
 * already passed. Runs once on mount when the user is authenticated.
 */
export function useBillingAdvancement() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user?.id || hasRun.current) return;
    hasRun.current = true;

    async function advancePastDueDates() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: overdue } = await supabase
        .from("subscriptions")
        .select("id, next_billing_date, billing_cycle")
        .eq("user_id", user!.id)
        .eq("is_active", true)
        .lt("next_billing_date", today.toISOString().split("T")[0]);

      if (!overdue || overdue.length === 0) return;

      for (const sub of overdue as OverdueSub[]) {
        let nextDate = new Date(sub.next_billing_date);
        while (nextDate < today) {
          nextDate = getNextBillingDate(nextDate, sub.billing_cycle as BillingCycle);
        }

        await supabase
          .from("subscriptions")
          .update({ next_billing_date: nextDate.toISOString().split("T")[0] } as any)
          .eq("id", sub.id);
      }

      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    }

    advancePastDueDates();
  }, [user?.id]);
}
