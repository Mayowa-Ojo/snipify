<template>
   <div class="w-full rounded-md bg-white border border-gray-300 mt-4 overflow-hidden">
      <header class="w-full bg-gray-100 flex items-center px-2 py-2 rounded-t-md">
         <div class="input-box h-8 w-56 px-2 rounded-l-lg bg-white border border-gray-300 z-10">
            <input
               type="text"
               class="w-full h-full bg-transparent appearance-none focus:outline-none text-15 text-gray-600"
               placeholder="Filename w/ extension..."
               v-model="filename"
               @blur="setHighlighterLanguage"
            >
         </div>
         <button
            class="h-8 px-3 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100"
            :class="{'cursor-not-allowed': !isDeleteActive}"
            type="button"
            v-tippy="{ animation: 'fade', placement: 'top' }"
            content="Remove file"
            :disabled="!isDeleteActive"
            @click="$emit('remove-file', file.id)"
         >
            <icon data="@icon/delete.svg" color="#9CA3AF" width="1rem" height="1rem" />
         </button>
         <div class="ml-8">
            <Select
               v-on:select-indent="setIndentMode($event)"
               :options="['spaces', 'tabs']"
               :label="'Indent mode'"
               :selected="indentMode"
               :event="'select-indent'"
            />
         </div>
         <div class="ml-3">
            <Select
               v-on:select-size="setIndentSize($event)"
               :options="['2', '4', '8']"
               :label="'Indent size'"
               :selected="indentSize"
               :event="'select-size'"
               :disabled="indentMode === 'tabs'"
            />
         </div>
         <div class="ml-3">
            <Select
               v-on:select-line-wrap="setLineWrap($event)"
               :options="['soft wrap', 'no wrap']"
               :label="'Wrap mode'"
               :selected="lineWrap"
               :event="'select-line-wrap'"
            />
         </div>
      </header>
      <div class="editor-wrapper">
         <prism-editor
            class="my-editor"
            v-model="content"
            :highlight="highlighter"
            line-numbers
            data-theme="light"
            :insertSpaces="indentMode === 'spaces'"
            :tabSize="indentMode === 'spaces' ? Number(indentSize) : 1"
         />
      </div>
   </div>
</template>

<script>
import { PrismEditor } from "vue-prism-editor"
import { highlight, languages } from "prismjs/components/prism-core"
import "vue-prism-editor/dist/prismeditor.min.css"
/**
 * The imports below are potential requirements for other language imports
 * so they need to be above any dynamic import that is dependent
 */
import 'prismjs/components/prism-clike.min'
import 'prismjs/components/prism-c.min'
import 'prismjs/components/prism-javascript.min'
import 'prismjs/components/prism-markup.min'
import 'prismjs/components/prism-jsx.min'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-ruby.min'
import 'prismjs/components/prism-java.min'
import 'prismjs/components/prism-bash.min'
import 'prismjs/components/prism-markup-templating.min'
import 'prismjs/themes/prism-tomorrow.css'

import Select from './Select.vue'
import language_map from "../utils/language_map.json"

export default {
   name: "SnipFileInput",
   components: {
      Select,
      PrismEditor
   },
   props: ["file", "isDeleteActive"],
   data: function() {
      return {
         indentMode: "spaces",
         indentSize: "2",
         lineWrap: "soft wrap",
         content: this.file.content,
         filename: this.file.filename,
         language: "js"
      }
   },
   methods: {
      setIndentMode: function(val) {
         if(!["spaces", "tabs"].includes(val)) return

         this.indentMode = val
      },
      setIndentSize: function(val) {
         if(!["2", "4", "8"].includes(val)) return

         this.indentSize = val
      },
      setLineWrap: function(val) {
         if(!["soft wrap", "no wrap"].includes(val)) return

         this.lineWrap = val
      },
      highlighter: function(content) {
         return highlight(content, languages[this.language])
      },
      setHighlighterLanguage: async function() {
         const extension = this.filename.split(".").pop()
         const alias = language_map[extension]

         if(!alias || !extension) return

         this.language = alias

         return require("../utils/import_map")[alias]
      }
   },
   watch: {
      content: function(value) {
         this.$emit("file-change", { id: this.file.id, field: "content", value })
      },
      filename: function(value) {
         this.$emit("file-change", { id: this.file.id, field: "filename", value })
      }
   }
}

</script>

<style lang="scss" scoped>
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

.editor-wrapper {
   height: 200px;
}
</style>