<template>
   <div 
      class="flex justify-between items-start pl-6 pr-4 py-4 border-l-4 border-transparent cursor-pointer hover:bg-gray-200"
      :class="{'border-indigo-400 bg-white': isActive}"
   >
      <div class="h-full">
         <icon v-if="snip.source" data="@icon/fork.svg" color="#9CA3AF" width="1.2rem" height="1.2rem"/>
         <icon v-else data="@icon/codepen.svg" color="#9CA3AF" width="1.2rem" height="1.2rem"/>
      </div>
      <div class="flex-auto flex flex-col ml-4">
         <p class="text-18 font-medium text-gray-600 line-clamp-1">{{snip.title}}</p>
         <p class="text-15 font-normal text-gray-600 mt-1 line-clamp-2">{{snip.description}}</p>
         <span 
            class="badge mt-2 text-12 text-gray-500 inline-block bg-transparent border border-gray-300"
            v-if="snip.permission === 'private'"
         >secret</span>
      </div>
      <div class="flex flex-col items-center ml-2">
         <span class="inline-block w-8 h-8 rounded-full overflow-hidden">
            <img class="image-cover" :src="snip.author.avatar" alt="user avatar">
         </span>
         <span class="text-12 font-medium text-gray-600 mt-2">{{getTimeSince(snip.createdAt, 'short')}}</span>
      </div>
   </div>
</template>

<script>
import { dateMixin } from "../utils/mixins"

export default {
   name: "SnipPreview",
   props: ["snip", "isActive"],
   mixins: [dateMixin]
}

</script>

<style lang="scss" scoped>
.badge {
   padding: 0px 10px;
   width: max-content;
   border-radius: 6px;
}
</style>