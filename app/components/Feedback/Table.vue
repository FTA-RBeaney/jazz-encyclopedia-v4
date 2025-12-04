<script lang="ts" setup>
  import SignalHigh from "@/assets/img/icons/signal-high.svg";
  import SignalLow from "@/assets/img/icons/signal-low.svg";
  import SignalMedium from "@/assets/img/icons/signal-medium.svg";
  import type { Config } from "datatables.net";

  const props = defineProps<{ data: array[] }>();
  const options = ref();
  type Item = (typeof props.data)[number];
  const search = ref("");

  const filteredData = computed(() => {
    if (!search.value) return props.data;
    return props.data.filter((item) =>
      item.title.toLowerCase().includes(search.value.toLowerCase())
    );
  });

  const styles = {
    high: "bg-red-400/20 text-red-500",
    medium: "bg-amber-400/20 text-amber-500",
    low: "bg-green-400/20 text-green-500",
  } as const;

  const signalMap = {
    high: SignalHigh,
    medium: SignalMedium,
    low: SignalLow,
  };

  onMounted(async () => {
    const DataTable = await import("datatables.net").then((mod) => mod.default || mod);

    options.value = {
      dom: `<'overflow-hidden rounded-lg border border-border bg-background'<'${tw`overflow-auto`}'t>>`,
      paging: false,
      columns: [
        { data: null, searchable: false, orderable: false, render: DataTable?.render?.select() },
        { title: "ID", data: "id", visible: false },
        { title: "Title", data: "title" },
        {
          title: "Type",
          searchable: false,
          orderable: false,
          data: "type",
          render: "#types",
        },
        { title: "Priority", data: "priority", render: "#priority" },
        { title: "Status", data: "status", render: "#status" },
        {
          title: "",
          data: "profiles",
          render: "#created_by",
          className: "w-12",
          orderable: false,
          searchable: false,
        },
        { title: "Created At", data: "created_at", render: "#created_at" },
        // { data: "volume", title: "Volume" },
        // {
        //   data: "cpc",
        //   title: "CPC",
        //   render(d) {
        //     return formatCurrency(d);
        //   },
        // },
        // { data: "traffic", title: "Traffic" },
        // {
        //   title: "Link",
        //   orderable: false,
        //   data: null,
        //   render: {
        //     _: "link",
        //     display: "#link",
        //   },
        // },
      ],
      select: {
        style: "multi",
        selector: "td:first-child",
      },
      order: [[1, "asc"]],
      language: {
        search: "",
        searchPlaceholder: "Search by keyword",
      },
    } as Config;
  });
</script>

<template>
  <div>
    <div class="mt-2 mb-6 flex items-center">
      <div class="w-full md:max-w-sm">
        <UiInput
          v-model="search"
          label="Keyword"
          placeholder="Search by title"
          icon="lucide:search"
          class="bg-white"
        />
      </div>
    </div>

    <UiDatatable v-if="options" :data="filteredData" :options>
      <template #types="{ cellData }">
        <UiBadge class="capitalize" :class="[styles[cellData]]">{{ cellData }}</UiBadge>
      </template>
      <template #priority="{ cellData }">
        <div class="flex items-center gap-0">
          <UiBadge class="capitalize" :class="[styles[cellData]]">
            {{ cellData }}
          </UiBadge>
        </div>
      </template>
      <template #status="{ cellData }">
        <div class="flex items-center gap-0">
          <UiBadge class="capitalize" variant="bordered" :class="[styles[cellData]]">
            {{ cellData }}
          </UiBadge>
        </div>
      </template>
      <template #link="{ cellData }: { cellData: Item }">
        <a :href="cellprops.data.link" target="_blank" class="hover:underline">
          {{ cellprops.data.link }}
        </a>
      </template>
      <template #created_by="{ cellData }">
        <div class="flex items-center justify-center gap-2">
          <UiTooltip>
            <UiTooltipTrigger as-child>
              <UiAvatar class="size-6">
                <UiAvatarImage :src="cellData?.avatar_url" />
              </UiAvatar>
            </UiTooltipTrigger>
            <UiTooltipContent class="py-3">
              <div class="flex items-center gap-2">
                <img
                  class="w-12 rounded object-cover"
                  :src="cellData?.avatar_url"
                  alt="I should have bought you flowers 😘"
                />
                <div class="w-9/12 space-y-1">
                  <p class="text-[13px] font-medium font-semibold">
                    {{ cellData?.first_name || "Unknown User" }} {{ cellData?.last_name || "" }}
                  </p>
                  <p class="text-muted-foreground text-[12px]">
                    {{ cellData?.email || "No bio available." }}
                  </p>
                </div>
              </div>
            </UiTooltipContent>
          </UiTooltip>
          <!-- {{ cellData?.first_name || "Unknown User" }} -->
        </div>
      </template>
      <template #created_at="{ cellData }">
        {{ useDateFormat(cellData, "Do MMM YYYY") }}
      </template>
    </UiDatatable>
  </div>
</template>

<style>
  body table.dataTable th,
  body table.dataTable td {
    @apply truncate;
    max-width: 200px;
    overflow: hidden;
    width: auto;
    padding-block: 0.6rem;
    font-size: 0.8rem;
    align-items: center;

    &.dt-select {
      width: 30px;
    }
  }
  @reference "~/assets/css/main.css";

  body table.dataTable.display > thead > tr > th,
  body table.dataTable.display > tbody > tr > td {
    border-bottom-width: 0px;
    border-top-width: 0px;
    align-items: center;
    vertical-align: middle;
  }
  body table.dataTable tbody tr {
    @apply odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent;
  }
  body table.dataTable tbody {
    tr {
      @apply rounded-lg;
    }
  }
</style>
