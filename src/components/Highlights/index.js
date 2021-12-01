import React from "react";
import { connect } from "react-redux";
import { clearHighlights, removeHighlight } from "../../store/User/actions";
import CloseIcon from "../../images/close.svg";

import styles from "./styles.module.scss";

console.log(styles);

const Highlights = ({ highlights, clearHighlights, removeHighlight }) => {
  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <h2 className={styles.title}>Highlights</h2>
        <img
          src={CloseIcon}
          className={styles.closeIcon}
          onClick={() => clearHighlights()}
          alt="Clear all"
        />
      </div>
      <div className={`${styles.commentsScreen}`}>
        <>
          <div className={styles.comments}>
            {highlights.map((comment) => (
              <div
                key={comment.pk}
                className={`${styles.comment}`}
                onClick={() => removeHighlight(comment.pk)}>
                <img
                  className={styles.profilePic}
                  alt="Profile pic"
                  src={
                    comment.fake
                      ? comment.user.profile_pic_url
                      : `${process.env.REACT_APP_IMAGE_PROXY}/${comment.user.profile_pic_url}`
                  }
                />
                <div className={styles.textContainer}>
                  <h4 className={styles.title}>{comment.user.username}</h4>
                  <p className={styles.text}>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    highlights: state.highlights,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearHighlights: (feed) => dispatch(clearHighlights()),
    removeHighlight: (pk) => dispatch(removeHighlight(pk)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Highlights);
