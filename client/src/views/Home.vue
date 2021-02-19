<template>
   <div class="absolute overflow-y-hidden inset-0 h-screen bg-gray-100 flex">
      <aside class="sidebar w-20 px-2 py-8 bg-gray-100 border-r border-gray-300 flex flex-col justify-between items-center">
         <div>
            <div class="w-12 h-12 rounded-xl bg-gray-400 border-2 border-white relative flex justify-end items-end">
               <span class="text-18 font-semibold text-white mr-2 mb-1">Sr</span>
               <span
                  class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-400 font-medium text-white absolute"
                  style="bottom: -6px; right: -4px; font-size: 11px;"
               >25</span>
            </div>
         </div>
         <div class="flex flex-col items-center">
            <span
               class="inline-block"
               @click="toggleModal('AddSnipModal')"
            >
               <icon
                  v-tippy="{ animation: 'fade', placement: 'right' }"
                  content="Create a snip"
                  class="mt-6 cursor-pointer" data="@icon/plus_circle.svg" color="#4B5563" width="1.5rem" height="1.5rem"
               />
            </span>
            <span class="inline-block relative">
               <icon
                  v-tippy="{ animation: 'fade', placement: 'right'}"
                  content="Notifications"
                  class="mt-6 cursor-pointer" data="@icon/bell.svg" color="#4B5563" width="1.5rem" height="1.5rem" :fill="false"
               />
               <span class="inline-block absolute right-0 w-2 h-2 bg-red-400 rounded-full" style="top: 20px;"></span>
            </span>
            <span class="inline-block">
               <icon
                  v-tippy="{ animation: 'fade', placement: 'right'}"
                  content="Settings"
                  class="mt-6 cursor-pointer" data="@icon/cog.svg" color="#4B5563" width="1.5rem" height="1.5rem" :fill="false"
               />
            </span>
            <span class="inline-block rounded-full w-8 h-8 mt-6 overflow-hidden cursor-pointer">
               <img class="image-cover" :src="authUser && authUser.avatar" alt="user avatar">
               <Popover :placement="'right'">
                  <ul class="py-1">
                     <li 
                        class="text-15 text-gray-600 py-2 px-5 text-left flex items-center cursor-pointer hover:bg-gray-200"
                        @click="handleLogout"
                     >
                        Logout
                        <icon class="ml-2" data="@icon/exit.svg" color="#4B5563" width="1rem" height="1rem" />
                     </li>
                  </ul>
               </Popover>
            </span>
         </div>
      </aside>

      <div class="w-3/12 bg-white overflow-y-auto">
         <header class="flex items-center justify-between px-4 py-6">
            <div class="flex items-center">
               <icon data="@icon/folder.svg" color="#4B5563" width="1.5rem" height="1.5rem"/>
               <p class="text-21 font-semibold uppercase text-gray-600 ml-4">collections</p>
            </div>
            <span
               v-tippy="{ animation: 'fade', placement: 'bottom' }"
               content="Create a collection"
               class="inline-flex items-center justify-center w-8 h-8 rounded-full cursor-pointer hover:bg-gray-200"
               @click="toggleModal('AddCollectionModal')"
            >
               <icon data="@icon/plus.svg" color="#4B5563" width="1rem" height="1rem"/>
            </span>
         </header>

         <div class="mt-4">
            <div class="py-20" v-if="userCollections.length < 1">
               <NoContent
                  :message="'Create a collection and start adding snips!'"
               />
            </div>
            <ul class="px-4 ml-2" v-else>
               <li 
                  class="text-18 font-medium py-2 px-2 -ml-2 rounded-md text-gray-600 flex items-center cursor-pointer"
                  v-for="(collection, idx) in userCollections"
                  :key="idx"
                  :class="{'bg-gray-100 text-indigo-400': collections.isActive && collections.current.id === collection.id}"
                  @click="toggleCollectionActive(collection)"
               >
                  <span 
                     class="inline-block w-2 h-2 rounded-full bg-gray-300 mr-3"
                     :class="{'bg-gray-400': collections.isActive && collections.current.id === collection.id}"
                     style="min-width: 8px"
                  ></span>
                  <span
                     class="inline-block overflow-hidden hover:text-indigo-400 flex-auto"
                     style="white-space: nowrap; text-overflow: ellipsis;"
                  >{{collection.name}}</span>
               </li>
            </ul>
         </div>
      </div>

      <div class="flex flex-col w-9/12 relative">
         <Toast />
         <div class="h-16 w-full py-2 px-6 border-b-2 border-gray-300 flex justify-between items-center">
            <SearchBox />
            <div>
               <img class="w-16" src="../assets/logo.svg" alt="brand logo">
            </div>
         </div>

         <div class="main-content w-full flex">
            <div class="w-2/5 h-full border-r-2 border-gray-300 overflow-y-auto">
               <nav class="w-full px-4 py-4" v-if="!collections.isActive">
                  <ul class="menu-tabs bg-gray-200 rounded-lg inline-flex items-center">
                     <li 
                        class="text-15 font-medium px-4 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition-colors duration-150 ease-in-out"
                        :class="[activeTab === 'Feed' ? 'bg-white text-gray-600' : 'bg-transparent text-gray-400']"
                        @click="setActiveTab('Feed')"
                     >Feed</li>
                     <li 
                        class="text-15 font-medium px-4 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition-colors duration-150 ease-in-out ml-1"
                        :class="[activeTab === 'Your snips' ? 'bg-white text-gray-600' : 'bg-transparent text-gray-400']"
                        @click="setActiveTab('Your snips')"
                     >Your snips</li>
                     <li 
                        class="text-15 font-medium px-4 py-1 rounded-md cursor-pointer hover:bg-gray-300 transition-colors duration-150 ease-in-out ml-1"
                        :class="[activeTab === 'Starred' ? 'bg-white text-gray-600' : 'bg-transparent text-gray-400']"
                        @click="setActiveTab('Starred')"
                     >Starred</li>
                  </ul>
               </nav>
               <header class="flex justify-between py-4 px-4" v-if="!collections.isActive">
                  <p class="text-18 text-gray-600 font-medium inline-flex items-center">
                     <icon class="mr-2" data="@icon/telescope.svg" color="#9CA3AF" width="1.2rem" height="1.2rem"/>
                     Discover
                  </p>
                  <button name="sort-snips" class="h-8 px-2 rounded-lg bg-white border-2 border-gray-200 text-12 text-gray-600 font-medium inline-flex items-center">
                     <span class="font-normal mr-2 inline-block" style="margin-bottom: 2px;">
                        <icon data="@icon/filter.svg" color="#4B5563" width="1rem" height="1rem" />
                     </span> {{snipsFilter}}
                     <icon class="ml-2" data="@icon/chevron.svg" color="#9CA3AF" width=".6rem" height=".6rem"/>
                     <Popover :placement="'bottom-end'" :name="'sort-snips'">
                        <div>
                           <ul class="py-1">
                              <li 
                                 class="text-12 text-gray-600 py-2 px-4 text-left flex items-center cursor-pointer hover:bg-gray-200"
                                 @click="setSnipsFilter('Recently created')"
                              >
                                 <span 
                                    class="inline-block w-1 h-1 rounded-full bg-indigo-400 mr-2"
                                    :class="{'invisible': snipsFilter !== 'Recently created'}"
                                 ></span>
                                 Recently created</li>
                              <li 
                                 class="text-12 text-gray-600 py-2 px-4 text-left flex items-center cursor-pointer hover:bg-gray-200"
                                 @click="setSnipsFilter('Recently updated')"
                              >
                                 <span 
                                    class="inline-block w-1 h-1 rounded-full bg-indigo-400 mr-2"
                                    :class="{'invisible': snipsFilter !== 'Recently updated'}"
                                 ></span>
                                 Recently updated</li>
                              <li 
                                 class="text-12 text-gray-600 py-2 px-4 text-left flex items-center cursor-pointer hover:bg-gray-200"
                                 @click="setSnipsFilter('Trending')"
                              >
                                 <span 
                                    class="inline-block w-1 h-1 rounded-full bg-indigo-400 mr-2"
                                    :class="{'invisible': snipsFilter !== 'Trending'}"
                                 ></span>
                                 Trending</li>
                              <li 
                                 class="text-12 text-gray-600 py-2 px-4 text-left flex items-center cursor-pointer hover:bg-gray-200"
                                 @click="setSnipsFilter('Most starred')"
                              >
                                 <span 
                                    class="inline-block w-1 h-1 rounded-full bg-indigo-400 mr-2"
                                    :class="{'invisible': snipsFilter !== 'Most starred'}"
                                 ></span>
                                 Most starred</li>
                           </ul>
                        </div>
                     </Popover>
                  </button>
               </header>
               <header class="flex flex-col py-4 px-4" v-else>
                  <div>
                     <span 
                        class="inline-flex items-center text-12 font-medium text-indigo-400 cursor-pointer hover:bg-white"
                        style="padding: 1px 6px; margin-left: -6px; border-radius: 4px;"
                        @click="toggleCollectionActive()"
                     >
                        <icon class="mr-2 transform rotate-90" data="@icon/chevron.svg" color="#818CF8" width=".6rem" height=".6rem" />
                        Back to feed
                     </span>
                  </div>
                  <div class="flex mt-4">
                     <p class="text-18 font-medium text-gray-600 flex-auto">
                        {{collections.current.name}}
                        <span 
                           class="ml-2 inline-flex bg-gray-300 text-12 font-medium text-gray-600"
                           style="padding: 1px 8px; border-radius: 4px;"
                        >{{collections.current.snips.length}}</span>
                     </p>
                     <span 
                        class="inline-flex items-center justify-center w-6 h-6 rounded-full cursor-pointer hover:bg-gray-200"
                        style="min-width: 24px;"
                        v-if="hasAdminPrivilege(collections.current.owner.id)"
                     >
                        <icon class="transform rotate-90" data="@icon/kebab_menu.svg" color="#6B7280" width="1rem" height="1rem" :fill="false" />
                        <Popover :placement="'bottom-end'">
                           <ul class="py-1">
                              <li 
                                 class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                 @click="handleEditCollection"
                              >Edit</li>
                              <li 
                                 class="text-12 text-red-500 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                 @click="handleDeleteCollection"
                              >Delete</li>
                           </ul>
                        </Popover>
                     </span>
                  </div>
               </header>
               <div class="snips-list w-full" v-if="collections.isActive">
                  <div class="py-16" v-if="collections.current.snips.length < 1">
                     <NoContent 
                        :message="'Add snips to this collection'"
                     />
                  </div>
                  <ul class="" v-else>
                     <li 
                        v-for="(snip, idx) in collections.current.snips"
                        :key="idx"
                        class="w-full"
                        @click="toggleSnipActive(snip)"
                     >
                        <SnipPreview :snip="snip" :isActive="currentSnip.id === snip.id"/>
                     </li>
                  </ul>
               </div>
               <div class="snips-list w-full" v-else>
                  <div v-if="activeTab === 'Feed'">
                     <div class="py-16" v-if="feed.length < 1">
                        <NoContent 
                           :message="''"
                        />
                     </div>
                     <ul class="" v-else>
                        <li 
                           v-for="(snip, idx) in feed" 
                           :key="idx"
                           class="w-full" 
                           @click="toggleSnipActive(snip)"
                        >
                           <SnipPreview :snip="snip" :isActive="currentSnip.id === snip.id"/>
                        </li>
                     </ul>
                  </div>
                  <div v-if="activeTab === 'Your snips'">
                     <div class="py-16" v-if="userSnips.length < 1">
                        <NoContent 
                           :message="'Code snippets created by you will be displayed here'"
                        />
                     </div>
                     <ul class="" v-else>
                        <li 
                           v-for="(snip, idx) in userSnips" 
                           :key="idx" 
                           class="w-full" 
                           @click="toggleSnipActive(snip)" 
                        >
                           <SnipPreview :snip="snip" :isActive="currentSnip.id === snip.id"/>
                        </li>
                     </ul>
                  </div>
                  <div v-if="activeTab === 'Starred'">
                     <div class="py-16" v-if="starredSnips.length < 1">
                        <NoContent 
                           :message="'Snippets you starred will be displayed here'"
                        />
                     </div>
                     <ul class="" v-else>
                        <li 
                           v-for="(snip, idx) in starredSnips" 
                           :key="idx"
                           class="w-full" 
                           @click="toggleSnipActive(snip)"
                        >
                           <SnipPreview :snip="snip" :isActive="currentSnip.id === snip.id"/>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
            <div class="w-3/5 h-full" v-if="Object.keys(currentSnip).length < 1">
               <NoContent :message="'Select a snip to view'"/>
            </div>
            <div class="w-3/5 h-full overflow-y-auto" v-else>
               <header class="py-4 px-4 flex justify-between">
                  <div>
                     <p class="text-18 font-medium text-gray-600 items-center inline-block">
                        <icon class="mr-1" v-if="currentSnip.source" data="@icon/fork.svg" color="#6B7280" width="1rem" height="1rem" />
                        <icon class="mr-1" v-else data="@icon/codepen.svg" color="#6B7280" width="1rem" height="1rem" />
                        {{currentSnip.title}}
                        <span 
                           class="text-12 text-gray-500 font-normal inline-block rounded-md bg-gray-200 ml-2" 
                           style="padding: 2px 8px;"
                           v-show="currentSnip.permission === 'private'"
                        >secret</span>
                     </p>
                     <p 
                        class="text-12 text-gray-500"
                        v-if="currentSnip.source"
                     >Forked from <span class="text-indigo-400 cursor-pointer hover:underline">{{currentSnip.source.author.username}}/{{currentSnip.source.title}}</span>
                     </p>
                     <p class="text-12 text-gray-500 flex items-center mt-1">
                        <icon class="mr-2" data="@icon/code.svg" color="#6B7280" width="1rem" height="1rem" />
                        Files
                        <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 text-12 text-gray-500 ml-1">{{currentSnip.files.length}}</span>
                     </p>
                  </div>
                  <div class="ml-4 py-2 flex-none">
                     <button class="px-2 py-1 rounded-md bg-gray-200 border border-gray-300 text-12 font-normal text-gray-600 capitalize">
                        <icon class="mr-2" data="@icon/palette.svg" color="#6B7280" width="1rem" height="1rem"/>
                        tomorrow
                        <icon class="ml-2" data="@icon/chevron.svg" color="#9CA3AF" width=".6rem" height=".6rem"/>
                        <Popover :placement="'bottom-end'" :name="'file-action-menu'">
                           <ul class="py-1">
                              <li
                                 class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200 flex items-center capitalize"
                                 @click="setHighlighterTheme('tomorrow')"
                              >
                                 <span 
                                    class="inline-block w-1 h-1 rounded-full bg-indigo-400 mr-2"
                                    :class="{'invisible': highlighterTheme !== 'tomorrow'}"
                                 ></span>
                                 tomorrow
                              </li>
                              <li
                                 class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200 flex items-center capitalize"
                                 @click="setHighlighterTheme('funky')"
                              >
                                 <span 
                                    class="inline-block w-1 h-1 rounded-full bg-indigo-400 mr-2"
                                    :class="{'invisible': highlighterTheme !== 'funky'}"
                                 ></span>
                                 funky
                              </li>
                              <li
                                 class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200 flex items-center capitalize"
                                 @click="setHighlighterTheme('twilight')"
                              >
                                 <span 
                                    class="inline-block w-1 h-1 rounded-full bg-indigo-400 mr-2"
                                    :class="{'invisible': highlighterTheme !== 'twilight'}"
                                 ></span>
                                 twilight
                              </li>
                              <li
                                 class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200 flex items-center capitalize"
                                 @click="setHighlighterTheme('coy')"
                              >
                                 <span 
                                    class="inline-block w-1 h-1 rounded-full bg-indigo-400 mr-2"
                                    :class="{'invisible': highlighterTheme !== 'coy'}"
                                 ></span>
                                 coy
                              </li>
                           </ul>
                        </Popover>
                     </button>
                  </div>
               </header>
               <div class="w-full flex justify-between items-center px-4">
                  <div class="flex items-start">
                     <span class="inline-block w-8 h-8 mt-1 rounded-full overflow-hidden">
                        <img class="image-cover" :src="currentSnip.author.avatar" alt="user avatar">
                     </span>
                     <div class="ml-4">
                        <p class="text-18 font-medium text-gray-600">{{currentSnip.author.name}}</p>
                        <p class="text-12 font-normal text-gray-400">Created {{getTimeSince(currentSnip.createdAt, 'long')}}</p>
                     </div>
                  </div>
                  <div class="flex items-center">
                     <button
                        v-tippy="{ animation: 'fade' }"
                        content="Comments"
                        class="h-8 px-2 bg-gray-200 rounded-l inline-flex items-center justify-center border border-gray-300 hover:bg-gray-300"
                        @click="toggleModal('CommentsModal')"
                     >
                        <icon class="" data="@icon/comment.svg" color="#6B7280" width="1rem" height="1rem"/>
                        <span class="text-12 font-medium text-gray-500 ml-1">{{currentSnip.commentsCount}}</span>
                     </button>
                     <button
                        v-tippy="{ animation: 'fade' }"
                        content="Star"
                        class="h-8 px-2 bg-gray-200 rounded-none inline-flex items-center justify-center border-t border-b border-r border-gray-300 hover:bg-gray-300"
                        @click="handleStarSnip"
                        :disabled="authUser.starred.includes(currentSnip.id)"
                        :class="{'cursor-default': authUser.starred.includes(currentSnip.id)}"
                     >
                        <icon class="" data="@icon/star.svg" :color="authUser.starred.includes(currentSnip.id) ? '#818CF8' : '#6B7280'" width=".8rem" height=".8rem"/>
                        <span 
                           class="text-12 font-medium text-gray-500 ml-1"
                           :class="{'text-indigo-500': authUser.starred.includes(currentSnip.id)}"
                        >{{currentSnip.stars}}</span>
                     </button>
                     <button
                        v-tippy="{ animation: 'fade' }"
                        content="Fork"
                        class="h-8 px-2 bg-gray-200 rounded-none inline-flex items-center justify-center border-t border-b border-gray-300 hover:bg-gray-300"
                        @click="handleForkSnip"
                        :disabled="authUser.forked.includes(currentSnip.id)"
                        :class="{'cursor-default': authUser.forked.includes(currentSnip.id)}"
                     >
                        <icon class="" data="@icon/fork.svg" :color="authUser.forked.includes(currentSnip.id) ? '#818CF8' : '#6B7280'" width="1rem" height="1rem"/>
                        <span 
                           class="text-12 font-medium text-gray-500 ml-1"
                           :class="{'text-indigo-500': authUser.forked.includes(currentSnip.id)}"
                        >{{currentSnip.forks}}</span>
                     </button>
                     <button name="snip-action-menu" class="w-8 h-8 bg-gray-200 rounded-r inline-flex items-center justify-center border border-gray-300 hover:bg-gray-300">
                        <icon class="" data="@icon/kebab_menu.svg" color="#6B7280" width="1rem" height="1rem" :fill="false"/>
                        <Popover :placement="'bottom-end'" :name="'snip-action-menu'">
                           <div>
                              <ul class="py-1">
                                 <li 
                                    class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200 focus:outline-none"
                                    v-if="!collections.isActive"
                                 >Add to collection
                                 <Popover :placement="'left-start'">
                                    <div class="py-1 bg-white">
                                    <ul class="scrollable white-border my-1" style="max-height: 250px;">
                                       <li 
                                          class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200 focus:outline-none"
                                          v-for="(collection) in userCollections"
                                          :key="collection.id"
                                          @click="handleAddToCollection(collection.id)"
                                       > {{collection.name}}
                                       </li>
                                    </ul>
                                    </div>
                                 </Popover>
                                 </li>
                                 <li 
                                    class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                    v-if="collections.isActive"
                                    @click="handleRemoveFromCollection(collections.current.id)"
                                 >Remove from collection
                                 </li>
                                 <a :href="downloadLink">
                                 <li 
                                    class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                 >Download ZIP</li>
                                 </a>
                                 <li 
                                    class="text-12 text-gray-600 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                    @click="handleEditSnip"
                                    v-if="hasAdminPrivilege(currentSnip.author.id)"
                                 >Edit</li>
                                 <li 
                                    class="text-12 text-red-500 py-2 px-4 text-left cursor-pointer hover:bg-gray-200"
                                    @click="handleDeleteSnip"
                                    v-if="hasAdminPrivilege(currentSnip.author.id)"
                                 >Delete</li>
                              </ul>
                           </div>
                        </Popover>
                     </button>
                  </div>
               </div>

               <div class="px-4 py-2">
                  <p class="text-15 font-normal text-gray-400" v-if="!currentSnip.description">No description...</p>
                  <p class="text-15 font-normal text-gray-600">{{currentSnip.description}}</p>
               </div>

               <div class="py-16" v-if="currentSnip.files.length < 1">
                  <NoContent :message="'No files in this snip'"/>
               </div>
               <div class="mt-4 px-4" v-else>
                  <CodeEditor
                     v-for="file in currentSnip.files"
                     :key="file.id"
                     :file="file"
                     :highlighterTheme="highlighterTheme"
                  />
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"

import SnipPreview from "../components/SnipPreview"
import Popover from "../components/Popover"
import CodeEditor from "../components/CodeEditor"
import Toast from "../components/Toast"
import SearchBox from "../components/SearchBox"
import NoContent from "../components/NoContent"
import { ACTIONS , MUTATIONS } from "../store/types"
import { dateMixin } from "../utils/mixins"

export default {
   name: "Home",
   components: {
      SnipPreview,
      Popover,
      Toast,
      CodeEditor,
      NoContent,
      SearchBox
   },
   mixins: [dateMixin],
   data: () => ({
      activeTab: "Feed",
      snipsFilter: "Recently created",
      collections: {
         isActive: false,
         current: {}
      },
      highlighterTheme: "tomorrow"
   }),
   computed: {
      ...mapState({
         userCollections: (state) => state.collections?.all,
         feed: (state) => state.snips?.all,
         starredSnips: (state) => state.snips?.starred,
         userSnips: (state) => state.snips?.byUser,
         currentSnip: (state) => state.snips?.current || {},
         authUser: (state) => state.auth?.profile
      }),
      ...mapGetters([
         "hasAdminPrivilege"
      ]),
      downloadLink: function() {
         return `${process.env.VUE_APP_API_BASE_URL}v${process.env.VUE_APP_API_VERSION}/snips/${this.currentSnip.id}/zip`
      }
   },
   methods: {
      setHighlighterTheme: function(theme) {
         const validThemes = ["twilight", "tomorrow", "solarizedlight", "okaidia", "funky", "dark", "coy"]
         if(!validThemes.includes(theme)) {
            console.warn("[WARNING]: cannot import path, invalid theme provided")
            return
         }

         this.highlighterTheme = theme
         // this.editors = this.editors.map(obj => ({ ...obj, key: nanoid(5) }))
      },
      toggleModal: function(modal) {
         this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {
            component: modal
         })
      },
      setActiveTab: function(val) {
         if(!["Feed", "Your snips", "Starred"].includes(val)) return

         this.activeTab = val
      },
      setSnipsFilter: function(val) {
         if(!["Recently created", "Recently updated", "Trending", "Most starred"].includes(val)) return

         this.snipsFilter = val
      },
      toggleCollectionActive: function(val) {
         if(val) {
            this.collections = { ...this.collections, isActive: true, current: val }
            this.snips = { ...this.snips, current: val.snips }

            this.$store.commit(MUTATIONS.UNSET_CURRENT_SNIP)
            return;
         }
         this.collections = { ...this.collections, isActive: false }
      },
      toggleSnipActive: function(val) {
         this.$store.commit(MUTATIONS.SET_CURRENT_SNIP, {
            snip: val
         })
      },
      handleStarSnip: async function() {
         await this.$store.dispatch(ACTIONS.STAR_SNIP, {
            snipId: this.currentSnip.id
         })
      },
      handleForkSnip: async function() {
         await this.$store.dispatch(ACTIONS.FORK_SNIP, {
            snipId: this.currentSnip.id
         })
      },
      handleAddToCollection: async function(collectionId) {
         await this.$store.dispatch(ACTIONS.ADD_SNIP_TO_COLLECTION, {
            snipId: this.currentSnip.id,
            collectionId
         })
      },
      handleRemoveFromCollection: async function(collectionId) {
         await this.$store.dispatch(ACTIONS.REMOVE_SNIP_FROM_COLLECTION, {
            snipId: this.currentSnip.id,
            collectionId
         })
      },
      handleEditSnip: async function() {
         this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {
            component: "AddSnipModal",
            data: {
               snips: {
                  isEditing: true
               }
            }
         })
      },
      handleDeleteSnip: async function() {
         await this.$store.dispatch(ACTIONS.DELETE_SNIP, {
            snipId: this.currentSnip.id
         })
      },
      handleEditCollection: async function() {
         this.$store.dispatch(ACTIONS.TOGGLE_MODAL, {
            component: "AddCollectionModal",
            data: {
               collection: this.collections.current
            }
         })
      },
      handleDeleteCollection: async function(collectionId) {
         await this.$store.dispatch(ACTIONS.DELETE_COLLECTION, {
            collectionId
         })
      },
      handleLogout: async function() {
         await this.$store.dispatch(ACTIONS.REVOKE_USER)
      }
   },
   created: async function() {
      const requestToken = this.$route.query["code"]

      if(!requestToken) {
         await this.$store.dispatch(ACTIONS.RE_AUTHENTICATE_USER)
      } else {
         console.log("request token")
         await this.$store.dispatch(ACTIONS.AUTHENTICATE_USER, {
            requestToken
         })

         if(this.$store.state.status === "error") return

         this.$router.replace("/snips")
      }

      const feedPromise = this.$store.dispatch(ACTIONS.FETCH_FEED)
      const userSnipsPromise = this.$store.dispatch(ACTIONS.FETCH_USER_SNIPS)
      const starredSnipsPromise = this.$store.dispatch(ACTIONS.FETCH_STARRED_SNIPS)
      const collectionsPromise = this.$store.dispatch(ACTIONS.FETCH_COLLECTIONS)

      await Promise.all([feedPromise, collectionsPromise, userSnipsPromise, starredSnipsPromise])
   }
}

</script>

<style lang="scss" scoped>
.sidebar {
   box-shadow: 2px 0px 0px rgba(209, 213, 219, 0.25);
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
.main-content {
   height: calc(100% - 4rem);
}
.snips-list {
   height: calc(100% - 64px);
}
input[type='text'] {
   &::placeholder {
      font-weight: 400;
      font-size: 15px;
      color: #9CA3AF;
   }
}
.menu-tabs {
   padding: 4px;
   li {
      padding: 2px 24px;
   }
}
</style>