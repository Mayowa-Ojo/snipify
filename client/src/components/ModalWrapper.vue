<template>
   <portal>
      <div 
         class="w-screen h-screen fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-30"
         v-if="modalActive"
         v-on:click.self="handleCloseModal"
      >
         <component 
            :is="currentModal"
            v-on:close-modal="handleCloseModal"
         >
         </component>
      </div>
   </portal>
</template>

<script>
import { Portal, setSelector } from "@linusborg/vue-simple-portal"
import LoadingModal from "./LoadingModal"
import AddCollectionModal from "./AddCollectionModal"
import AddSnipModal from "./AddSnipModal"
import CommentsModal from "./CommentsModal"
import Forking from "./Forking"
import { ACTIONS } from "../store/types"

setSelector("modal-target")

export default {
   name: "ModalWrapper",
   components: {
      Portal,
      LoadingModal,
      AddSnipModal,
      AddCollectionModal,
      CommentsModal,
      Forking
   },
   computed: {
      modalActive: function() {
         return this.$store.state.modal.isActive
      },
      currentModal: function() {
         return this.$store.state.modal.component
      }
   },
   methods: {
      handleCloseModal: function() {
         this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {});
      }
   }
};
</script>

<style lang="scss" scoped>

</style>