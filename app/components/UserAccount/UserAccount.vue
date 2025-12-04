<script setup lang="ts">
  // Use type-based props for script-setup with TS
  const props = defineProps<{
    user: Record<string, any>;
    src?: string;
    isAdmin?: boolean;
  }>();
</script>

<template>
  <div class="">
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="avatar btn btn-circle btn-ghost">
        <div
          class="hidden h-10 w-10 rounded-full ring-gray-200 ring-offset-2 outline-none lg:block lg:focus:ring-2"
        >
          <img v-if="src" :src="src" alt="avatar image" />
          <img v-else src="~/assets/images/avatar.svg" alt="default avatar image" />
        </div>
      </label>
      <ul
        tabindex="0"
        class="dropdown-content top-14 right-0 z-40 mt-6 space-y-6 bg-white lg:absolute lg:mt-0 lg:w-52 lg:space-y-0 lg:rounded-md lg:border lg:shadow-md"
      >
        <!-- <li v-if="user" class="block text-gray-600 hover:text-gray-900 lg:p-3 lg:hover:bg-gray-50">
          {{ user.email }}
        </li> -->
        <li v-if="isAdmin">
          <NuxtLink
            to="/admin"
            class="block text-gray-600 hover:text-gray-900 lg:p-3 lg:hover:bg-gray-50"
            >Admin</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="/account"
            class="block text-gray-600 hover:text-gray-900 lg:p-3 lg:hover:bg-gray-50"
            >Account</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="/user-videos"
            class="block text-gray-600 hover:text-gray-900 lg:p-3 lg:hover:bg-gray-50"
            >My videos</NuxtLink
          >
        </li>

        <li>
          <UserAccountSignout />
        </li>
        <UserAccountSwitch />
      </ul>
    </div>
  </div>
</template>
