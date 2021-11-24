import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { getClient } from "../../lib/igClient";
import "simplebar/dist/simplebar.min.css";

import styles from "./styles.module.scss";

function Comments({
  broadcastId,
}) {
  const [highlightedComment, setHighlightedComment] = useState();
  const [isFetchingComments, setFetchingComments] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    ipcRenderer.invoke("app:save-highlight", highlightedComment);
  } , [highlightedComment]);

  const client = getClient();
  let lastCommentTs =
    comments && comments.length > 0 ? comments[0].created_at : 0;

  const startComments = async () => {
    window.refreshInterval = setInterval(() => {
      if (!isFetchingComments) {
        fetchComments();
      }
    }, 2000);
  };

  const stopComments = async () => {
    if (window.refreshInterval) {
      clearInterval(window.refreshInterval);
      window.refreshInterval = null;
    }
  };

  const fetchComments = async () => {
    setFetchingComments(true);
    try {
      const { comments } = await client.live.getComment({
        broadcastId,
        lastCommentTs,
      });
      console.log({
        broadcastId,
        lastCommentTs,
      });
      if (comments && comments.length > 0) {
        const newLastCommentTs = comments[0].created_at;
        lastCommentTs = newLastCommentTs;
        setComments(old => [...comments, ...old]);
      }
    } catch (error) {
      console.error(error);
    }
    setFetchingComments(false);
  };


  const highlightComment = (comment) => {
    if(!highlightedComment || comment.pk !== highlightedComment.pk) {
      setHighlightedComment(comment);
    } else {
      setHighlightedComment(null);
    }

  }


  useEffect(() => {
      startComments();
    return () => {
      // stop refreshing the comments
      stopComments();
      setComments([]);
    };
  }, []);

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div key={comment.pk} className={`${styles.comment} ${
        highlightedComment
          ? highlightedComment.pk === comment.pk
            ? styles.active
            : ""
          : ""
      }`} onClick={() => highlightComment(comment)}>
        <img className={styles.profilePic} alt="Profile pic" src={`${process.env.REACT_APP_IMAGE_PROXY}/${comment.user.profile_pic_url}`} />
        <div className={styles.textContainer}>
          <h4 className={styles.title}>{comment.user.username}</h4>
          <p className={styles.text}>{comment.text}</p>
        </div>
        
       
      </div>
    ));
  };

  return (
    <div className={`${styles.commentsScreen}`}>


        <>
          <div className={styles.comments}>{renderComments(comments)}</div>

         
        </>
      
    </div>
  );
}

const mapStateToProps = function (state) {
  return {
    profile: state.user.profile,
  };
};

export default connect(mapStateToProps)(Comments);
