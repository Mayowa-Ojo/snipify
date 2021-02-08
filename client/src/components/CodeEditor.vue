<template>
   <div class="bg-white border border-gray-300 rounded mb-4">
      <header class="flex items-center justify-between h-10 px-4">
         <div class="flex items-center">
            <!-- <icon :data="fileIcon[file.language.toLowerCase()]" color="#4B5563" width="1rem" height="1rem" /> -->
            <i class="text-gray-600" :class="`devicon-${fileIcon[file.language.toLowerCase()]}`"></i>
            <p class="text-15 font-medium text-gray-600 ml-3">{{file.filename}}</p>
         </div>
         <div class="flex items-center">
            <span
               v-tippy
               content="Copy file"
               class="w-6 h-6 inline-flex items-center justify-center cursor-pointer"
            >
               <icon class="" data="@icon/copy.svg" color="#9CA3AF" width="1rem" height="1rem" />
            </span>
            <span name="file-action-menu" class="ml-4 w-6 h-6 inline-flex items-center justify-center cursor-pointer">
               <icon class="" data="@icon/kebab_menu.svg" color="#9CA3AF" width="1rem" height="1rem" :fill="false"/>
               <Popover :placement="'bottom-end'" :name="'file-action-menu'">
                  <div>
                     <ul class="py-1">
                        <li
                           class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200 flex items-center"
                           @click="toggleDarkMode"
                        >
                           <icon class="mr-2" :class="{'invisible': !prefersDarkMode}" data="@icon/check.svg" color="#4B5563" width=".8rem" height=".8rem"/>
                           Dark mode
                        </li>
                        <li
                           class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200 flex items-center"
                           @click="toggleLineNumbers"
                        >
                           <icon class="mr-2" :class="{'invisible': !showLineNumbers}" data="@icon/check.svg" color="#4B5563" width=".8rem" height=".8rem"/>
                           Line numbers
                        </li>
                     </ul>
                  </div>
               </Popover>
            </span>
         </div>
      </header>
      <div class="border-t border-b border-gray-300">
         <prism-editor
            class="my-editor"
            v-model="code"
            :highlight="highlighter"
            :line-numbers="showLineNumbers"
            :data-theme="prefersDarkMode ? 'dark' : 'light'"
            readonly
         />
      </div>
      <footer class="h-10 px-4 flex items-center justify-between">
         <p class="text-12 font-normal text-gray-600">{{file.language}}</p>
         <div class="flex items-center">
            <span class="text-12 font-medium text-gray-400">{{LOC}} lines</span>
            <span class="text-12 font-medium text-gray-400 ml-2">{{fileSize}}</span>
         </div>
      </footer>
   </div>
</template>

<script>
import { PrismEditor } from "vue-prism-editor"
import { highlight, languages } from "prismjs/components/prism-core"
import "vue-prism-editor/dist/prismeditor.min.css"
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-go';
// import 'prismjs/themes/prism-twilight.css'; // import syntax highlighting styles
import Popover from "../components/Popover"
import httpRequest from "../services/http"
import { fileIconMixin } from "../utils/mixins"

export default {
   name: "CodeEditor",
   components: {
      Popover,
      PrismEditor
   },
   props: ["highlighterTheme", "file"],
   mixins: [fileIconMixin],
   data: () => ({
      prefersDarkMode: true,
      showLineNumbers: true,
      code: "const status = \"Loading...\"",
      fileSize: 0,
      LOC: 0
   }),
   methods: {
      highlighter: function(code) {
         return highlight(code, languages.go)
      },
      toggleDarkMode: function() {
         this.prefersDarkMode = !this.prefersDarkMode
      },
      toggleLineNumbers: function() {
         this.showLineNumbers = !this.showLineNumbers
      },
      importTheme: function(theme) {
         return import(`prismjs/themes/prism-${theme}.css`)
      },
   },
   created: async function() {
      const response = await httpRequest(`/files/${this.file.id}`, {
         method: "GET"
      })

      if(this.$store.state.status === "error") return;

      this.code = response.data.file.body

      this.LOC = response.data.file.body.split("\n").length
      // not the proudest code I've written tbh...
      this.fileSize = response.data.file.size / 1000 > 999 ?
         (response.data.file.size / 1000 / 1000).toFixed(2) + " Mb"
      :
         (response.data.file.size / 1000).toFixed(2) + " Kb"
   },
   mounted: function() {
      this.importTheme(this.highlighterTheme)
   }
}

</script>

<style lang="scss">
.my-editor {
   max-height: 300px;

   font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
   font-size: 14px;
   line-height: 1.5;
   padding: 5px;

   &::-webkit-scrollbar {
      width: 4px;
   }
   &::-webkit-scrollbar-thumb {
      background: #D1D5DB;
      border-radius: 20px;
      // border: 4px solid indianred;
   }
   &::-webkit-scrollbar-track {
      background: transparent;
   }

   &[data-theme='light'] {
      background: white;
      color: #4B5563
   }
   &[data-theme='dark'] {
      background: #4B5563;
      color: white;
   }

   .prism-editor__container {
      textarea:focus {
         outline: none !important;
      }
   }
}


</style>