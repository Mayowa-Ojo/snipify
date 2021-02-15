<template>
   <transition name="toast">
   <div 
      class="toast-wrapper w-full h-12 px-2 mx-auto flex items-center justify-center absolute z-40"
      :class="{'bg-green-300': type == 'success', 'bg-orange-300': type == 'warning', 'bg-red-300': type == 'error'}"
      v-if="isActive"
   >
      <span class="ml-4 absolute left-0">
         <icon data="@icon/info.svg" color="#4B5563" width="1.2rem" height="1.2rem" :fill="false" />
      </span>
      <div class="py-1 ml-3">
         <p class="text-k-15 font-medium text-gray-600">{{ content }}</p>
      </div>
      <span
         class="mr-2 w-8 h-8 rounded-full inline-flex justify-center items-center cursor-pointer absolute right-0"
         @click="toggleToastActive"
      >
         <icon data="@icon/x.svg" color="#4B5563" width=".8rem" height=".8rem" />
      </span>
   </div>
   </transition>
</template>

<script>
import { mapState } from 'vuex';

import { MUTATIONS } from '../store/types';

export default {
   name: "Toast",
   computed: {
      ...mapState({
         isActive: (state) => state.toast.isActive,
         content: (state) => state.toast.content,
         type: (state) => state.toast.type,
      })
   },
   methods: {
      toggleToastActive: function() {
         this.$store.commit(MUTATIONS.TOGGLE_TOAST, {})
      }
   },
   updated: function() {
      if(this.isActive) {
         setTimeout(this.toggleToastActive.bind(this), 10000)
      }
   }
}
</script>

<style lang="scss" scoped>
.toast {
   &-enter-active, &-leave-active {
      transition: all 0.2s;
   }
   &-enter, &-leave-to {
      opacity: 0;
      transform: translateY(-5px);
   }
}
</style>