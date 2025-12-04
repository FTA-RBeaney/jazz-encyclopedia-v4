export const useMonzo = () => {
  const loading = ref(false);
  const error = ref(null);
  const config = useRuntimeConfig();

  const userId = config.public.monzoId;
  const accessToken = config.public.monzoToken;

  console.log("Monzo Config Debug:", {
    userIdPresent: !!userId,
    userIdLength: userId?.length,
    tokenPresent: !!accessToken,
    tokenLength: accessToken?.length,
    tokenStart: accessToken?.substring(0, 5) + "...",
  });

  const fetchAccounts = async () => {
    if (!userId || !accessToken) {
      error.value = "Monzo credentials not configured in .env";
      return [];
    }

    loading.value = true;
    error.value = null;
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

  const fetchTransactions = async (accountId: string) => {
    loading.value = true;
    error.value = null;
    try {
      // Call our server proxy
      const response = await $fetch("/api/monzo/transactions", {
        query: {
          accountId: accountId,
        },
      });
      return response.transactions;
    } catch (e: any) {
      error.value = e.message || "Failed to fetch transactions";
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
