<template>
   <div class="w-full h-full bg-white flex flex-col justify-center items-center">
      <!-- <img class="-mt-32" src="../assets/images/file-copy-animation.gif" alt="loading gif"> -->
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="background:transparent;display:block;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
         <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#818cf8" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round">
         <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur=".7s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
         </circle>
      </svg>
      <p class="text-18 font-semibold text-gray-600 mt-6">Forking Mayowa-Ojo/_WwEg-optional-interface</p>
      <p class="text-15 font-medium text-gray-500 mt-1">It will only take a few seconds</p>
      <button class="bg-gray-100 border border-gray-200 rounded-md px-4 py-1 text-15 text-gray-600 mt-4 hover:bg-gray-200 inline-flex items-center">
         <icon class="mr-2" data="@icon/sync.svg" color="#4B5563" width=".9rem" height=".9rem" />
         Rollback
      </button>
   </div>
</template>

<script>
export default {
   name: "Forking"
}

</script>

<style lang="scss" scoped>

</style>