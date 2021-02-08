<template>
   <div class="wrapper bg-white rounded-lg overflow-hidden">
      <header class="px-4 py-4 flex justify-between bg-gray-100">
         <div>
            <p class="text-18 font-medium text-gray-600">Create a collection</p>
            <p class="text-15 font-normal text-gray-400">Collections help you group snippets that are related</p>
         </div>
         <span>
            <icon data="@icon/layers.svg" color="#9CA3AF" width="1.2rem" height="1.2rem" />
         </span>
      </header>
      <validation-observer v-slot="{ failed, untouched, handleSubmit: validateBeforeSubmit }">
      <form class="flex flex-col items-center py-4" action autocomplete="off" @submit.prevent="validateBeforeSubmit(handleSubmit)">
         <validation-provider mode="eager" rules="required" v-slot="{ errors, failed, passed }">
            <label for="name" class="text-15 font-normal text-gray-600">Name</label>
            <div 
               class="input-box mt-1 h-8 px-4 py-1 rounded-md bg-gray-200"
               :class="{'failed': failed, '': passed}"
            >
               <input 
                  class="w-full h-full appearance-none bg-transparent text-15 text-gray-600 focus:outline-none"
                  type="text" name="name" id="name"
                  v-model="name"
               >
            </div>
            <ValidationError :validations="errors"/>
         </validation-provider>
         <div class="actions w-full flex justify-between mt-6">
            <button
               class="px-4 py-1 bg-gray-300 text-15 text-gray-600 font-medium rounded-md"
               @click="closeModal"
            >Cancel</button>
            <button 
               class="px-4 py-1 bg-indigo-400 text-15 text-white font-medium rounded-md"
               :class="{'cursor-default': failed || untouched}"
               :disabled="failed || untouched"
            >Save</button>
         </div>
      </form>
      </validation-observer>
   </div>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from "vee-validate"
import { required } from "vee-validate/dist/rules"

import ValidationError from "./ValidationError"
import { ACTIONS } from "../store/types"

extend("required", {
   ...required,
   message: "This field is required"
})

export default {
   name: "AddCollectionModal",
   components: {
      ValidationProvider,
      ValidationObserver,
      ValidationError
   },
   data: () => ({
      name: ""
   }),
   methods: {
      closeModal: function() {
         this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {})
      },
      handleSubmit: function() {
         this.$store.dispatch(ACTIONS.CREATE_COLLECTION, {
            data: {
               name: this.name
            }
         })
      }
   }
}

</script>

<style lang="scss" scoped>
.wrapper {
   width: 540px;

   .input-box , .actions {
      width: 300px;
   }

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
}
</style>