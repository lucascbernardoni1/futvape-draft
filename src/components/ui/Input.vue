<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-300 mb-1">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="[
        'w-full rounded-md transition-colors duration-200 focus:outline-none focus:ring-2',
        sizes[size],
        variants[variant],
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      ]"
      :disabled="disabled"
      :placeholder="placeholder"
      v-bind="$attrs"
    />
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'transparent'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);

const id = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

const variants = {
  default: 'bg-gray-700 text-white',
  transparent: 'bg-transparent text-white'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};
</script> 