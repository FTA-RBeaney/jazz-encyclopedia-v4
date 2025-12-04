import { useMonzoAuthFlow } from "./useMonzoAuthFlow";

export const useMonzo = () => {
  const loading = ref(false);
  const error = ref(null);
  const { getStoredToken } = useMonzoAuthFlow();

  const fetchAccounts = async (userId: string) => {
    loading.value = true;
    error.value = null;
    const accessToken = getStoredToken();
    if (!accessToken) {
      error.value = "No valid Monzo access token";
      loading.value = false;
      throw new Error("No valid Monzo access token");
    }
    try {
      const response = await $fetch("https://api.monzo.com/accounts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        query: {
          account_type: "uk_retail",
        },
      });
      return response.accounts;
    } catch (e: any) {
      error.value = e.message || "Failed to fetch accounts";
      console.error("Monzo API Error:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const fetchTransactions = async (accountId: string, since?: string, before?: string) => {
    loading.value = true;
    error.value = null;
    const accessToken = getStoredToken();
    if (!accessToken) {
      error.value = "No valid Monzo access token";
      loading.value = false;
      throw new Error("No valid Monzo access token");
    }
    try {
      const query: Record<string, string> = {
        account_id: accountId,
        "expand[]": "merchant",
        limit: "100",
      };
      if (since) {
        query.since = since;
      }
      // Default 'before' to 2025-05-05T00:00:00Z if not provided
      if (before) {
        query.before = before;
      } else {
        query.before = "2025-05-05T00:00:00Z";
      }
      query.limit = "100";
      let allTransactions: unknown[] = [];
      // Monzo API does not support pagination, so fetch all available in the range
      const response = await $fetch("https://api.monzo.com/transactions", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        query,
      });
      const txs = response.transactions || [];
      allTransactions = allTransactions.concat(txs);
      return allTransactions;
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e) {
        // @ts-expect-error: Monzo API error object may not have a typed 'message' property, but we want to display it if present.
        error.value = (e as { message: string }).message || "Failed to fetch transactions";
      } else {
        error.value = "Failed to fetch transactions";
      }
      console.error("Monzo API Error:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    fetchAccounts,
    fetchTransactions,
  };
};
