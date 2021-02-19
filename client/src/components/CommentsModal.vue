<template>
   <div class="wrapper bg-white rounded-xl overflow-hidden flex flex-col relative">
      <div 
         class="absolute inset-0 bg-gray-900 bg-opacity-50 w-full h-full z-30 flex justify-center items-center"
         v-if="commentLoading"
      >
         <svg style="background:transparent;display:block;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="32" stroke-width="8" stroke="white" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur=".7s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
            </circle>
         </svg>
      </div>
      <header class="px-4 py-4 flex justify-between items-center bg-gray-100">
         <div class="flex items-center">
            <span 
               class="inline-flex w-8 h-8 items-center justify-center rounded-full cursor-pointer hover:bg-gray-200"
               @click="closeModal"
            >
               <icon class="transform rotate-90" data="@icon/chevron.svg" color="#4B5563" width=".8rem" height=".8rem"/>
            </span>
            <p class="text-18 font-medium text-gray-600 ml-1">Comments</p>
            <span
               class="text-12 text-gray-600 font-medium ml-4 inline-block bg-gray-300"
               style="padding: 2px 8px; border-radius: 8px; margin-top: 2px;"
            >{{snipComments.length}}</span>
         </div>
         <span>
            <icon data="@icon/chat.svg" color="#9CA3AF" width="1.3rem" height="1.3rem" :fill="false" />
         </span>
      </header>
      <div class="flex-auto" v-if="snipComments.length < 1">
         <NoContent :message="'Write something about this snip below...'"/>
      </div>
      <div class="scrollable flex flex-col items-center pl-8 pr-6 py-6 flex-auto overflow-y-auto" v-else>
         <Comment
            v-for="(comment, idx) in snipComments"
            :key="idx"
            :comment="comment"
            v-on:toggle-is-replying="toggleIsReplying($event)"
            v-on:like-comment="handleLikeComment($event)"
            v-on:edit-comment="toggleIsEditing($event)"
         />
         <div class="w-full h-8 rounded-full bg-gray-100 flex items-center justify-center" style="min-height: 32px">
            <p class="text-12 font-medium text-gray-400 text-center">No more comments...</p>
         </div>
      </div>
      <footer class="w-full pb-6 pt-4 px-8 relative">
         <div class="input-box w-full h-10 px-2 bg-gray-100 rounded-xl border border-gray-200 flex items-center relative z-20">
            <span class="w-6 h-6 rounded-full overflow-hidden inline-block">
               <img class="image-cover" :src="authUser.avatar" alt="user avatar">
            </span>
            <input 
               type="text"
               placeholder="Add a comment"
               ref="commentInput"
               class="flex-auto px-2 text-15 text-gray-600 appearance-none bg-transparent h-full focus:outline-none"
               v-model="commentInput"
               @keyup.enter.prevent="handleSubmit"
            >
            <span
               class="send-btn inline-flex items-center justify-center rounded-lg bg-gray-300 cursor-pointer hover:bg-indigo-300"
               style="width: 28px; height: 28px;"
               @click="handleSubmit"
            >
               <icon data="@icon/paper_plane.svg" color="#4B5563" width=".8rem" height=".8rem" />
            </span>
         </div>
         <transition name="fade">
         <div 
            class="reply-overlay bg-white border border-gray-300 absolute mx-auto px-4 pt-3 pb-16 flex z-10"
            v-if="reply.isReplying || edit.isEditing"
         >
            <div class="flex flex-col h-full items-center">
               <span>
                  <icon data="@icon/reply.svg" color="#4B5563" width=".9rem" height=".9rem" v-if="reply.isReplying" />
                  <icon data="@icon/pen.svg" color="#4B5563" width="1rem" height="1rem" v-if="edit.isEditing" />
               </span>
            </div>
            <div class="flex-auto flex flex-col ml-3" v-if="reply.isReplying">
               <p class="text-15 font-medium text-gray-600">Replying to {{reply.comment.author.name}}:</p>
               <p class="text-15 text-gray-400 mt-2">{{reply.comment.content}}</p>
            </div>
            <div class="flex-auto flex flex-col ml-3" v-if="edit.isEditing">
               <p class="text-15 font-medium text-gray-600">Edited by {{edit.comment.author.name}}:</p>
               <!-- <p class="text-15 text-gray-400 mt-2">{{reply.comment.content}}</p> -->
            </div>
            <div class="flex flex-col">
               <span 
                  class="inline-flex items-center justify-center w-6 h-6 rounded-full cursor-pointer hover:bg-gray-200"
                  @click="toggleIsReplying();toggleIsEditing({})"
               >
                  <icon data="@icon/x.svg" color="#4B5563" width=".75rem" height=".75rem" />
               </span>
            </div>
         </div>
         </transition>
      </footer>
   </div>
</template>

<script>
import { mapState } from 'vuex'

import { ACTIONS } from "../store/types"
import NoContent from "./NoContent"
import Comment from "./Comment"

export default {
   name: "CommentsModal",
   components: {
      Comment,
      NoContent
   },
   data: () => ({
      commentInput: "",
      reply: {
         isReplying: false,
         comment: {}
      },
      edit: {
         isEditing: false,
         isReply: false,
         comment: {}
      }
   }),
   computed: {
      ...mapState({
         snipComments: (state) => state.comments.all,
         commentLoading: (state) => state.status === "comment-loading",
         authUser: (state) => state.auth.profile
      })
   },
   methods: {
      closeModal: function() {
         this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {})
      },
      setInputFocus: function() {
         const commentInput = this.$refs["commentInput"]

         commentInput.focus()
      },
      toggleIsReplying: function(comment) {
         if(!comment) {
            this.reply = { ...this.reply, isReplying: false, comment: {}}
            return
         }

         this.toggleIsEditing({})
         this.reply = { ...this.reply, isReplying: true, comment }
         this.setInputFocus()
      },
      toggleIsEditing: function({ comment, isReply }) {
         if(!comment) {
            this.edit = { ...this.edit, isEditing: false, isReply: false, comment: {}}
            this.commentInput = ""
            return
         }

         this.toggleIsReplying()
         this.edit = { ...this.edit, isEditing: true, isReply, comment }
         this.commentInput = comment.content
         this.setInputFocus()
      },
      handleSubmit: async function() {
         if(!this.commentInput) return

         if(this.reply.isReplying) {
            await this.$store.dispatch(ACTIONS.CREATE_COMMENT_REPLY, {
               commentId: this.reply.comment.id,
               data: {
                  content: this.commentInput
               }
            })

            this.toggleIsReplying()
            this.commentInput = ""
            return
         }

         if(this.edit.isEditing) {
            await this.$store.dispatch(ACTIONS.EDIT_COMMENT, {
               commentId: this.edit.comment.id,
               isReply: this.edit.isReply,
               data: {
                  content: this.commentInput
               }
            })

            this.toggleIsEditing({})
            this.commentInput = ""
            return
         }

         await this.$store.dispatch(ACTIONS.CREATE_COMMENT, {
            data: {
               content: this.commentInput
            },
            snipId: this.$store.state.snips.current.id
         })

         this.commentInput = ""
      },
      handleLikeComment: async function({ isReply, commentId }) {
         await this.$store.dispatch(ACTIONS.LIKE_COMMENT, {
            isReply,
            commentId
         })
      }
   },
   created: async function() {
      await this.$store.dispatch(ACTIONS.FETCH_SNIP_COMMENTS, {
         snipId: this.$store.state.snips.current.id
      })
   },
   mounted: function() {
      this.setInputFocus()
   }
}

</script>

<style lang="scss" scoped>
.wrapper {
   width: 500px;
   max-height: 80vh;
   height: 80vh;
}
.chevron-alt {
   margin-bottom: 2px;
}
.input-box {
   transition: box-shadow .2s linear;
   transition: background-color .2s linear;
   &:hover {
      background-color: white;
      border: 1px solid #D1D5DB;
      box-shadow: 0px 0px 0px 4px rgba(129, 140, 248, 0.1);
   }
   &:focus-within {
      background-color: white;
      border: 1px solid #D1D5DB;
      box-shadow: 0px 0px 0px 4px rgba(129, 140, 248, 0.2);
   }
}
.scrollable {
   &::-webkit-scrollbar {
      width: 12px;
   }
   &::-webkit-scrollbar-thumb {
      background: #9CA3AF;
      border-radius: 20px;
      border: 4px solid white;
   }
   &::-webkit-scrollbar-track {
      background: transparent;
   }
}
.reply-overlay {
   width: 452px;
   min-height: 100px;
   border-radius: 12px;
   left: 0;
   right: 0;
   bottom: 16px;
}
.fade-enter-active, .fade-leave-active {
   transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
   opacity: 0;
}
</style>