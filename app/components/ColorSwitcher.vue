<script setup>
  const { theme, setTheme } = useTheme();
  const themes = [
    { name: "Default", value: "default", color: "#6366f1" },
    { name: "Emerald", value: "emerald", color: "#10b981" },
    { name: "Rose", value: "rose", color: "#f43f5e" },
    { name: "Amber", value: "amber", color: "#f59e42" },
    { name: "Cyan", value: "cyan", color: "#06b6d4" },
    { name: "Violet", value: "violet", color: "#8b5cf6" },
    { name: "Indigo", value: "indigo", color: "#4f46e5" },
    { name: "Pink", value: "pink", color: "#ec4899" },
    { name: "Lime", value: "lime", color: "#84cc16" },
    { name: "Zinc", value: "zinc", color: "#71717a" },
    { name: "Black", value: "black", color: "#000000" },
  ];
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton size="icon-sm" variant="ghost">
        <Icon name="lucide:palette" />
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent align="end">
      <div class="p-2">
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="t in themes"
            :key="t.value"
            :style="{ backgroundColor: t.color }"
            class="size-6 rounded-full border border-white ring-offset-2"
            :class="{ 'ring-primary ring-1': theme === t.value }"
            @click="setTheme(t.value)"
            :aria-label="t.name"
          ></button>
        </div>
      </div>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
