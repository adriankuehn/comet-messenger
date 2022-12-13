import styles from "./topbar.module.css";
import { Link } from "react-router-dom";
import { ReactComponent as ReqIcon } from "./requestsIcon.svg";
import HomeIcon from "@material-ui/icons/Home";
import auth from "../../firebase-config";
import { signOut } from "firebase/auth";

export default function Topbar(props) {
  var user = props.user;
  const setOpenPopup = props.setOpenPopup;
  var friendsToAccept = props.friendsToAccept;
  var friendsPending = props.friendsPending;
  var setInSearch = props.setInSearch;

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("user_all");
    window.location.reload();
  };

  return (
    <nav className={styles.navbar} onClick={() => setInSearch(0)}>
      <div className={styles.leftButtons}>
        <Link to={`/`}>
          <div className={styles.selectIconHome}>
            <HomeIcon />
          </div>
        </Link>

        <div>
          <Link to={`/profile`} className={styles.logoName}>
            <img src={user.profilePicture ? user.profilePicture : "images/noAvatar.png"} alt="" className={styles.topbarImg} />
            <h2 className={styles.textName}>{user.userName}</h2>
          </Link>
        </div>
      </div>
      <h1>Comet Messenger</h1>
      <div className={styles.rightButtons}>
        <div className={styles.topbarIconGroup} onClick={() => setOpenPopup(true)}>
          <ReqIcon />
          <span className={styles.topbarIconBadge}>{friendsToAccept?.length + friendsPending?.length}</span>
        </div>

        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
