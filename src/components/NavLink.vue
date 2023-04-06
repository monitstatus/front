<template>
  <a
    :href="href"
    @click="navigate"
    :class="[isActive ? 'bg-gray-200' : 'text-gray-600 hover:bg-gray-200', 'px-3 py-2 rounded-md text-sm font-medium']"
  >
    {{ text }}
  </a>
</template>

<script>
export default {
  props: ['href', 'isActive', 'navigate', 'text']
}
</script>