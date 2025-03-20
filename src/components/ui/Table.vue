<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left">
      <thead :class="['sticky top-0', headerClass]">
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="index"
            :class="[
              'px-4 py-2 font-medium text-gray-300',
              header.class || ''
            ]"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :class="[
            'border-t border-gray-700 hover:bg-gray-700/50 transition-colors',
            rowClass
          ]"
        >
          <td
            v-for="(header, colIndex) in headers"
            :key="colIndex"
            :class="['px-4 py-2', header.class || '']"
          >
            <slot
              :name="header.key"
              :row="row"
              :value="row[header.key]"
            >
              {{ row[header.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td
            :colspan="headers.length"
            class="px-4 py-4 text-center text-gray-400"
          >
            <slot name="empty">
              No data available
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    required: true,
    validator: (headers) => {
      return headers.every(header => 
        typeof header.key === 'string' && 
        typeof header.label === 'string'
      );
    }
  },
  rows: {
    type: Array,
    required: true
  },
  headerClass: {
    type: String,
    default: 'bg-gray-700'
  },
  rowClass: {
    type: String,
    default: ''
  }
});
</script> 