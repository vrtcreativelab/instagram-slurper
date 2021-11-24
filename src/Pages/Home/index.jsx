import React, { useState } from "react";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { useHistory } from "react-router-dom";
import { ipcRenderer } from "electron";

import { getClient, removeSession } from "../../lib/igClient";

import Feed from "../../components/Feed";
import { addFeed, removeFeed } from "../../store/User/actions";



function Home({ profile, addFeed, removeFeed, feeds }) {
  const client = getClient();
  const history = useHistory();
  if (!(profile && profile.username)) history.push("/");
  const { username, full_name, profile_pic_url } = profile;
  const [feedName, setFeedName] = useState("");

  const logout = async () => {
    removeSession();
    client.account.logout();

    history.push("/");
  };


  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <div className={`${styles.profilePicWrapper}`}>
          <img
            src={`${process.env.REACT_APP_IMAGE_PROXY}/${profile_pic_url}`}
            className={styles.profilePic}
            alt="Profile pic"
          />
        </div>
        <div className={styles.texts}>
          <h4 className={styles.fullName}>{full_name}</h4>
          <p className={styles.username}>@{username}</p>
        </div>
        <div>
        <Button
          onClick={() => {
            ipcRenderer.invoke("app:open-presenter");
          }}>
          Presenter
        </Button>
        <Button onClick={() => logout()} buttontype="clear">
          Logout
        </Button>

        </div>
      </div>
      <div className={styles.animate}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addFeed(feedName);
              setFeedName("");
            }}
            style={{
              display: `flex`,
              flexDirection: `row`,
              justifyContent: `center`,
            }}>
            <TextInput
              style={{
                margin: `15px 0`,
                minWidth: `100px`,
              }}
              value={feedName}
              onChange={(e) => setFeedName(e.target.value)}
              placeholder="Instagram account"
              autoFocus={true}
            />
            <button className={styles.liveButton}>Add feed</button>
          </form>
        </div>
      <div className={styles.feeds}>
        {feeds.map((feed) => (
          <Feed username={feed} key={`feed-${feed}`} />
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = function (state) {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    profile: state.user.profile,
    feeds: state.feeds,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    addFeed: (feed) => dispatch(addFeed(feed)),
    removeFeed: (feed) => dispatch(removeFeed(feed)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
