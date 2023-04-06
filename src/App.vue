<script setup>
  import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <NavBar />
    <div id="content" class="h-full">
      <router-view/>
    </div>
</div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

body {
  background: rgb(243 244 246); /*rgb(241 245 249);*/
}
</style>
