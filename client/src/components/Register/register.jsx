import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./register.module.css";
import SERVER_URL from "../../config";
import auth from "../../firebase-config";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";

const Register = () => {
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
    firebaseKey: "",
  });
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const check_credentials = async () => {
    try {
      await axios.post(SERVER_URL + "auth/check_register", data);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((await check_credentials()) === true) {
      await signOut(auth); //just to make sure we are signed out

      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (userCredential) => {
          // Registered and Signed in to Firebase
          console.log("registered succesfully");
          data.firebaseKey = auth.currentUser.uid;
          await axios.post(SERVER_URL + "auth/register", data); // Create MongoDB user using firebaseKey

          sendEmailVerification(auth.currentUser);
          signOut(auth);
          alert("Please confirm your Email address before logging in. Have a look in your spam folder as well.");
          window.location = "/";
        })
        .catch((error) => {
          setError("An Error Occured");
        });
    }
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome Back !</h1>
          <Link to="/">
            <button type="button" className={styles.white_btn}>
              Login
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h1>Create new Account</h1>
            <input
              type="text"
              placeholder="User Name"
              name="userName"
              onChange={handleChange}
              value={data.lastName}
              required
              className={styles.input}
            />
            <input type="email" placeholder="Email" name="email" onChange={handleChange} value={data.email} required className={styles.input} />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              pattern=".{6,}"
              title="Minimum 6 characters "
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
