<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";

  definePageMeta({ layout: "admin" });

  const config = useRuntimeConfig();
  const { fetchAccounts, fetchTransactions, loading, error } = useMonzo();
  const { startLogin, getStoredToken } = useMonzoAuthFlow();

  const accounts = ref<any[]>([]);
  const selectedAccountId = ref<string | null>(config.public.monzoAccountId || null);
  interface MonzoTransaction {
    id: string;
    amount: number;
    created: string;
    [key: string]: unknown;
  }
  const transactions = ref<MonzoTransaction[]>([]);

  const needsMonzoLogin = ref(false);

  const checkMonzoAuth = () => {
    const token = getStoredToken();
    needsMonzoLogin.value = !token;
  };

  const loadAccounts = async () => {
    if (config.public.monzoAccountId) {
      selectedAccountId.value = config.public.monzoAccountId;
      return;
    }
    try {
      const accs = await fetchAccounts();
      accounts.value = accs || [];
      if (accs && accs.length > 0) {
        selectedAccountId.value = accs[0].id;
      }
    } catch {}
  };

  const loadTransactions = async (since?: string, before?: string, filterIncoming?: boolean) => {
    if (!selectedAccountId.value) return;
    try {
      const txs = await fetchTransactions(selectedAccountId.value, since, before);
      let filtered: MonzoTransaction[] = txs || [];
      if (filterIncoming) {
        filtered = filtered.filter((tx: MonzoTransaction) => tx.category === "income");
      }
      transactions.value = filtered;
    } catch {}
  };

  const selectedMonth = ref<string>("");
  const selectedYear = ref<string>("");
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

  const fetchForSelectedMonth = async () => {
    if (!selectedMonth.value || !selectedYear.value) return;
    const since = `${selectedYear.value}-${selectedMonth.value}-01T00:00:00Z`;
    const nextMonth = Number(selectedMonth.value) === 12 ? 1 : Number(selectedMonth.value) + 1;
    const nextYear =
      Number(selectedMonth.value) === 12
        ? Number(selectedYear.value) + 1
        : Number(selectedYear.value);
    const before = `${nextYear.toString().padStart(4, "0")}-${nextMonth.toString().padStart(2, "0")}-01T00:00:00Z`;
    await loadTransactions(since, before);
  };

  const fetchIncomingTransfers = async () => {
    const since = "2024-04-05T00:00:00Z";
    let before = "2025-04-05T00:00:00Z";
    let allTxs: MonzoTransaction[] = [];
    while (true) {
      const txs = await fetchTransactions(selectedAccountId.value, since, before);
      if (!txs || txs.length === 0) break;
      allTxs = allTxs.concat(txs);
      if (txs.length < 100) break;
      const oldest = txs.reduce((min, tx) => (tx.created < min.created ? tx : min), txs[0]);
      before = oldest.created;
    }
    const filtered = allTxs.filter((tx: MonzoTransaction) => tx.category === "income");
    transactions.value = filtered;
  };

  onMounted(() => {
    checkMonzoAuth();
    if (!needsMonzoLogin.value) {
      loadAccounts();
    }
  });

  watch(needsMonzoLogin, (val) => {
    if (!val) loadAccounts();
  });
</script>

<template>
  <div class="container mx-auto space-y-6 p-6">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Monzo Transactions</h1>
      <div v-if="needsMonzoLogin" class="flex flex-col items-center gap-4 py-12">
        <p class="text-lg text-gray-700">
          You need to connect your Monzo account to view transactions.
        </p>
        <UiButton color="primary" @click="startLogin()">Connect Monzo</UiButton>
      </div>
      <template v-else>
        <div
          v-if="error"
          class="space-y-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-500"
        >
          <p><strong>Error:</strong> {{ error }}</p>
          <div class="mt-2 border-t border-red-200 pt-2 text-xs text-gray-600">
            <p><strong>Debug Info:</strong></p>
            <p>
              User ID Configured:
              {{ config.public.monzoId ? `Yes (${config.public.monzoId})` : "No" }}
            </p>
            <p>
              Account ID Configured:
              {{ config.public.monzoAccountId ? `Yes (${config.public.monzoAccountId})` : "No" }}
            </p>
            <p>
              Token Configured:
              {{
                config.public.monzoToken ? `Yes (Length: ${config.public.monzoToken.length})` : "No"
              }}
            </p>
            <p v-if="config.public.monzoToken">
              Token Start: {{ config.public.monzoToken.substring(0, 10) }}...
            </p>
          </div>
        </div>
        <div v-if="loading && transactions.length === 0" class="text-gray-500">Loading...</div>
        <div class="space-y-4">
          <div
            v-if="!config.public.monzoAccountId && accounts.length > 0"
            class="flex items-center gap-4"
          >
            <UiLabel>Select Account:</UiLabel>
            <UiSelect v-model="selectedAccountId">
              <UiSelectTrigger class="w-[280px]">
                <UiSelectValue placeholder="Select an account" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem v-for="acc in accounts" :key="acc.id" :value="acc.id">
                  {{ acc.description || acc.id }}
                </UiSelectItem>
              </UiSelectContent>
            </UiSelect>
          </div>
          <div class="flex flex-wrap items-end gap-4">
            <div>
              <UiLabel>Month</UiLabel>
              <UiSelect v-model="selectedMonth">
                <UiSelectTrigger class="w-[140px]">
                  <UiSelectValue placeholder="Select month" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem v-for="m in months" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </div>
            <div>
              <UiLabel>Year</UiLabel>
              <UiSelect v-model="selectedYear">
                <UiSelectTrigger class="w-[100px]">
                  <UiSelectValue placeholder="Select year" />
                </UiSelectTrigger>
                <UiSelectContent>
                  <UiSelectItem v-for="y in years" :key="y" :value="y">
                    {{ y }}
                  </UiSelectItem>
                </UiSelectContent>
              </UiSelect>
            </div>
            <button class="btn btn-primary" @click="fetchForSelectedMonth">Show Month</button>
            <button class="btn btn-secondary" @click="fetchIncomingTransfers">
              Show Incoming Transfers
            </button>
          </div>
          <UiCard v-if="transactions.length > 0">
            <UiCardContent class="pt-6">
              <MonzoTransactionsTable :transactions="transactions" />
            </UiCardContent>
          </UiCard>
        </div>
      </template>
    </div>
  </div>
</template>
