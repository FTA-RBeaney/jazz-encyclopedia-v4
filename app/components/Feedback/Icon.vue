<script setup>
  import SignalHigh from "@/assets/img/icons/signal-high.svg";
  import SignalLow from "@/assets/img/icons/signal-low.svg";
  import SignalMedium from "@/assets/img/icons/signal-medium.svg";

  const props = defineProps({
    signal: {
      type: String,
      required: true,
    },
  });

  const signalMap = {
    high: SignalHigh,
    medium: SignalMedium,
    low: SignalLow,
  };
</script>

<template>
  <div>
    <component :is="signalMap[props.signal]" />
  </div>
</template>
