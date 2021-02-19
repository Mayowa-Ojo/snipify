export const MUTATIONS = {
   SET_STATUS: "SET_STATUS",
   SET_USER: "SET_USER",
   SET_MODAL: "SET_MODAL",
   SET_FEED: "SET_FEED",
   SET_USER_SNIPS: "SET_USER_SNIPS",
   SET_CURRENT_SNIP: "SET_CURRENT_SNIP",
   SET_STARRED_SNIPS: "SET_STARRED_SNIPS",
   SET_COMMENTS: "SET_COMMENTS",
   SET_COLLECTIONS: "SET_COLLECTIONS",
   UPDATE_COLLECTIONS: "UPDATE_COLLECTIONS",
   UPDATE_COMMENTS: "UPDATE_COMMENTS",
   UPDATE_COMMENT_REPLIES: "UPDATE_COMMENT_REPLIES",
   UPDATE_USER_SNIPS: "UPDATE_USER_SNIPS",
   UPDATE_CURRENT_SNIP: "UPDATE_CURRENT_SNIP",
   UNSET_CURRENT_SNIP: "UNSET_CURRENT_SNIP",
   UNSET_USER: "UNSET_USER",
   UPDATE_FEED: "UPDATE_FEED",
   TOGGLE_TOAST: "TOGGLE_TOAST",
   ADD_SNIP_TO_STARRED: "ADD_SNIP_TO_STARRED",
}

export const ACTIONS = {
   AUTHENTICATE_USER: "AUTHENTICATE_USER",
   RE_AUTHENTICATE_USER: "RE_AUTHENTICATE_USER",
   REVOKE_USER: "REVOKE_USER",
   TOGGLE_MODAL: "TOGGLE_MODAL",
   CREATE_COLLECTION: "CREATE_COLLECTION",
   CREATE_SNIP: "CREATE_SNIP",
   CREATE_COMMENT: "CREATE_COMMENT",
   CREATE_COMMENT_REPLY: "CREATE_COMMENT_REPLY",
   FETCH_COLLECTIONS: "FETCH_COLLECTIONS",
   FETCH_FEED: "FETCH_FEED",
   FETCH_STARRED_SNIPS: "FETCH_STARRED_SNIPS",
   FETCH_USER_SNIPS: "FETCH_USER_SNIPS",
   FETCH_SNIP_COMMENTS: "FETCH_SNIP_COMMENTS",
   EDIT_COLLECTION: "EDIT_COLLECTION",
   EDIT_SNIP: "EDIT_SNIP",
   EDIT_COMMENT: "EDIT_COMMENT",
   STAR_SNIP: "STAR_SNIP",
   FORK_SNIP: "FORK_SNIP",
   DOWNLOAD_SNIP: "DOWNLOAD_SNIP",
   ADD_SNIP_TO_COLLECTION: "ADD_SNIP_TO_COLLECTION",
   REMOVE_SNIP_FROM_COLLECTION: "REMOVE_SNIP_FROM_COLLECTION",
   LIKE_COMMENT: "LIKE_COMMENT",
   DELETE_COLLECTION: "DELETE_COLLECTION",
   DELETE_SNIP: "DELETE_SNIP",
   DELETE_COMMENT: "DELETE_COMMENT",
}