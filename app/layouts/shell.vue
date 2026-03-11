<script setup lang="ts">
  const accountStore = useUserStore();
  const { profile } = storeToRefs(accountStore);
</script>

<template>
  <div class="relative">
    <!--header-->
    <nav class="fixed w-full bg-white px-6 py-3.5 shadow-sm lg:shadow-none dark:bg-gray-900">
      <div class="flex flex-col items-center justify-between gap-1 sm:gap-6 lg:flex-row">
        <div class="flex w-full items-center justify-between lg:w-auto">
          <a href="#" class="block">
            <img
              src="https://pagedone.io/asset/uploads/1701235273.png"
              alt="Pagedone logo image"
              class="block object-cover dark:hidden"
            />
            <img
              src="https://pagedone.io/asset/uploads/1712310504.png"
              alt="Pagedone logo image"
              class="hidden object-cover dark:block"
            />
          </a>
          <button
            id="navbar-toggle"
            type="button"
            class="ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden dark:hover:bg-gray-700"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div id="mobile-navbar" class="hidden w-full flex-1 flex-row lg:flex">
          <ul
            class="flex flex-col items-center gap-2 text-center lg:ml-auto lg:flex-row lg:gap-2 xl:gap-4"
          >
            <li>
              <a
                href="#"
                class="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-500 ease-in-out"
                >Dashboard</a
              >
            </li>
            <li>
              <a
                href="#"
                class="rounded-md bg-transparent px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all duration-500 ease-in-out hover:bg-indigo-600 hover:text-white dark:text-white"
                >Employees</a
              >
            </li>
            <li>
              <a
                href="#"
                class="rounded-md bg-transparent px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all duration-500 ease-in-out hover:bg-indigo-600 hover:text-white dark:text-white"
                >Attendances</a
              >
            </li>
            <li>
              <a
                href="#"
                class="rounded-md bg-transparent px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all duration-500 ease-in-out hover:bg-indigo-600 hover:text-white dark:text-white"
                >Calendar</a
              >
            </li>
            <li>
              <a
                href="#"
                class="rounded-md bg-transparent px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all duration-500 ease-in-out hover:bg-indigo-600 hover:text-white dark:text-white"
                >Leaves</a
              >
            </li>
            <li>
              <a
                href="#"
                class="rounded-md bg-transparent px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all duration-500 ease-in-out hover:bg-indigo-600 hover:text-white dark:text-white"
                >Payroll</a
              >
            </li>
            <li>
              <a
                href="#"
                class="rounded-md bg-transparent px-3 py-1.5 text-xs font-semibold text-gray-500 transition-all duration-500 ease-in-out hover:bg-indigo-600 hover:text-white dark:text-white"
                >Document</a
              >
            </li>
          </ul>
          <div class="items-center gap-1 text-center sm:gap-4 lg:ml-auto lg:flex">
            <div class="flex items-center justify-center gap-1 sm:gap-2 lg:justify-start">
              <div class="relative w-max p-3">
                <svg
                  class=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M17.5001 17.5L15.4167 15.4167M15.8334 9.16667C15.8334 5.48477 12.8486 2.5 9.16673 2.5C5.48483 2.5 2.50006 5.48477 2.50006 9.16667C2.50006 12.8486 5.48483 15.8333 9.16673 15.8333C11.0006 15.8333 12.6615 15.0929 13.8668 13.8947C15.0814 12.6872 15.8334 11.0147 15.8334 9.16667Z"
                    stroke="#6B7280"
                    stroke-width="1.3"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </div>
              <p class="font-normal text-gray-200 dark:text-gray-700">|</p>
              <button class="flex h-8 w-8 items-center justify-center sm:h-11 sm:w-11 lg:p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M11.3235 2.5H9.16667C6.02397 2.5 4.45262 2.5 3.47631 3.47631C2.5 4.45262 2.5 6.02397 2.5 9.16667V10.8333C2.5 13.976 2.5 15.5474 3.47631 16.5237C4.45262 17.5 6.02397 17.5 9.16667 17.5H10.8333C13.976 17.5 15.5474 17.5 16.5237 16.5237C17.5 15.5474 17.5 13.976 17.5 10.8333V9.55882M10 10H5.83333M12.5 13.3333H5.83333M17.5 4.58333C17.5 5.73393 16.5673 6.66667 15.4167 6.66667C14.2661 6.66667 13.3333 5.73393 13.3333 4.58333C13.3333 3.43274 14.2661 2.5 15.4167 2.5C16.5673 2.5 17.5 3.43274 17.5 4.58333Z"
                    stroke="#6B7280"
                    stroke-width="1.3"
                    stroke-linecap="round"
                  ></path>
                </svg>
              </button>
            </div>
            <ColorSwitcher />
          </div>
        </div>
      </div>
    </nav>
    <!--main content-->
    <div class="pt-[68px]">
      <div class="bg-gray-50 px-3 py-3.5 lg:px-8 dark:bg-gray-800">
        <div class="block max-lg:pl-6">
          <h6
            class="mb-1.5 text-sm font-semibold whitespace-nowrap text-gray-900 sm:text-lg dark:text-white"
          >
            Welcome back,
            <span class="text-base font-semibold text-indigo-600 sm:text-lg">
              {{ profile?.first_name }}!</span
            >
          </h6>
          <p class="text-xs font-medium text-gray-900 dark:text-white">Home</p>
        </div>
      </div>
      <div class="w-full p-8">
        <div class="rounded-xl">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
