<template>
   <div id="app">
      <main class="wrapper">
         <router-view />
      </main>
      <ModalWrapper />
   </div>
</template>

<script>
import ModalWrapper from "./components/ModalWrapper"
import { ACTIONS } from "./store/types"

export default {
   name: "App",
   components: {
      ModalWrapper
   },
   computed: {
      status: function() {
         return this.$store.state.status
      }
   },
   watch: {
      status: function(newVal) {
         if(newVal === "loading") {
            this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {
               component: "LoadingModal"
            })
            return
         }

         if(newVal === "forking") {
            this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {
               component: "Forking"
            })
            return
         }

         if(newVal === "comment-loading" || newVal === "comment-done") return

         this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {})
      }
   }
}
</script>

<style>
.wrapper {
   max-width: 1440px;
   margin: 0 auto;
}
</style>
