import styles from "./message.module.css";
import { format } from "timeago.js";

export default function Message({ message, own, user_profilePicture }) {
  var message_class_name = own ?  styles.message_own  : styles.message
  var messageText_class_name = own ?  styles.messageText_own  :  styles.messageText

  return (
    <div className={message_class_name}>
      <div className={styles.messageTop}>
        <img
          className={styles.messageImg}
          src={user_profilePicture}
          alt=""
        />
        <p className={messageText_class_name}>{message.text}</p>
      </div>
      <div className={styles.messageBottom}>{format(message.createdAt)}</div>
    </div>
  );
}
