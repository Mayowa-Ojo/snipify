<template>
   <div class="wrapper bg-white rounded-lg overflow-hidden">
      <header class="px-4 py-4 flex justify-between bg-gray-100">
         <div>
            <p class="text-18 font-medium text-gray-600">Add new snip</p>
            <p class="text-15 font-normal text-gray-400">Share code snippets with the rest of the community</p>
         </div>
         <span
            class="w-8 h-8 inline-flex justify-center items-center rounded-full hover:bg-gray-200 cursor-pointer"
            @click="closeModal"
         >
            <icon data="@icon/x.svg" color="#9CA3AF" width="1rem" height="1rem" />
         </span>
      </header>

      <div class="form-wrapper p-8">
         <validation-observer v-slot="{ failed, untouched, handleSubmit: validateBeforeSubmit }">
         <form action="" autocomplete="off" @submit.prevent="validateBeforeSubmit(handleSubmit)">
            <validation-provider mode="eager" rules="required" v-slot="{ errors, failed, passed }">
               <div 
                  class="input-box h-8 w-full px-4 rounded-md bg-gray-100 border border-gray-300"
                  :class="{'failed': failed, '': passed}"
                  >
                  <input
                     type="text"
                     class="w-full h-full bg-transparent appearance-none focus:outline-none text-15 text-gray-600"
                     placeholder="Snip title..."
                     v-model="title"
                  >
               </div>
               <ValidationError :validations="errors"/>
            </validation-provider>
            <validation-provider mode="eager" rules="required" v-slot="{ errors , failed, passed}">
               <div 
                  class="input-box h-8 w-full px-4 rounded-md bg-gray-100 border border-gray-300 mt-4"
                  :class="{'failed': failed, '': passed}"
                  >
                  <input
                     type="text"
                     class="w-full h-full bg-transparent appearance-none focus:outline-none text-15 text-gray-600"
                     placeholder="Snip description..."
                     v-model="description"
                  >
               </div>
               <ValidationError :validations="errors"/>
            </validation-provider>

            <SnipFileInput
               v-for="file in files"
               :key="file.id"
               :file="file"
               :isDeleteActive="files.length > 1"
               v-on:remove-file="removeSnipFile($event)"
               v-on:file-change="updateFileData($event)"
            />

            <footer class="flex justify-between items-center mt-4">
               <button
                  class="bg-gray-100 border border-gray-300 rounded-md text-15 text-gray-600 font-medium px-4 py-1 hover:bg-gray-200"
                  type="button"
                  @click="addFileToSnip"
               >Add file</button>
               <div
                  class="bg-indigo-400 rounded-md flex items-center"
                  type="button"
               >
                  <button 
                     class="text-15 text-white font-medium px-3 py-1" type="submit"
                     :class="{'cursor-default': failed || (untouched && !isEditing)}"
                     :disabled="failed || (untouched && !isEditing)"
                  >
                     {{isEditing ? 'Update' : 'Create'}} snip
                  </button>
                  <span class="inline-block h-full px-3 py-1 border-l border-white cursor-pointer">
                     <icon data="@icon/chevron.svg" color="white" width=".6rem" height=".6rem" />
                     <Popover :placement="'top-end'" :name="'select-permission'" :zIndex="30">
                        <ul class="">
                           <li 
                              class="text-15 text-gray-600 py-1 px-4 text-left font-medium cursor-pointer flex hover:bg-gray-100"
                              @click="setSnipPermission('private')"
                           >
                              <span class="inline-block">
                                 <icon :class="{'invisible': snipPermission !== 'private'}" data="@icon/check.svg" color="#4B5563" width=".9rem" height=".9rem" />
                              </span>
                              <span class="inline-flex flex-col ml-2">
                                 <p>Secret snip</p>
                                 <p class="text-12 text-gray-400 font-normal mt-1">Secret snips are hidden by default and only visible to anyone with permission.</p>
                              </span>
                           </li>
                           <li 
                              class="text-15 text-gray-600 py-1 px-4 text-left font-medium cursor-pointer flex hover:bg-gray-100"
                              @click="setSnipPermission('public')"
                           >
                              <span class="inline-block">
                                 <icon :class="{'invisible': snipPermission !== 'public'}" data="@icon/check.svg" color="#4B5563" width=".9rem" height=".9rem" />
                              </span>
                              <span class="inline-flex flex-col ml-2">
                                 <p>Public snip</p>
                                 <p class="text-12 text-gray-400 font-normal mt-1">Public snips are visible to everyone.</p>
                              </span>
                           </li>
                        </ul>
                     </Popover>
                  </span>
               </div>
            </footer>
         </form>
         </validation-observer>
      </div>
   </div>
</template>

<script>
import { mapState } from 'vuex'
import { nanoid } from "nanoid"
import { ValidationProvider, ValidationObserver, extend } from "vee-validate"
import { required } from "vee-validate/dist/rules"

import ValidationError from "./ValidationError"
import SnipFileInput from "./SnipFileInput"
import Popover from "./Popover"
import httpRequest from "../services/http"
import { ACTIONS } from "../store/types"

extend("required", {
   ...required,
   message: "This field is required"
})

export default {
   name: "AddSnipModal",
   components: {
      SnipFileInput,
      ValidationProvider,
      ValidationObserver,
      ValidationError,
      Popover
   },
   data: () => ({
      snipPermission: "public",
      title: "",
      description: "",
      files: [
         { id: `snip_${nanoid(4)}`, filename: "", content: "" }
      ]
   }),
   computed: {
      ...mapState({
         isEditing: (state) => state.modal?.data?.snips?.isEditing,
         currentSnip: (state) => state.snips.current
      })
   },
   methods: {
      closeModal: function() {
         this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {})
      },
      setSnipPermission: function(val) {
         if(!["public", "private"].includes(val)) return

         this.snipPermission = val
      },
      addFileToSnip: function() {
         this.files.push({ id: `snip_${nanoid(4)}`, filename: "", content: "" })
      },
      removeSnipFile: function(id) {
         this.files = this.files.filter(file => file.id !== id)
      },
      updateFileData: function({ id, field, value }) {
         this.files = this.files.map(file => file.id === id ? { ...file, [field]: value } : file)
      },
      handleSubmit: async function() {
         if(this.isEditing) {
            await this.$store.dispatch(ACTIONS.EDIT_SNIP, {
               snipId: this.currentSnip.id,
               data: {
                  title: this.title,
                  description: this.description,
                  permission: this.snipPermission,
                  files: this.files
               }
            })

            return
         }

         await this.$store.dispatch(ACTIONS.CREATE_SNIP, {
            data: {
               title: this.title,
               description: this.description,
               permission: this.snipPermission,
               files: this.files
            }
         })
      }
   },
   created: async function() {
      if(this.isEditing) {
         this.title = this.currentSnip.title
         this.description = this.currentSnip.description
         this.snipPermission = this.currentSnip.permission

         this.files = await Promise.all(this.currentSnip.files.map(async file => {
            const response = await httpRequest(`/files/${file.id}`, {
               method: "GET"
            })

            if(!response?.data) return;

            return {
               id: file.id,
               filename: file.filename,
               content: response.data.file.body
            }
         }))
      }
   }
}

</script>

<style lang="scss" scoped>
.wrapper {
   width: 65%;
   max-height: 85%;
   overflow-y: hidden;

   .input-box {
      transition: box-shadow .2s linear;
      transition: background-color .2s linear;
      &:hover {
         background-color: white;
         border: 1px solid #9CA3AF;
         box-shadow: 0px 0px 0px 4px rgba(129, 140, 248, 0.1);
      }
      &:focus-within {
         background-color: white;
         border: 1px solid #9CA3AF;
         box-shadow: 0px 0px 0px 4px rgba(129, 140, 248, 0.2);
      }
   }

   .form-wrapper {
      max-height: 450px;
      overflow-y: auto;

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
}
</style>