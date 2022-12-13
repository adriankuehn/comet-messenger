import React from "react";
import styles from "./imgpopuphome.module.css";

const Imgpopuphome = ({ open, onClose, picture, likes, choosePicorLikes }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} className={styles.overlay}>
      {!choosePicorLikes ? (
        <img src={picture} alt="" className={styles.imgPopup} />
      ) : (
        <div className={styles.containerToAccept}>
          <h4 className={styles.requestsHeadline1}>Your Likes:</h4>
          {likes.map((value) => (
            <div key={value} className={styles.dataItem}>
              <p>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Imgpopuphome;
