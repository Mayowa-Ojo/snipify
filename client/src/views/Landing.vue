<template>
   <div class="landing-page">
      <Toast />
      <header class="h-auto flex items-center px-8 py-4">
         <img class="w-20" src="../assets/logo.svg" alt="brand logo">
      </header>
      <section class="">
         <div class="mt-12 flex flex-col items-center">
            <h1 class="text-4xl text-gray-600 font-bold">Share code <span class="text-indigo-400">snippets</span> with the community</h1>
            <p class="text-18 text-gray-600 font-medium mt-8">Snipify helps you easily share small pieces of your code with others.</p>
            <p class="text-18 text-gray-600 font-medium">Do you have a cool solution to an algorithm or you want people to review your code? Share it!</p>
            <a :href="`https://github.com/login/oauth/authorize?client_id=${githubClientId}`">
               <button
                  class="text-15 text-gray-600 font-medium mt-8 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 inline-flex items-center hover:bg-gray-200 transition-colors ease-in duration-100"
               >
                  <icon data="@icon/github.svg" class="mr-2" width="1rem" height="1rem" />
                  Continue with Github
               </button>
            </a>

            <div class="hero w-4/5 mt-12 border border-gray-200 fixed">
            </div>
         </div>
      </section>
   </div>
</template>

<script>
import Toast from "../components/Toast"

export default {
   name: "Landing",
   components: {
      Toast
   },
   computed: {
      githubClientId: () => process.env.VUE_APP_GITHUB_CLIENT_ID
   }
}

</script>

<style lang="scss" scoped>
.landing-page {
   height: calc(100vh - 68px);
   .hero {
      height: calc(100vh - 68px);
      top: 50%;
      background-image: url("../assets/images/feed.png");
      background-size: cover;
      background-repeat: no-repeat;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
   }
}
</style>