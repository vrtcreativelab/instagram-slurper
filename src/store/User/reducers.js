import config from "../../utils/config";
import { combineReducers } from "redux";

import { types } from "./actions";

function instagram(state = { client: null, comments: [] }, action) {
  switch (action.type) {
    case types.SET_IG_CLIENT:
      return { ...state, client: action.client };

    default:
      return state;
  }
}

function user(state = { profile: null }, action) {
  switch (action.type) {
    case types.SET_USER_PROFILE:
      return { ...state, profile: action.profile };
    default:
      return state;
  }
}

function auth(state = { isLoggedIn: false }, action) {
  switch (action.type) {
    case types.SET_SIGNED_IN:
      return { ...state, isLoggedIn: action.flag };
    default:
      return state;
  }
}

function feeds(state = [], action) {
  switch (action.type) {
    case types.ADD_FEED:
      return [...state, action.feed];
    case types.REMOVE_FEED:
      return state.filter((feed) => feed !== action.feed);
    default:
      return state;
  }
}

function highlights(state = [], action) {
  console.log(action);
  switch (action.type) {
    case types.ADD_HIGHLIGHT:
      return [action.highlight, ...state].slice(0, 3);
    case types.REMOVE_HIGHLIGHT:
      return state.filter((highlight) => highlight.pk !== action.pk);
    case types.CLEAR_HIGHLIGHTS:
      return [];
    default:
      return state;
  }
}

const InstagramUser = combineReducers({
  instagram,
  user,
  auth,
  feeds,
  highlights,
});

export default InstagramUser;
