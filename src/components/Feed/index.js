import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { removeFeed } from "../../store/User/actions";
import { IgLoginRequiredError } from "instagram-private-api";
import { getClient } from "../../lib/igClient";
import styles from "./styles.module.scss";
import CloseIcon from "../../images/close.svg";
import RefreshIcon from "../../images/refresh.svg";
import BugWhiteIcon from "../../images/bug-white.svg";
import BugGreenIcon from "../../images/bug-green.svg";

import Comments from "../Comments";
import { useHistory } from "react-router-dom";

const Feed = ({ username, removeFeed }) => {
  const [liveId, setLiveId] = useState(false);
  const [profile, setProfile] = useState(false);
  const client = getClient();
  const history = useHistory();
  const timeout = useRef();

  const fetchProfile = async () => {
    try {
      const targetUser = await client.user.searchExact(username);
      setProfile(targetUser);
    } catch (error) {
      if (error instanceof IgLoginRequiredError) {
        //removeSession();
        history.push("/");
      }
    }
  };

  const checkLive = async (targetUser, force = false) => {
    if (liveId !== "FAKE" && !force) {
      try {
        const { body } = await client.feed.client.request.send({
          url: `/api/v1/feed/user/${targetUser.pk}/story/`,
          method: "GET",
        });
        if (body && body.broadcast && body.broadcast.id) {
          setLiveId(body.broadcast.id);
        } else {
          setLiveId(false);
        }
      } catch (error) {
        if (error instanceof IgLoginRequiredError) {
          //removeSession();
          history.push("/");
        } else {
          console.log(error);
        }
      }
      timeout.current = setTimeout(() => {
        checkLive(targetUser);
      }, 1000 * 30);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (profile && profile.pk) {
      checkLive(profile);
    }
  }, [profile]);

  return (
    <div className={styles.feed}>
      {profile ? (
        <>
          <div className={styles.header}>
            <img
              src={`${process.env.REACT_APP_IMAGE_PROXY}/${profile.profile_pic_url}`}
              className={styles.headerIcon}
              alt="Profile pic"
            />
            <h2 className={styles.title}>{username}</h2>
            <img
              src={CloseIcon}
              className={styles.closeIcon}
              onClick={() => removeFeed(username)}
              alt="Remove feed"
            />
            <img
              src={RefreshIcon}
              className={styles.closeIcon}
              onClick={() => checkLive(profile, true)}
              alt="Check live status"
            />
            <img
              src={liveId === "FAKE" ? BugGreenIcon : BugWhiteIcon}
              className={styles.closeIcon}
              onClick={() => {
                if (liveId === "FAKE") {
                  setLiveId(false);
                  checkLive(profile, true);
                } else {
                  if (
                    window.confirm(`Testmodus inschakelen voor ${username}?`)
                  ) {
                    clearTimeout(timeout.current);

                    setLiveId("FAKE");
                  }
                }
              }}
              alt="Check live status"
            />
          </div>
          {liveId ? (
            <Comments broadcastId={liveId} />
          ) : (
            <div style={{ padding: "2rem" }}>This profile is not live.</div>
          )}
        </>
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>{username}</h2>

            <img
              src={CloseIcon}
              className={styles.closeIcon}
              onClick={() => removeFeed(username)}
              alt="Remove feed"
            />
          </div>
        </>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeFeed: (feed) => dispatch(removeFeed(feed)),
  };
};

export default connect(null, mapDispatchToProps)(Feed);
