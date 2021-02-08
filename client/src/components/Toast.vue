<template>
   <transition name="toast">
   <div 
      class="toast-wrapper w-full h-12 px-2 mx-auto flex items-center justify-center absolute z-10"
      :class="{'bg-green-300': getType == 'success', 'bg-orange-300': getType == 'warning', 'bg-red-300': getType == 'error'}"
      v-if="isOpen"
   >
      <span class="ml-4 absolute left-0">
         <icon data="@icon/info.svg" color="#4B5563" width="1.2rem" height="1.2rem" :fill="false" />
      </span>
      <div class="py-1 ml-3">
         <p class="text-k-15 font-medium text-gray-600">{{ getContent }}</p>
      </div>
      <span
         class="mr-2 w-8 h-8 rounded-full inline-flex justify-center items-center cursor-pointer absolute right-0"
         @click="toggleIsOpen"
      >
         <icon data="@icon/x.svg" color="#4B5563" width=".8rem" height=".8rem" />
      </span>
   </div>
   </transition>
</template>

<script>
import { MUTATIONS } from '../store/types';

export default {
   name: "Toast",
   computed: {
      isOpen: function() {
         return this.$store.state.toast.isActive
      },
      getContent: function() {
         return this.$store.state.toast.content
      },
      getType: function() {
         return this.$store.state.toast.type
      }
   },
   methods: {
      toggleIsOpen: function() {
         this.$store.commit(MUTATIONS.TOGGLE_TOAST, {})
      }
   },
   mounted: function() {
      setTimeout(this.toggleIsOpen.bind(this), 10000)
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