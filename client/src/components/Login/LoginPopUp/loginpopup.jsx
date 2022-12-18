import React from "react";
import styles from "./loginpopup.module.css";
import Datenschutz from "../Datenschutz/datenschutz.jsx";

const LoginPopup = ({ open, onClose, popUpValue }) => {
  if (!open) return null;

  return (
    
    <div onClick={onClose} className={styles.overlay}>
      { console.log(open, popUpValue) }
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.modalContainer}
      >
        {popUpValue === 0 ? (
          <div className={styles.popUpText}>
            <h1>Impressum:</h1>
            <br />
            <p> Adrian Kühn </p>
            <br />
            <p> Deutschland </p>
            <p> Rodeberg </p>
            <p> Unterm Kirchberg 10</p>
            <br />
            <p>Email: adriankuehn.ak@gmail.com</p>
            <p>Web: comet-messenger.com</p>
          </div>
        ) : (
          <div>
            {popUpValue === 1 ? (
              <Datenschutz/>
            ) : (
              <div className={styles.popUpTextAbout}>
                Comet Messenger is a private non-profit and non-comercial project created by a student in 2022. It is a JS-MERN Full Stack
                Development of an autonomous web-based Social Network where users can create their own profiles and publish photos/posts. Next to
                that, users can search for and add new friends. By utilizing a socket server users can also perform real-time chatting with each
                other. The overall project size contains about 5000 lines of Javascript, HTML and CSS code. For more information visit the
                corresponding GitHub page: <br/><br/><a href="https://github.com/adriankuehn/comet-messenger">https://github.com/adriankuehn/comet-messenger</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
