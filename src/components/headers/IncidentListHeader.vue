<script setup>
import Header from './Header.vue'
</script>

<template>
  <Header
    itemName="Incident"
    ctaLinkRouteName="addMonitor"
    :showSearch="true"
    @search="(input) => $emit('search', input)"
  />
</template>

<script>
export default {
  emits: ['search'],
}
</script>
