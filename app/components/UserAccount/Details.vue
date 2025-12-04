<script setup lang="ts">
  const props = defineProps({
    user: {
      type: Object,
      required: true,
    },
  });

  function formatDate(date: Date | undefined) {
    if (!date) {
      return "";
    }
    return new Intl.DateTimeFormat("default", { dateStyle: "long" }).format(date);
  }
</script>

<template>
  <!-- <div class="mt-6 rounded-lg border border-t border-gray-100 bg-white px-6"> -->

  <dl class="divide-y divide-gray-100">
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm leading-6 font-medium text-gray-900">Full name</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {{ user?.first_name }} {{ user?.last_name }}
      </dd>
    </div>
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm leading-6 font-medium text-gray-900">DOB</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {{ useDateFormat(user?.dob, "DD/MM/YYYY") || "Not set" }}
      </dd>
    </div>
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm leading-6 font-medium text-gray-900">Country</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {{ user?.country || "Not set" }}
      </dd>
    </div>
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm leading-6 font-medium text-gray-900">City</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {{ user?.city || "Not set" }}
      </dd>
    </div>
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm leading-6 font-medium text-gray-900">Signed up</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {{ useDateFormat(user?.created_at, "DD/MM/YYYY") || "Not set" }}
      </dd>
    </div>

    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm leading-6 font-medium text-gray-900">Email address</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {{ user?.email }}
      </dd>
    </div>
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm leading-6 font-medium text-gray-900">Verified?</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700 capitalize sm:col-span-2 sm:mt-0">
        <UiBadge
          v-if="user?.user_role"
          variant="secondary"
          class="bg-blue-500 text-white dark:bg-blue-600"
        >
          <Icon name="lucide:badge-check" />
          Verified
        </UiBadge>
        <UiBadge v-else variant="destructive">Not verified</UiBadge>
      </dd>
    </div>
    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt class="text-sm leading-6 font-medium text-gray-900">User role</dt>
      <dd class="mt-1 text-sm leading-6 text-gray-700 capitalize sm:col-span-2 sm:mt-0">
        <UiBadge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
          <Icon name="lucide:badge-check" />
          {{ user?.user_role || "standard" }}
        </UiBadge>
      </dd>
    </div>
  </dl>
  <!-- </div> -->
</template>
