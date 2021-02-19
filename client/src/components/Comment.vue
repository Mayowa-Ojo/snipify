<template>
   <div class="comment w-full flex">
      <div class="flex flex-col items-center pt-1">
         <span class="relative">
         <span class="w-8 h-8 inline-block rounded-full overflow-hidden" style="min-height: 32px;">
            <img class="image-cover" :src="comment.author.avatar" alt="user avatar">
            <span class="absolute bottom-0" style="right: -2px;">
               <icon data="@icon/heart.svg" color="#F87171" width=".8rem" height=".8rem" v-if="comment.likedBy.includes(authUser.id)"/>
            </span>
         </span>
         </span>
         <span class="inline-block h-full bg-gray-200 mt-1" style="width: 2px;"></span>
      </div>
      <div class="ml-4 pb-4 w-full">
         <div class="group flex">
            <div class="flex-auto">
            <p class="text-15 text-gray-400">
               <span class="font-medium text-gray-600 mr-1">{{comment.author.name}}</span> 
               {{comment.content}}
            </p>
            <div class="flex items-center mt-2">
               <span class="text-12 font-medium text-gray-400 inline-flex items-center">
                  <span 
                     class="cursor-pointer hover:underline"
                     @click="$emit('like-comment', { isReply: false, commentId: comment.id })"
                  >{{comment.likedBy.includes(authUser.id) ? 'Liked' : 'Like'}}</span>
                  <span 
                     class="bg-gray-200" 
                     style="font-size: 11px; padding: 0 3px; margin-left: 4px; border-radius: 4px;"
                     v-if="comment.likes > 0"
                  >{{comment.likes}}</span>
               </span>
               <span class="bg-gray-400 rounded-full inline-block mx-2" style="width: 4px; height: 4px;"></span>
               <span 
                  class="text-12 font-medium text-gray-400 cursor-pointer hover:underline"
                  @click="$emit('toggle-is-replying', comment)"
               >Reply</span>
               <span class="bg-gray-400 rounded-full inline-block mx-2" style="width: 4px; height: 4px;"></span>
               <span class="text-12 font-medium text-gray-400">3 days</span>
            </div>
            <div class="pt-1 pb-3" v-if="comment.replies.length > 0">
               <p 
                  class="text-12 font-medium text-gray-400 inline-flex items-center cursor-pointer hover:bg-gray-100 px-1 -ml-1 rounded"
                  @click="toggleReplies"
               >
                  {{comment.replies.length}} {{comment.replies.length > 1 ? 'replies' : 'reply'}}
                  <span class="ml-2 inline-block">
                     <svg 
                        class="fill-current text-gray-400 transform transition-transform duration-150 ease-linear" 
                        :class="!showReplies ? '-rotate-90' : 'rotate-0'" 
                        style="width: .6rem; height: .6rem; margin-bottom: 1px" 
                        viewBox="0 0 23 16" fill="none"
                     >
                        <path d="M11.5 15.5038L0.674681 0.503847L22.3253 0.503845L11.5 15.5038Z"/>
                     </svg>
                  </span>
               </p>
            </div>
            </div>
            <div class="h-full flex flex-col justify-center pt-4">
               <span class="inline-flex items-center justify-center w-6 h-6 cursor-pointer rounded-full opacity-100 hover:bg-gray-100 focus:opacity-100 group-hover:opacity-100">
                  <icon class="transform rotate-90" data="@icon/kebab_menu.svg" color="#9CA3AF" :fill="false" width="1rem" height="1rem" />
                  <Popover :placement="'bottom-end'" :zIndex="40">
                     <div>
                        <ul class="py-1">
                           <li 
                              class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                              v-if="hasAdminPrivilege(comment.author.id)"
                              @click="$emit('edit-comment', { comment, isReply: false })"
                           >Edit comment</li>
                           <li 
                              class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                              v-if="hasAdminPrivilege(comment.author.id)"
                              @click="handleDeleteComment(comment.id, false)"
                           >Delete comment</li>
                           <li class="text-12 text-red-500 py-2 px-4 text-left cursor-pointer hover:bg-gray-200">Report</li>
                        </ul>
                     </div>
                  </Popover>
               </span>
            </div>
         </div>
         <!-- replies to comment -->
         <div v-if="comment.replies.length > 0 && showReplies">
         <div class="comment-replies w-full flex" v-for="(reply, idx) in comment.replies" :key="idx">
            <div class="flex flex-col items-center pt-1">
               <span class="relative">
               <span class="w-8 h-8 inline-block rounded-full overflow-hidden" style="min-height: 32px;">
                  <img class="image-cover" :src="reply.author.avatar" alt="user avatar">
                  <span class="absolute bottom-0" style="right: -2px;">
                     <icon data="@icon/heart.svg" color="#F87171" width=".8rem" height=".8rem" v-if="reply.likedBy.includes(authUser.id)" />
                  </span>
               </span>
               </span>
            </div>
            <div class="ml-4 pb-4 flex-auto">
               <div class="group flex">
                  <div class="flex-auto">
                  <p class="text-15 text-gray-400">
                     <span class="font-medium text-gray-600 mr-1">{{reply.author.name}}</span> 
                     {{reply.content}}
                  </p>
                  <div class="flex items-center mt-2">
                     <span class="text-12 font-medium text-gray-400 inline-flex items-center">
                        <span 
                           class="cursor-pointer hover:underline"
                           @click="$emit('like-comment', { isReply: true, commentId: reply.id })"
                        >{{reply.likedBy.includes(authUser.id) ? 'Liked' : 'Like'}}</span>
                        <span 
                           class="bg-gray-200" 
                           style="font-size: 11px; padding: 0 3px; margin-left: 4px; border-radius: 4px;"
                           v-if="reply.likes > 0"
                        >{{reply.likes}}</span>
                     </span>
                     <span class="bg-gray-400 rounded-full inline-block mx-2" style="width: 4px; height: 4px;"></span>
                     <span class="text-12 font-medium text-gray-400">3 days</span>
                  </div>
                  </div>
                  <div class="h-full flex flex-col justify-center pt-4">
                     <span class="inline-flex items-center justify-center w-6 h-6 cursor-pointer opacity-0 rounded-full hover:bg-gray-100 focus:opacity-100 group-hover:opacity-100">
                        <icon class="transform rotate-90" data="@icon/kebab_menu.svg" color="#9CA3AF" :fill="false" width="1rem" height="1rem" />
                        <Popover :placement="'bottom-end'" :zIndex="40">
                           <div>
                              <ul class="py-1">
                                 <li 
                                    class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                    v-if="hasAdminPrivilege(reply.author.id)"
                                    @click="$emit('edit-comment', { comment: reply, isReply: true })"
                                 >Edit comment</li>
                                 <li 
                                    class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                    v-if="hasAdminPrivilege(reply.author.id)"
                                    @click="handleDeleteComment(reply.id, true, comment.id)"
                                 >Delete comment</li>
                                 <li class="text-12 text-red-500 py-2 px-4 text-left cursor-pointer hover:bg-gray-200">Report</li>
                              </ul>
                           </div>
                        </Popover>
                     </span>
                  </div>
               </div>
            </div>
         </div>
         </div>
      </div>
   </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import Popover from "./Popover"
import { ACTIONS } from "../store/types"

export default {
   name: "Comment",
   components: {
      Popover
   },
   props: ["comment"],
   data: () => ({
      showReplies: false
   }),
   computed: {
      ...mapState({
         authUser: (state) => state.auth.profile
      }),
      ...mapGetters([
         "hasAdminPrivilege"
      ])
   },
   methods: {
      toggleReplies: function() {
         this.showReplies = !this.showReplies
      },
      handleDeleteComment: async function(commentId, isReply, parentId) {
         await this.$store.dispatch(ACTIONS.DELETE_COMMENT, {
            commentId,
            isReply,
            parentId
         })
      }
   }
}

</script>

<style lang="scss" scoped>

</style>