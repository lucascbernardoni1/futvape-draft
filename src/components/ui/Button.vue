<template>
  <button
    :class="[
      'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      variants[variant],
      sizes[size],
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      className
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'ghost'].includes(value)
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
  className: {
    type: String,
    default: ''
  }
});

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 hover:text-white focus:ring-gray-500'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};
</script> 