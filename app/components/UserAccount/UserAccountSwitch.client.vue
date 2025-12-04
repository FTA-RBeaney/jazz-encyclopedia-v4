<script setup lang="ts">
  import { storeToRefs } from "pinia";

  const dbUser = useSupabaseUser();
</script>

<template>
  <template v-if="dbUser?.memberships && dbUser?.memberships.length > 1">
    <li class="block text-gray-600 hover:text-gray-900 lg:p-3 lg:hover:bg-gray-50">
      Switch Account
    </li>
    <li v-for="membership in dbUser?.memberships">
      <a
        v-if="membership.account_id !== activeAccountId && !membership.pending"
        class="block text-gray-600 hover:text-gray-900 lg:p-3 lg:hover:bg-gray-50"
        href="#"
        @click="accountStore.changeActiveAccount(membership.account_id)"
      >
        {{ membership.account.name }}
      </a>
      <span v-if="membership.pending"> {{ membership.account.name }} (pending) </span>
    </li>
  </template>
</template>
