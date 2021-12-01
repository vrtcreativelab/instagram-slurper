import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { ipcRenderer } from "electron";
import { getClient } from "../../lib/igClient";
import { fakeComment } from "../../lib/fakeData";
import { addHighlight, removeHighlight } from "../../store/User/actions";

import styles from "./styles.module.scss";

function Comments({
  broadcastId,
  addHighlight,
  removeHighlight,
  highlights,
}) {
  const [isFetchingComments, setFetchingComments] = useState(false);
  const [comments, setComments] = useState([]);


  useEffect(() => {
    setComments([])
  }, [broadcastId]);

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
    if(broadcastId === "FAKE") {
      if(Math.round(Math.random()) === 1) {
      setComments(old => [fakeComment(), ...old].slice(0,100));
      }
    } else {
      try {
        const { comments } = await client.live.getComment({
          broadcastId,
          lastCommentTs,
        });

        if (comments && comments.length > 0) {
          const newLastCommentTs = comments[0].created_at;
          lastCommentTs = newLastCommentTs;
          setComments(old => [...comments, ...old].slice(0, 100));
        }
      } catch (error) {
        console.error(error);
      }
    }

    setFetchingComments(false);
  };


  const highlightComment = (comment) => {
    if(highlights.find(h => h.pk === comment.pk)) {
      removeHighlight(comment.pk);
    } else {
      addHighlight(comment);
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

  return (
    <div className={`${styles.commentsScreen}`}>


        <>
          <div className={styles.comments}>{comments.map((comment) => (
      <div key={comment.pk} className={`${styles.comment} ${highlights.find(h => h.pk === comment.pk) ? styles.active : ''}`} onClick={() => highlightComment(comment)}>
        <img className={styles.profilePic} alt="Profile pic" src={comment.fake ? comment.user.profile_pic_url : `${process.env.REACT_APP_IMAGE_PROXY}/${comment.user.profile_pic_url}`} />
        <div className={styles.textContainer}>
          <h4 className={styles.title}>{comment.user.username}</h4>
          <p className={styles.text}>{comment.text}</p>
        </div>
        
       
      </div>
    ))}</div>

         
        </>
      
    </div>
  );
}

const mapStateToProps = function (state) {
  return {
    profile: state.user.profile,
    highlights: state.highlights
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    addHighlight: (comment) => dispatch(addHighlight(comment)),
    removeHighlight: (pk) => dispatch(removeHighlight(pk))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
