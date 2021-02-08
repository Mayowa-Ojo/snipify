<template>
   <div class="h-full w-full flex flex-col justify-center items-center">
      <span class="block w-24 h-24">
         <img class="" src="../assets/images/no-content-illustration.png" alt="no content illustration">
      </span>

      <p class="text-15 font-medium text-gray-600 mt-8">Nothing to show here</p>
      <p class="text-12 font-normal text-gray-600 mt-1">{{message}}</p>
   </div>
</template>

<script>
export default {
   name: "NoContent",
   props: ["message"]
}

</script>

<style lang="scss" scoped>

</style>