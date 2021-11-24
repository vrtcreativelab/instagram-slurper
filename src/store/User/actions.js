export const types = {
  SET_USER_PROFILE: "SET_USER_PROFILE",
  SET_SIGNED_IN: "SET_SIGNED_IN",
  SET_IG_CLIENT: "SET_IG_CLIENT",
  SAVE_COMMENTS: "SAVE_COMMENTS",
  CLEAR_COMMENTS: "CLEAR_COMMENTS",
  ADD_FEED: "ADD_FEED",
  REMOVE_FEED: "REMOVE_FEED",
};

export function setUserProfile(profile) {
  return { type: types.SET_USER_PROFILE, profile };
}

export function setIgClient(client) {
  return { type: types.SET_IG_CLIENT, client };
}

export function setSignedIn(flag) {
  return { type: types.SET_SIGNED_IN, flag };
}

export function saveComments(comments) {
  return { type: types.SAVE_COMMENTS, comments };
}

export function clearComments() {
  return { type: types.CLEAR_COMMENTS };
}

export function addFeed(feed) {
  return { type: types.ADD_FEED, feed };
}

export function removeFeed(feed) {
  return { type: types.REMOVE_FEED, feed };
}
