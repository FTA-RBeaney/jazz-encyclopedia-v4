<script setup lang="ts">
  import { computed } from "vue";

  const props = defineProps({
    transactions: {
      type: Array,
      default: () => [],
    },
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const columns = [
    {
      data: "created",
      title: "Date",
      render: (data: string) => formatDate(data),
    },
    {
      data: "description",
      title: "Description",
    },
    {
      data: "amount",
      title: "Amount",
      render: (data: number, type: string, row: any) => formatCurrency(data, row.currency),
    },
    {
      data: "category",
      title: "Category",
    },
  ];

  const options = {
    responsive: true,
    select: true,
    dom: "Qfrtip", // SearchBuilder, Filter, Processing, Table, Info, Pagination
  };
</script>

<template>
  <UiDatatable :data="transactions" :columns="columns" :options="options" class="w-full" />
</template>
