import Vue from "vue"
import Vuex from "vuex"

import httpRequest from "../services/http"
import { ACTIONS, MUTATIONS } from "./types"
import LocalStorage from "../services/localstorage"

const ls = new LocalStorage()

Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      status: "idle",
      auth: {
         profile: {},
         isAuthenticated: false,
         token: ""
      },
      modal: {
         isActive: false,
         component: ""
      }
   },
   mutations: {
      [MUTATIONS.SET_STATUS]: function(state, type) {
         const isValidStatusType = ["error", "loading", "done"].includes(type)
         if(!isValidStatusType) return
   
         state.status = type
      },
      [MUTATIONS.SET_USER]: function(state, { user, token }) {
         state.auth = { ...state.auth, isAuthenticated: true, profile: { ...user }, token }
      },
      [MUTATIONS.SET_MODAL]: function (state, payload) {
         state.modal = { ...state.modal, ...payload }
      },
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
      [ACTIONS.TOGGLE_MODAL]: function ({ commit }, payload) {
         const validModals = [
            "LoadingModal",
            "AddCollectionModal",
            "AddSnipModal",
            "CommentsModal"
         ]

         if(payload.component) {
            if(!validModals.includes(payload.component)) {
               console.warn(`[WARNING]: component with name ${payload.component} is not a valid modal component`)
               
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
      }
   },
   getters: {},
})