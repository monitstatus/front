<template>
  <div class="bg-white h-96 flex flex-col items-center justify-center w-full">
    <div class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
      You have no {{ itemName }}s!
    </div>
    <div class="py-4">
      Start creating your first {{ itemName }}.
    </div>
    <router-link
      :to="{name: ctaLinkRouteName}"
      tag="button" type="button" class="mt-4 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700">
      Get started
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['itemName', 'ctaLinkRouteName']
}
</script>
