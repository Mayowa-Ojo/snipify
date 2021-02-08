<template>
   <button
      class="h-8 px-3 bg-white rounded-lg border border-gray-300 text-12 text-gray-400 inline-flex items-center capitalize"
      :class="{'cursor-default': disabled}"
      type="button"
      :disabled="disabled"
   >
      {{selected}}
      <span class="inline-flex flex-col justify-center ml-4">
         <icon class="flip" data="@icon/chevron.svg" color="#9CA3AF" width=".5rem" height=".5rem" />
         <icon class="" data="@icon/chevron.svg" color="#9CA3AF" width=".5rem" height=".5rem" />
      </span>
      <Popover :placement="'bottom'" :name="'select-indent'">
         <ul class="py-1">
            <li class="text-12 text-gray-600 py-1 px-4 text-left font-medium cursor-default">{{label}}</li>
            <li
               class="text-12 text-gray-400 py-1 px-4 text-left cursor-pointer hover:bg-gray-200"
               v-for="(option, idx) in options"
               :key="idx"
               @click="$emit(event, option)"
            >{{option}}</li>
         </ul>
      </Popover>
   </button>
</template>

<script>
import Popover from "./Popover"

export default {
   name: "Select",
   components: {
      Popover
   },
   props: ["options", "label", "selected", "event", "disabled"]
}

</script>

<style lang="scss" scoped>
svg {
   margin: 1px 0;
   &.flip {
      transform: scale(-1);
   }
}
</style>