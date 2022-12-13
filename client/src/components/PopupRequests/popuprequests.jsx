import React from "react";
import styles from "./popuprequests.module.css";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import SERVER_URL from "../../config";

const Popup = ({
  open,
  onClose,
  friendsPending,
  friendsToAccept,
  conversations,
  friends,
  user,
  setFriendsToAccept,
  setFriendsPending,
  setConversations,
  setFriends,
}) => {
  const handleAcceptRequest = async (value) => {
    try {
      const postAcceptRequest = async () => {
        const body = { userId: user._id, requestedUserName: value };
        res_convid = await axios.post(SERVER_URL + "users/acceptRequest", body);
      };
      var res_convid = 0;
      await postAcceptRequest();
      setFriendsToAccept(friendsToAccept.filter((name) => name !== value));
      console.log("Accepted - res.data: " + res_convid.data);
      setConversations(conversations.concat(res_convid.data));
      setFriends(friends.concat(value));
    } catch (err) {
      console.log("Found (Accept Request): " + err);
    }
  };

  const handleWithdrawRequest = async (value) => {
    try {
      const postWithdrawRequest = async () => {
        const body = { userId: user._id, requestedUserName: value };
        await axios.post(SERVER_URL + "users/withdrawRequest", body);
      };
      await postWithdrawRequest();
      setFriendsPending(friendsPending.filter((name) => name !== value));
    } catch (err) {
      console.log("Found (Accept Request): " + err);
    }
  };

  if (!open) return null;
  return (
    <div onClick={onClose} className={styles.overlay}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={styles.modalContainer}
      >
        <div className={styles.containerToAccept}>
          <div className={styles.dataItemHeadline}>
            <h4 className={styles.requestsHeadline1}>Requests from friends:</h4>
            <div className={styles.closeIcon}>
              <CloseIcon id="clearBtn" onClick={onClose} />
            </div>
          </div>
          {friendsToAccept.slice(0, 50).map((value) => (
            <div key={value} className={styles.dataItem}>
              <p>{value}</p>
              <button className={styles.acceptButton} onClick={() => handleAcceptRequest(value)}>
                accept
              </button>
            </div>
          ))}
          <div className={styles.dataItemHeadline}>
            <h4 className={styles.requestsHeadline2}>Your requests pending:</h4>
          </div>
          {friendsPending.slice(0, 50).map((value) => (
            <div key={value} className={styles.dataItem}>
              <p>{value}</p>
              <button className={styles.acceptButton} onClick={() => handleWithdrawRequest(value)}>
                withdraw
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popup;
