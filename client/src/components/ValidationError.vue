<template>
   <transition name="form-validation">
      <ul 
         class="validation mt-2"
         v-if="validations.length >= 1"
      >
         <li 
            class="text-12 text-gray-500 font-normal"
            v-for="(item, idx) in validations"
            v-bind:key="idx"
         >
            <svg class="fill-current text-red-500 inline-block mx-2" width="6" height="7" viewBox="0 0 7 8" fill="none">
               <path opacity="0.7" d="M3.5 0.5C1.568 0.5 0 2.068 0 4C0 5.932 1.568 7.5 3.5 7.5C5.432 7.5 7 5.932 7 4C7 2.068 5.432 0.5 3.5 0.5Z" />
            </svg>
            {{ item }}
         </li>
      </ul>
   </transition>
</template>

<script>
export default {
   name: "ValidationError",
   props: ["validations"]
}
</script>

<style lang="scss" scoped>
.form-validation {
   &-enter-active, &-leave-active {
      transition: all .2s;
   }
   &-enter, &-leave-to {
      opacity: 0;
      transform: translateY(-3px);
   }
}
.validation {
   &.default {
      bottom: -1.3rem;
   }
}
</style>