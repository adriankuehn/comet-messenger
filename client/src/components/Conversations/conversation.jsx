import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./conversation.module.css";
import SERVER_URL from "../../config";

export default function Conversation({ conversation, currentUser }) {
  const [convUser, setConvUser] = useState(null);

  useEffect(() => {
    const friendName = conversation.members.find((m) => m !== currentUser.userName);

    const getUser = async () => {
      try {
        const res = await axios(SERVER_URL + "users/friend/" + friendName);
        setConvUser(res.data);
      } catch (err) {
        console.log('Found4: ' + err);
      }
    };
    getUser();
  }, [currentUser, conversation]);


  return (
    <div className={styles.conversation}>
      <img className={styles.conversationImg} src={convUser?.profilePicture ? convUser.profilePicture : "images/noAvatar.png"} alt="" />
      <span className={styles.conversationName}>{convUser?.userName}</span>
    </div>
  );
}
