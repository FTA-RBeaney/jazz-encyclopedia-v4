<script setup>
  const props = defineProps({
    user: Object,
  });

  const usage = ref({
    dailyCount: 0,
    quotaLimit: 10000,
    quotaPercentage: 0,
    status: "OK",
    lastReset: new Date().toISOString(),
    remainingQuota: 10000,
    timestamp: new Date().toISOString(),
  });

  const statusMap = {
    OK: {
      text: "Good",
      class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      progress: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
    },
    WARNING: {
      text: "Warning",
      class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      progress: "bg-yellow-500",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    CRITICAL: {
      text: "Critical",
      class: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      progress: "bg-orange-500",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    EXCEEDED: {
      text: "Exceeded",
      class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      progress: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400",
    },
  };

  const statusText = computed(() => statusMap[usage.value.status]?.text || "Unknown");
  const statusClass = computed(() => statusMap[usage.value.status]?.class || "");
  const progressBarClass = computed(() => statusMap[usage.value.status]?.progress || "bg-gray-500");
  const percentageColor = computed(
    () => statusMap[usage.value.status]?.textColor || "text-gray-600"
  );

  let refreshInterval = null;

  const fetchUsage = async () => {
    try {
      console.log("[ApiUsageCard] Fetching YouTube usage...");
      const { data, error } = await useFetch("/api/youtube/usage", { server: false });
      if (error?.value) throw error.value;
      if (data?.value) {
        // Ensure the status is one of the valid values
        const validStatus = ["OK", "WARNING", "CRITICAL", "EXCEEDED"];
        const status = validStatus.includes(data.value.status) ? data.value.status : "OK";

        usage.value = {
          ...data.value,
          status,
        };
        console.log("[ApiUsageCard] Usage updated:", usage.value);
      } else {
        console.warn("[ApiUsageCard] No data returned from /api/youtube/usage");
      }
    } catch (error) {
      console.error("Failed to fetch API usage:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  onMounted(() => {
    console.log("[ApiUsageCard] mounted");
    // Initial fetch
    fetchUsage();

    // Refresh every 5 minutes
    refreshInterval = setInterval(fetchUsage, 5 * 60 * 1000);
  });

  onBeforeUnmount(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });
</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
    <div class="mb-4 flex items-start justify-between">
      <div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">YouTube API Usage</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Daily quota usage and status</p>
      </div>
      <div class="rounded-full px-3 py-1 text-xs font-medium" :class="statusClass">
        {{ statusText }}
      </div>
    </div>

    <div class="space-y-4">
      <!-- Progress Bar -->
      <div>
        <div class="mb-1 flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-300">
            {{ usage.dailyCount.toLocaleString() }} / 10,000
          </span>
          <span class="font-medium" :class="percentageColor">
            {{ Math.round(usage.quotaPercentage * 100) }}%
          </span>
        </div>
        <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            class="h-2.5 rounded-full transition-all duration-500"
            :class="progressBarClass"
            :style="{
              width: `${Math.min(usage.quotaPercentage * 100, 100)}%`,
            }"
          ></div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
          <div class="text-gray-500 dark:text-gray-400">Remaining</div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ usage.remainingQuota.toLocaleString() }}
          </div>
        </div>
        <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
          <div class="text-gray-500 dark:text-gray-400">Last Reset</div>
          <div class="font-medium text-gray-900 dark:text-white">
            {{ formatDate(usage.lastReset) }}
          </div>
        </div>
      </div>

      <div class="text-xs text-gray-500 italic dark:text-gray-400">
        Last updated: {{ formatTime(usage.timestamp) }}
      </div>
    </div>
  </div>
</template>
