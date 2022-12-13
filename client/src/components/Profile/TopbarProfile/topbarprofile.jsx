import styles from "./topbarprofile.module.css";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import auth from "../../../firebase-config";
import { signOut } from "firebase/auth";

export default function TopbarProfile(props) {
  var user = props.user;

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("user_all");
    window.location.reload();
  };

  return (
    <nav className={styles.navbar}>
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
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
