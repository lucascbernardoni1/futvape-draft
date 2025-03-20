<template>
  <div :class="['bg-gray-800 rounded-lg shadow-lg overflow-hidden', className]">
    <div v-if="$slots.header" class="bg-gray-700 px-6 py-4">
      <slot name="header"></slot>
    </div>
    <div class="p-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: ''
  }
});
</script> 