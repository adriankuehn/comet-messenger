import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./login.module.css";
import SERVER_URL from "../../config";
import LoginPopup from "./LoginPopUp/loginpopup";
import Screenshot1 from "./Screenshot_1.png";
import Screenshot2 from "./Screenshot_2.png";
import Carousel from "react-material-ui-carousel";
import auth from "../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "", firebaseKey: "" });
  const [error, setError] = useState("");
  const [popUpValue, setPopUpValue] = useState(0);
  const [openLoginPopup, setOpenLoginPopup] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        console.log("userCredential.emailVerified: " + JSON.stringify(userCredential.user.emailVerified));
        if (userCredential.user.emailVerified === true) {
          data.firebaseKey = auth.currentUser.uid;
          const res = await axios.post(SERVER_URL + "auth/login", data);
          localStorage.setItem("user_all", JSON.stringify(res.data));
          window.location = "/";
        } else {
          setError("Confirm Email Address first");
        }
      })
      .catch((error) => {
        setError("Wrong Email or Password");
      });

    /*try {
      const res = await axios.post(SERVER_URL + "auth/login", data);
      localStorage.setItem("user_all", JSON.stringify(res.data));
      window.location = "/";
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }*/
  };

  function HandleLoginPopup(popupVal) {
    console.log("triggered");
    setPopUpValue(popupVal);
    setOpenLoginPopup(true);
  }

  function handleScroll() {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0,
      behavior: "smooth",
    });
  }

  /*auth.onAuthStateChanged(function (user) {
    if (user) {
      console.log("user is logged in now!!!");
    } else {
      // No user is signed in.
    }
  });*/

  return (
    <div className={styles.mainStartPage}>
      <div className={styles.topContainer}>
        <div className={styles.topHeadline}>Comet Messenger</div>

        <div className={styles.containerCarousel}>
          <Carousel height={20}>
            <div className={styles.textCarousel}>Start now: Create an account and verify your Email</div>
            <div className={styles.textCarousel}>Find and connect with your friends worldwide</div>
            <div className={styles.textCarousel}>Real-time chatting in a mather of milliseconds</div>
            <div className={styles.textCarousel}>Create your own profile - Share Posts and Memories</div>
            <div className={styles.textCarousel}>Like, Share & Comment: Let others know what you think</div>
          </Carousel>
        </div>

        <button className={styles.topButton} onClick={handleScroll}>
          Login
        </button>
      </div>

      <div className={styles.middleContainer}>
        <div className={styles.firstImageContainer}>
          <img src={Screenshot1} alt="Social Web First" className={styles.middleImg} />
          <div className={styles.firstImageText}>Secure, Independent and for Free: A private non-commercial student project started in 2023</div>
        </div>
        <div className={styles.secondImageContainer}>
          <div className={styles.secondImageText}>Comet Messenger - Join one of the most inspiring communities in 2023!</div>
          <img src={Screenshot2} alt="Social Web Second" className={styles.middleImg} />
        </div>
      </div>

      <div className={styles.bottomContainer}>
        <LoginPopup open={openLoginPopup} onClose={() => setOpenLoginPopup(false)} popUpValue={popUpValue} />
        <div className={styles.loginFormWrapper}>
          <div className={styles.login_form_container}>
            <div className={styles.left}>
              <form className={styles.form_container} onSubmit={handleSubmit}>
                <h1>Login to Comet Messenger</h1>
                <input type="email" placeholder="Email" name="email" onChange={handleChange} value={data.email} required className={styles.input} />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={data.password}
                  required
                  className={styles.input}
                />
                {error && <div className={styles.error_msg}>{error}</div>}
                <button type="submit" className={styles.green_btn}>
                  Login
                </button>
              </form>
            </div>
            <div className={styles.right}>
              <h1>New User ?</h1>
              <Link to="/register">
                <button type="button" className={styles.white_btn}>
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.bottomBar}>
          <div className={styles.whiteTextBottomL} onClick={() => HandleLoginPopup(0)}>
            Impressum
          </div>
          <div className={styles.whiteTextBottomM} onClick={() => HandleLoginPopup(1)}>
            Datenschutz
          </div>
          <div className={styles.whiteTextBottomR} onClick={() => HandleLoginPopup(2)}>
            About Comet Messenger
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
