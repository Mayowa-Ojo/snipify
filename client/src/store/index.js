import Vue from "vue"
import Vuex from "vuex"

import httpRequest from "../services/http"
import { ACTIONS, MUTATIONS } from "./types"
import LocalStorage from "../services/localstorage"
import router from "../router"

const ls = new LocalStorage()

Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      status: "idle",
      auth: {
         profile: null,
         isAuthenticated: false,
         token: null
      },
      modal: {
         isActive: false,
         component: ""
      },
      toast: {
         isActive: false,
         content: "",
         type: "error"
      },
      collections: {
         current: null,
         all: []
      },
      snips: {
         current: null,
         all: [],
         starred: [],
         byUser: []
      },
      comments: {
         all: []
      }
   },
   mutations: {
      [MUTATIONS.SET_STATUS]: function(state, type) {
         const isValidStatusType = ["error", "loading", "forking", "done"].includes(type)
         if(!isValidStatusType) return
   
         state.status = type
      },
      [MUTATIONS.TOGGLE_TOAST]: function(state, { type, content }) {
         if(!content) {
            state.toast = { ...state.toast, isActive: false, type: "", content: "" }
            return
         }
         state.toast = { ...state.toast, isActive: true, type, content }
      },
      [MUTATIONS.SET_USER]: function(state, { user, token }) {
         state.auth = { ...state.auth, isAuthenticated: true, profile: { ...user }, token }
      },
      [MUTATIONS.SET_MODAL]: function(state, payload) {
         state.modal = { ...state.modal, ...payload }
      },
      [MUTATIONS.SET_FEED]: function(state, { snips }) {
         state.snips = { ...state.snips, all: snips }
      },
      [MUTATIONS.SET_USER_SNIPS]: function(state, { snips }) {
         state.snips = { ...state.snips, byUser: snips }
      },
      [MUTATIONS.SET_CURRENT_SNIP]: function(state, { snip }) {
         state.snips = { ...state.snips, current: snip }
      },
      [MUTATIONS.SET_STARRED_SNIPS]: function(state, { snips }) {
         state.snips = { ...state.snips, starred: snips }
      },
      [MUTATIONS.SET_COLLECTIONS]: function(state, { collections }) {
         state.collections = { ...state.collections, all: collections }
      },
      [MUTATIONS.SET_COMMENTS]: function(state, { comments }) {
         state.comments = { ...state.comments, all: comments }
      },
      [MUTATIONS.UPDATE_USER_SNIPS]: function(state, { snip }) {
         const userSnips = [snip, ...state.snips.byUser]

         state.snips = { ...state.snips, byUser: userSnips }
      },
      [MUTATIONS.UPDATE_COLLECTIONS]: function(state, { collection }) {
         const collections = [collection, ...state.collections.all]

         state.collections = { ...state.collections, all: collections }
      },
      [MUTATIONS.UPDATE_COMMENTS]: function(state, { comment, willReplace }) {
         if(willReplace) {
            const index = state.comments.all.findIndex(el => el.id === comment.id)
            state.comments.all.splice(index, 1, comment)
            return
         }

         const comments = [comment, ...state.comments.all]
         state.comments = { ...state.comments, all: comments }
      },
      [MUTATIONS.UPDATE_COMMENT_REPLIES]: function(state, { reply, id, willReplace }) {
         const index = state.comments.all.findIndex(comment => comment.id === id)

         if(willReplace) {
            const replyIndex = state.comments.all[index].replies.findIndex(el => el.id === reply.id)
            state.comments.all[index].replies.splice(replyIndex, 1, reply)
            return
         }

         const replies = [reply, ...state.comments.all[index].replies]
         const comment = { ...state.comments.all[index], replies }
         state.comments.all[index] = comment
      },
      [MUTATIONS.UPDATE_FEED]: function(state, { snip }) {
         const feed = [snip, ...state.snips.feed]

         state.snips = { ...state.snips, feed }
      }
   },
   actions: {
      [ACTIONS.AUTHENTICATE_USER]: async function({ commit, state }, payload) {
         commit(MUTATIONS.SET_STATUS, "loading")

         const response = await httpRequest(`/auth`, {
            method: "POST",
            data: {
               requestToken: payload.requestToken
            }
         })

         if(state.status === "error") return

         ls.set("user", {
            id: response.data.user.id,
            token: response.data.token
         })

         commit(MUTATIONS.SET_USER, {
            user: response.data.user,
            token: response.data.token
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.RE_AUTHENTICATE_USER]: async function({ commit, state }) { 
         commit(MUTATIONS.SET_STATUS, "loading")

         const { token } = ls.get("user") || {}

         if(!token) {
            if(router.currentRoute.path.includes("/snip")) {
               router.push("/")
            }

            commit(MUTATIONS.TOGGLE_TOAST, {
               type: "warning",
               content: "Please sign in with your github account."
            })

            return
         }

         const response = await httpRequest(`/auth/re-authenticate`, {
            method: "POST",
            data: {
               accessToken: token
            }
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_USER, {
            user: response.data.user,
            token: token
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.TOGGLE_MODAL]: function ({ commit }, payload) {
         const validModals = [
            "LoadingModal",
            "AddCollectionModal",
            "AddSnipModal",
            "CommentsModal",
            "Forking"
         ]

         if(payload.component) {
            if(!validModals.includes(payload.component)) {
               console.warn(`[WARNING]: ${payload.component} is not a valid modal component`)

               return
            }

            commit(MUTATIONS.SET_MODAL, {
               isActive: true,
               component: payload.component
            })

            return
         }

         commit(MUTATIONS.SET_MODAL, {
            isActive: false,
            component: ""
         })
      },
      [ACTIONS.CREATE_SNIP]: async function({ commit, state }, payload) {
         commit(MUTATIONS.SET_STATUS, "loading")

         const response = await httpRequest("/snips", {
            method: "POST",
            data: { ...payload.data }
         })

         if(state.status === "error") return

         commit(MUTATIONS.UPDATE_USER_SNIPS, {
            snip: response.data.snip
         })

         commit(MUTATIONS.UPDATE_FEED, {
            snip: response.data.snip
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.CREATE_COLLECTION]: async function({ commit, state }, payload) {
         commit(MUTATIONS.SET_STATUS, "loading")

         const response = await httpRequest("/collections", {
            method: "POST",
            data: { ...payload.data }
         })

         if(state.status === "error") return

         commit(MUTATIONS.UPDATE_COLLECTIONS, {
            collection: response.data.collection
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.CREATE_COMMENT]: async function({ commit, state }, payload) {
         // commit(MUTATIONS.SET_STATUS, "loading")
         const { data, snipId } = payload

         if(!snipId) {
            console.warn("[WARNING]: invalid payload")
            return;
         }

         const response = await httpRequest(`/comments?snipId=${snipId}`, {
            method: "POST",
            data: { ...data }
         })

         if(state.status === "error") return

         commit(MUTATIONS.UPDATE_COMMENTS, {
            comment: response.data.comment
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.CREATE_COMMENT_REPLY]: async function({ commit, state }, payload) {
         // commit(MUTATIONS.SET_STATUS, "loading")
         const { data, commentId } = payload

         if(!commentId) {
            console.warn("[WARNING]: invalid payload")
            return;
         }

         const response = await httpRequest(`/comments/${commentId}/reply`, {
            method: "POST",
            data: { ...data }
         })

         if(state.status === "error") return

         commit(MUTATIONS.UPDATE_COMMENT_REPLIES, {
            reply: response.data.reply,
            id: commentId
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.FETCH_COLLECTIONS]: async function({ commit, state }) {
         commit(MUTATIONS.SET_STATUS, "loading")

         const { id: userId } = ls.get("user") || {}

         if(!userId) {
            console.warn("[WARNING]: not authenticated")
            commit(MUTATIONS.SET_STATUS, "error")

            return
         }

         const response = await httpRequest(`/users/${userId}/collections`, {
            method: "GET"
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_COLLECTIONS, {
            collections: response.data.collections
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.FETCH_FEED]: async function({ commit, state}) {
         commit(MUTATIONS.SET_STATUS, "loading")

         const response = await httpRequest("/snips/feed", {
            method: "GET"
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_FEED, {
            snips: response.data.feed
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.FETCH_USER_SNIPS]: async function({ commit, state }) {
         commit(MUTATIONS.SET_STATUS, "loading")

         const { id: userId } = ls.get("user") || {}

         if(!userId) {
            console.warn("[WARNING]: not authenticated")
            commit(MUTATIONS.SET_STATUS, "error")

            return
         }

         const response = await httpRequest(`/users/${userId}/snips`, {
            method: "GET"
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_USER_SNIPS, {
            snips: response.data.snips
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.FETCH_STARRED_SNIPS]: async function({ commit, state }) {
         commit(MUTATIONS.SET_STATUS, "loading")

         const { id: userId } = ls.get("user") || {}

         if(!userId) {
            console.warn("[WARNING]: not authenticated")
            commit(MUTATIONS.SET_STATUS, "error")

            return
         }

         const response = await httpRequest(`/users/${userId}/starred`, {
            method: "GET"
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_STARRED_SNIPS, {
            snips: response.data.snips
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.FETCH_SNIP_COMMENTS]: async function({ commit, state }, payload) {
         // commit(MUTATIONS.SET_STATUS, "loading")

         const { snipId } = payload

         if(!snipId) {
            console.warn("[WARNING]: invalid payload")
            commit(MUTATIONS.SET_STATUS, "error")

            return
         }

         const response = await httpRequest(`/snips/${payload.snipId}/comments`, {
            method: "GET"
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_COMMENTS, {
            comments: response.data.comments
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.LIKE_COMMENT]: async function({ commit, state }, payload) {
         const { commentId, isReply } = payload

         if(!commentId) {
            console.warn("[WARNING]: invalid payload")

            commit(MUTATIONS.SET_STATUS, "error")
            return
         }

         const response = await httpRequest(`/comments/${commentId}/like`, {
            method: "PATCH"
         })

         if(state.status === "error") return

         if(isReply) {
            commit(MUTATIONS.UPDATE_COMMENT_REPLIES, {
               reply: response.data.comment,
               id: response.data.comment.parent.id,
               willReplace: true
            })
         } else {
            commit(MUTATIONS.UPDATE_COMMENTS, {
               comment: response.data.comment,
               willReplace: true
            })
         }

         commit(MUTATIONS.SET_STATUS, "done")
      }
   },
   getters: {},
})