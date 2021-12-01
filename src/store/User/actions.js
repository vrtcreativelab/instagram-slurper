import { ipcRenderer } from "electron";

export const types = {
  SET_USER_PROFILE: "SET_USER_PROFILE",
  SET_SIGNED_IN: "SET_SIGNED_IN",
  SET_IG_CLIENT: "SET_IG_CLIENT",
  SAVE_COMMENTS: "SAVE_COMMENTS",
  ADD_FEED: "ADD_FEED",
  REMOVE_FEED: "REMOVE_FEED",
  ADD_HIGHLIGHT: "ADD_HIGHLIGHT",
  REMOVE_HIGHLIGHT: "REMOVE_HIGHLIGHT",
  CLEAR_HIGHLIGHTS: "CLEAR_HIGHLIGHTS",
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

export function addFeed(feed) {
  return { type: types.ADD_FEED, feed };
}

export function removeFeed(feed) {
  return { type: types.REMOVE_FEED, feed };
}

export function addHighlight(highlight) {
  return (dispatch, getState, api) => {
    dispatch({ type: types.ADD_HIGHLIGHT, highlight });
    const { highlights } = getState();
    ipcRenderer.invoke("app:set-highlights", highlights);
  };
}

export function removeHighlight(pk) {
  return (dispatch, getState, api) => {
    dispatch({ type: types.REMOVE_HIGHLIGHT, pk });
    const { highlights } = getState();
    ipcRenderer.invoke("app:set-highlights", highlights);
  };
}

export function clearHighlights() {
  return (dispatch, getState, api) => {
    dispatch({ type: types.CLEAR_HIGHLIGHTS });
    const { highlights } = getState();
    ipcRenderer.invoke("app:set-highlights", highlights);
  };
}
