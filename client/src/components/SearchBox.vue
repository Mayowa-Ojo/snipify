<template>
   <div 
      class="search-box flex items-center h-full py-2 px-3 ml-3 relative"
      :class="{'active': search.isActive}"
      v-on-clickaway="toggleSearchBox"
   >
      <span class="inline-block absolute left-0 -ml-4" v-if="!search.isActive">
         <icon data="@icon/search.svg" color="#9CA3AF" width="1rem" height="1rem"/>
      </span>
      <div class="w-full h-8 flex relative z-20" @click="toggleSearchBox(true)">
         <input
            type="text"
            placeholder="Search by collection, description, or title..."
            class="w-full h-full pl-2 pr-8 appearance-none bg-white border border-gray-200 rounded text-gray-600 text-15 focus:bg-gray-100 focus:outline-none"
            ref="searchInput"
            v-model="search.query"
            @focus="toggleSearchBox(true)"
            @keyup="debounce($event, handleSearchQuery)"
         />
         <span 
            class="absolute right-0 inline-flex items-center justify-center mr-2 border border-gray-300 text-12 text-gray-400"
            style="top: 5px; padding: 1px 6px; border-radius: 4px;"
         >{{search.isActive ? 'Esc': 'Alt K'}}</span>
      </div>
      <transition name="fade">
      <div 
         class="search-box__overlay bg-white border border-gray-200 pt-10 pb-4 absolute z-10"
         v-show="search.isActive"
      >
         <div class="flex items-center justify-center h-full absolute inset-0 w-full" v-if="status === 'loading'">
            <svg style="background:transparent;display:block;" width="40px" height="40px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
               <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#818cf8" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round">
               <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur=".7s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
               </circle>
            </svg>
         </div>
         <div v-else>
         <div class="flex items-center mt-4 px-3">
            <span class="text-12 text-white uppercase inline-block bg-gray-500 rounded" style="padding: 1px 4px;">TAB</span>
            <span class="text-12 text-gray-600 ml-2">or</span>
            <span class="inline-flex items-center justify-center bg-gray-500 rounded ml-2" style="height: 20px; padding: 0 6px;">
               <icon data="@icon/arrow.svg" color="white" width=".6rem" height=".6rem" />
            </span>
            <span class="inline-flex items-center justify-center bg-gray-500 rounded ml-2" style="height: 20px; padding: 0 6px;">
               <icon class="transform rotate-180" data="@icon/arrow.svg" color="white" width=".6rem" height=".6rem" />
            </span>
            <span class="text-12 text-gray-600 ml-2">to navigate</span>
            <span class="text-12 text-white uppercase inline-block bg-gray-500 rounded ml-4" style="padding: 1px 4px;">Enter</span>
            <span class="text-12 text-gray-600 ml-2">to select</span>
            <span class="text-12 text-white uppercase inline-block bg-gray-500 rounded ml-4" style="padding: 1px 4px;">Esc</span>
            <span class="text-12 text-gray-600 ml-2">to cancel</span>
         </div>
         <div class="results scrollable white-border w-full pl-3 mt-4">
            <div class="search-recent">
               <p class="text-12 font-medium text-gray-600">Recent</p>
               <ul class="w-full mt-1">
                  <li 
                     class="flex items-center text-12 text-gray-600 px-2 h-8 rounded cursor-pointer hover:bg-gray-100 focus-within:bg-gray-100"
                     v-for="(entry, idx) in search.history"
                     :key="idx"
                  >
                     <a
                        class="group w-full flex items-center" href="#"
                        @focus="addSearchHitsListener"
                        @blur="removeSearchHitsListener"
                        :data-hit-type="'history'"
                     >
                     <span class="inline-block">
                        <icon class="mr-2" data="@icon/clock.svg" color="#4B5563" width=".85rem" />
                     </span>
                     <span class="search-hit flex-auto">{{entry}}</span>
                     <span class="text-12 text-gray-600 inline-flex items-center invisible group-hover:visible group-focus:visible">
                        select
                        <span class="ml-2 inline-block bg-gray-500" style="padding: 0 4px; border-radius: 4px;">
                           <icon data="@icon/return.svg" color="white" width=".7rem" :fill="false" />
                        </span>
                     </span>
                     </a>
                  </li>
               </ul>
            </div>
            <div class="search-snips mt-4" v-if="search.hits.files.length > 0">
               <p class="text-12 font-medium text-gray-600">Files</p>
               <ul class="w-full mt-1">
                  <li 
                     class="flex items-center text-12 text-gray-600 px-2 h-8 rounded cursor-pointer hover:bg-gray-100 focus-within:bg-gray-100"
                     v-for="file in search.hits.files"
                     :key="file._id" 
                  >
                     <a 
                        class="group w-full flex items-center" href="#"
                        @focus="addSearchHitsListener"
                        @blur="removeSearchHitsListener"
                        :data-hit-type="'file'"
                     >
                     <span class="inline-block">
                        <icon class="mr-2" data="@icon/code.svg" color="#4B5563" width=".85rem" />
                     </span>
                     <span class="search-hit flex-auto" :data-source-id="file._source.fileId">{{file._source.filename}}</span>
                     <span class="text-12 text-gray-600 inline-flex items-center invisible group-hover:visible group-focus:visible">
                        select
                        <span class="ml-2 inline-block bg-gray-500" style="padding: 0 4px; border-radius: 4px;">
                           <icon data="@icon/return.svg" color="white" width=".7rem" :fill="false" />
                        </span>
                     </span>
                     </a>
                  </li>
               </ul>
            </div>
            <div class="search-collections mt-4" v-if="search.hits.snips.length > 0">
               <p class="text-12 font-medium text-gray-600">Snips</p>
               <ul class="w-full mt-1">
                  <li 
                     class="flex items-center text-12 text-gray-600 px-2 h-8 rounded cursor-pointer hover:bg-gray-100 focus-within:bg-gray-100"
                     v-for="snip in search.hits.snips"
                     :key="snip._id"
                  >
                     <a 
                        class="group w-full flex items-center" href="#"
                        @focus="addSearchHitsListener"
                        @blur="removeSearchHitsListener"
                        :data-hit-type="'snip'"
                     >
                     <span class="inline-block">
                        <icon class="mr-2" data="@icon/codepen.svg" color="#4B5563" width=".85rem" />
                     </span>
                     <span class="search-hit flex-auto" :data-source-id="snip._source.snipId">{{snip._source.title}}</span>
                     <span class="text-12 text-gray-600 inline-flex items-center invisible group-hover:visible group-focus:visible">
                        select
                        <span class="ml-2 inline-block bg-gray-500" style="padding: 0 4px; border-radius: 4px;">
                           <icon data="@icon/return.svg" color="white" width=".7rem" :fill="false" />
                        </span>
                     </span>
                     </a>
                  </li>
               </ul>
            </div>
            <div class="search-collections mt-4" v-if="search.hits.collections.length > 0">
               <p class="text-12 font-medium text-gray-600">Collections</p>
               <ul class="w-full mt-1">
                  <li 
                     class="flex items-center text-12 text-gray-600 px-2 h-8 rounded cursor-pointer hover:bg-gray-100 focus-within:bg-gray-100"
                     v-for="collection in search.hits.collections"
                     :key="collection._id" 
                  >
                     <a 
                        class="group w-full flex items-center" href="#"
                        @focus="addSearchHitsListener"
                        @blur="removeSearchHitsListener"
                        :data-hit-type="'collection'"
                     >
                     <span class="inline-block">
                        <icon class="mr-2" data="@icon/layers.svg" color="#4B5563" width=".85rem" />
                     </span>
                     <span class="search-hit flex-auto" :data-source-id="collection._source.collectionId">{{collection._source.name}}</span>
                     <span class="text-12 text-gray-600 inline-flex items-center invisible group-hover:visible group-focus:visible">
                        select
                        <span class="ml-2 inline-block bg-gray-500" style="padding: 0 4px; border-radius: 4px;">
                           <icon data="@icon/return.svg" color="white" width=".7rem" :fill="false" />
                        </span>
                     </span>
                     </a>
                  </li>
               </ul>
            </div>
         </div>
         </div>
      </div>
      </transition>
   </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway"
import httpRequest from "../services/http"
import { MUTATIONS } from "../store/types"
import LocalStorage from "../services/localstorage"

const ls = new LocalStorage

export default {
   name: "SearchBox",
   mixins: [clickaway],
   data: () => ({
      search: {
         isActive: false,
         query: "",
         history: [],
         hits: {
            files: [],
            snips: [],
            collections: []
         }
      },
      timeoutId: null,
      status: "idle"
   }),
   methods: {
      focusSearchInput: function(e) {
         const searchInput = this.$refs["searchInput"]

         if(e.altKey && e.key === "k") {
            searchInput.focus()
            this.search.isActive = true
         }

         if(e.key === "Escape") {
            searchInput.blur()
            this.search.isActive = false
         }
      },
      toggleSearchBox: function(val) {
         if(val === true) {
            this.search.isActive = val
            return
         }

         this.search.isActive = false
         this.search.query = ""
      },
      handleSelectSearchHit: async function(e) {
         if(e.key !== "Enter") return

         const hitType = e.target.getAttribute("data-hit-type")
         const sourceId = e.target.querySelector(".search-hit").getAttribute("data-source-id")

         if(hitType === "history") {
            const searchHit = e.target.querySelector(".search-hit").innerText

            this.search.query = searchHit
            await this.handleSearchQuery({})
         }

         if(hitType === "file") {
            const { data: { file }} = await httpRequest(`/files/${sourceId}`, {
               method: "GET"
            })

            const { data: { snip }} = await httpRequest(`/snips/${file.snip.id}`, {
               method: "GET"
            })

            await this.$store.commit(MUTATIONS.SET_CURRENT_SNIP, {
               snip
            })

            this.toggleSearchBox()
            return
         }

         if(hitType === "snip") {
            const { data: { snip }} = await httpRequest(`/snips/${sourceId}`, {
               method: "GET"
            })

            await this.$store.commit(MUTATIONS.SET_CURRENT_SNIP, {
               snip
            })

            this.toggleSearchBox()
            return
         }

         if(hitType === "collection") {
            return
         }

         console.warn("[WARNING]: invalid search hit type")
      },
      addSearchHitsListener: function(e) {
         e.target.addEventListener("keyup", this.handleSelectSearchHit)
      },
      removeSearchHitsListener: function(e) {
         e.target.removeEventListener("keyup", this.handleSelectSearchHit)
      },
      handleSearchQuery: async function(evt) {
         if(evt.key === "Tab" || evt.key === "Escape") return

         if(!this.search.query) return

         this.$store.commit(MUTATIONS.SET_STATUS, "idle")
         this.status = "loading"

         const response = await httpRequest(`/search?q=${this.search.query}`, {
            method: "GET"
         })

         if(this.$store.state.status === "error") {
            this.status = "idle"
            return
         }

         if(response.data["snip_hits"].length > 0) {
            this.search.hits = {
               ...this.search.hits,
               snips: this.sortSearchHits(response.data["snip_hits"], "_score")
            }

            this.updateSearchHistory(this.search.query)
         }

         if(response.data["file_hits"].length > 0) {
            this.search.hits = {
               ...this.search.hits,
               files: this.sortSearchHits(response.data["file_hits"], "_score")
            }

            this.updateSearchHistory(this.search.query)
         }

         // if(response.data["collection_hits"].length > 0) {
         //    this.search.hits = {
         //       ...this.search.hits,
         //       collections: this.sortSearchHits(response.data["collection_hits"], "_score")
         //    }

         //    this.updateSearchHistory(this.search.query)
         // }

         this.status = "idle"
      },
      debounce: function(evt, cb) {
         if(this.timeoutId) {
            clearTimeout(this.timeoutId)
         }

         this.timeoutId = setTimeout(function() {
            cb(evt)
         }.bind(this), 1400)
      },
      sortSearchHits: function(hits, value) {
         return hits.sort((a, b) => b[value] - a[value])
      },
      fetchSearchHistory: function() {
         const key = "search-history"
         const history = ls.get(key)

         if(!history) return

         this.search.history = history.entries.reverse()
      },
      updateSearchHistory: function(entry) {
         const key = "search-history"
         let history = ls.get(key)

         if(!history) {
            ls.set(key, { entries: [] })
            history = ls.get(key)
         }

         if(history.entries.length >= 3) {
            history.entries.shift()
         }
         // using a set to filter out duplicates
         const historySet = new Set(history.entries)
         historySet.add(entry)

         history.entries = Array.from(historySet)

         ls.set(key, history)
      }
   },
   mounted: function() {
      window.addEventListener("keyup", this.focusSearchInput.bind(this))

      this.fetchSearchHistory()
   },
   destroyed: function() {
      window.removeEventListener("keyup", this.focusSearchInput)
   }
}

</script>

<style lang="scss" scoped>
.search-box {
   width: 24rem;
   transition: width .2s ease-in-out;

   &.active {
      width: 30rem;
   }
   &__overlay {
      width: 100%;
      min-height: 16rem;
      top: -2px;
      left: 0;
      border-radius: 8px;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
      .results {
         max-height: 12rem;
      }
   }
}
.fade-enter-active, .fade-leave-active {
   transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
   opacity: 0;
}
.scrollable {
   overflow-y: scroll;
   &::-webkit-scrollbar {
      width: 12px;
   }
   &::-webkit-scrollbar-thumb {
      background: #9CA3AF;
      border-radius: 20px;
      border: 4px solid #F3F4F6;
   }
   &::-webkit-scrollbar-track {
      background: transparent;
   }
   &.white-border::-webkit-scrollbar-thumb {
      border: 4px solid white;
   }
}
</style>