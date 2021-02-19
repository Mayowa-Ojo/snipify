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
         component: "",
         data: {}
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
         const isValidStatusType = [
            "error",
            "loading",
            "comment-loading",
            "comment-done",
            "forking",
            "done",
            "idle"].includes(type)
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
      [MUTATIONS.UNSET_USER]: function(state) {
         Vue.set(state.auth, "profile", null)
         Vue.set(state.auth, "isAuthenticated", false)
         Vue.set(state.auth, "token", null)
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

         Vue.set(state.snips, "byUser", userSnips)
      },
      [MUTATIONS.UPDATE_COLLECTIONS]: function(state, { collection, willReplace, willRemoveSnip, collectionId, snipId }) {
         if(willReplace) {
            const index = state.collections.all.findIndex(el => el.id === collection.id)
            state.collections.all.splice(index, 1, collection)
            return
         }

         if(willRemoveSnip) {
            const collectionIndex = state.collections.all.findIndex(el => el.id === collectionId)
            const filteredSnips = state.collections.all[collectionIndex].snips.filter(snip => snip.id !== snipId)
            state.collections.all[collectionIndex].snips = filteredSnips
            return
         }

         const collections = [collection, ...state.collections.all]
         state.collections = { ...state.collections, all: collections }
      },
      [MUTATIONS.UPDATE_COMMENTS]: function(state, { comment, willReplace, willRemove }) {
         if(willReplace) {
            const index = state.comments.all.findIndex(el => el.id === comment.id)
            state.comments.all.splice(index, 1, comment)
            return
         }

         if(willRemove) {
            const filtered = state.comments.all.filter(el => comment.id != el.id)
            Vue.set(state.comments, "all", filtered)
            return
         }

         const comments = [comment, ...state.comments.all]
         state.comments = { ...state.comments, all: comments }
      },
      [MUTATIONS.UPDATE_COMMENT_REPLIES]: function(state, { reply, id, willReplace, willRemove }) {
         const index = state.comments.all.findIndex(comment => comment.id === id)

         if(willReplace) {
            const replyIndex = state.comments.all[index].replies.findIndex(el => el.id === reply.id)
            state.comments.all[index].replies.splice(replyIndex, 1, reply)
            return
         }

         if(willRemove) {
            const replyIndex = state.comments.all[index].replies.findIndex(el => el.id === reply.id)
            state.comments.all[index].replies.splice(replyIndex, 1)
            return
         }

         const replies = [reply, ...state.comments.all[index].replies]
         const comment = { ...state.comments.all[index], replies }
         state.comments.all[index] = comment
      },
      [MUTATIONS.UPDATE_FEED]: function(state, { snip }) {
         const feed = [snip, ...state.snips.all]

         Vue.set(state.snips, "all", feed)
      },
      [MUTATIONS.ADD_SNIP_TO_STARRED]: function(state, { id }) {
         state.auth.profile = { ...state.auth.profile, starred: [...state.auth.profile.starred, id]}
      },
      [MUTATIONS.UNSET_CURRENT_SNIP]: function(state) {
         state.snips.current = null
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
      [ACTIONS.REVOKE_USER]: async function({ commit, state }) { 
         commit(MUTATIONS.SET_STATUS, "loading")

         const { token } = ls.get("user") || {}

         if(!token) {
            if(router.currentRoute.path.includes("/snip")) {
               router.push("/")
            }

            return
         }

         await httpRequest(`/auth/revoke-token`, {
            method: "POST",
            data: {
               accessToken: token
            }
         })
         
         if(state.status === "error") return
         
         if(router.currentRoute.path.includes("/snip")) {
            router.push("/")
         }

         ls.delete("user")

         commit(MUTATIONS.TOGGLE_TOAST, {
            type: "success",
            content: "Please come back soon. E go be ✌️"
         })

         commit(MUTATIONS.UNSET_USER)
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
               component: payload.component,
               data: payload.data || {}
            })

            return
         }

         commit(MUTATIONS.SET_MODAL, {
            isActive: false,
            component: "",
            data: {}
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
         commit(MUTATIONS.SET_STATUS, "comment-loading")
         const { data, snipId } = payload

         const response = await httpRequest(`/comments?snipId=${snipId}`, {
            method: "POST",
            data: { ...data }
         })

         if(state.status === "error") return

         commit(MUTATIONS.UPDATE_COMMENTS, {
            comment: response.data.comment
         })

         commit(MUTATIONS.SET_STATUS, "comment-done")
      },
      [ACTIONS.CREATE_COMMENT_REPLY]: async function({ commit, state }, payload) {
         // commit(MUTATIONS.SET_STATUS, "loading")
         const { data, commentId } = payload

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

         const response = await httpRequest(`/snips/${snipId}/comments`, {
            method: "GET"
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_COMMENTS, {
            comments: response.data.comments
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.EDIT_COLLECTION]: async function({ commit, state }, payload) {
         commit(MUTATIONS.SET_STATUS, "loading")
         const { collectionId, data } = payload

         const response = await httpRequest(`/collections/${collectionId}`, {
            method: "PATCH",
            data: { ...data }
         })

         if(state.status === "error") return

         commit(MUTATIONS.UPDATE_COLLECTIONS, {
            collection: response.data.collection,
            willReplace: true
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.EDIT_SNIP]: async function({ commit, state }, payload) {
         commit(MUTATIONS.SET_STATUS, "loading")
         const { snipId, data } = payload

         await httpRequest(`/snips/${snipId}`, {
            method: "PATCH",
            data: { ...data }
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_STATUS, "done")

         router.go(0)
      },
      [ACTIONS.EDIT_COMMENT]: async function({ commit, state }, payload) {
         const { commentId, isReply, data } = payload

         const response = await httpRequest(`/comments/${commentId}`, {
            method: "PATCH",
            data: { ...data }
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
      },
      [ACTIONS.LIKE_COMMENT]: async function({ commit, state }, payload) {
         const { commentId, isReply } = payload

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
      },
      [ACTIONS.STAR_SNIP]: async function({ commit, state }, payload) {
         const { snipId } = payload

         const response = await httpRequest(`/snips/${snipId}/star`, {
            method: "PATCH"
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_CURRENT_SNIP, {
            snip: response.data.snip
         })

         commit(MUTATIONS.ADD_SNIP_TO_STARRED, {
            id: snipId
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.FORK_SNIP]: async function({ commit, state }, payload) {
         commit(MUTATIONS.SET_STATUS, "forking")

         const { snipId } = payload

         const response = await httpRequest(`/snips/${snipId}/fork`, {
            method: "POST"
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_CURRENT_SNIP, {
            snip: response.data.source
         })

         commit(MUTATIONS.UPDATE_USER_SNIPS, {
            snip: response.data.fork
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.ADD_SNIP_TO_COLLECTION]: async function({ commit, state }, payload) {
         const { snipId, collectionId } = payload

         const response = await httpRequest(`collections/${collectionId}/snip/add?snipId=${snipId}`, {
            method: "PATCH"
         })

         if(state.status === "error") return

         commit(MUTATIONS.UPDATE_COLLECTIONS, {
            collection: response.data.collection,
            willReplace: true
         })

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.REMOVE_SNIP_FROM_COLLECTION]: async function({ commit, state }, payload) {
         commit(MUTATIONS.SET_STATUS, "loading")
         const { snipId, collectionId } = payload

         await httpRequest(`collections/${collectionId}/snip/remove?snipId=${snipId}`, {
            method: "PATCH"
         })

         if(state.status === "error") return

         commit(MUTATIONS.UPDATE_COLLECTIONS, {
            collectionId,
            snipId,
            willRemoveSnip: true
         })

         commit(MUTATIONS.UNSET_CURRENT_SNIP)

         commit(MUTATIONS.SET_STATUS, "done")
      },
      [ACTIONS.DELETE_SNIP]: async function({ commit, state }, payload) {
         const { snipId } = payload

         await httpRequest(`/snips/${snipId}`, {
            method: "DELETE",
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_STATUS, "done")

         router.go(0)
      },
      [ACTIONS.DELETE_COLLECTION]: async function({ commit, state }, payload) {
         const { collectionId } = payload

         await httpRequest(`/collections/${collectionId}`, {
            method: "DELETE",
         })

         if(state.status === "error") return

         commit(MUTATIONS.SET_STATUS, "done")

         router.go(0)
      },
      [ACTIONS.DELETE_COMMENT]: async function({ commit, state }, payload) {
         const { commentId, isReply, parentId } = payload

         await httpRequest(`/comments/${commentId}`, {
            method: "DELETE",
         })

         if(state.status === "error") return

         if(isReply) {
            commit(MUTATIONS.UPDATE_COMMENT_REPLIES, {
               reply: { id: commentId },
               id: parentId,
               willRemove: true
            })
         } else {
            commit(MUTATIONS.UPDATE_COMMENTS, {
               comment: { id: commentId },
               willRemove: true
            })
         }

         commit(MUTATIONS.SET_STATUS, "done")
      }
   },
   getters: {
      hasAdminPrivilege: (state) => (id) => state.auth.profile.id === id
   },
})