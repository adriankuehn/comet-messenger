import axios from "axios";
import FileBase from "react-file-base64";
import { useState, useEffect } from "react";
import TopbarProfile from "./TopbarProfile/topbarprofile";
import styles from "./profile.module.css";
import { CircularProgress } from "@material-ui/core";
import SERVER_URL from "../../config";
import { format } from "timeago.js";
import Imgpopup from "./ImagePopUp/imgpopup";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import auth from "../../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";

const Profile = (props) => {
  // TUTORIAL: https://www.youtube.com/watch?v=O3sQRJ4ksPs

  var user = props.user;
  const [postData, setPostData] = useState({ user_id: user._id, selectedFile: "", describtion: "" });
  const [profilePictureData, setProfilePictureData] = useState({ user_id: user._id, selectedFile: "" });
  const [updateProfilePic, setUpdateProfilePic] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [openImgPopup, setOpenImgPopup] = useState(false);
  const [currentPicture, setCurrentPicture] = useState("");
  const [choosePicorLikes, setChoosePicorLikes] = useState(0);
  const [currentLikes, setCurrentLikes] = useState([]);
  const [loadingFinished, setLoadingFinished] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(SERVER_URL + `users/profile_pic`, profilePictureData);
    setUpdateProfilePic(1);
    user.profilePicture = profilePictureData.selectedFile;
    localStorage.setItem("user_all", JSON.stringify(user));
    setProfilePictureData({ ...profilePictureData, selectedFile: "" });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await axios.post(SERVER_URL + `posts/`, postData);
    if (res.status === 200) {
      //console.log("post created");
      setUserPosts([res.data, ...userPosts]);
    }
    setPostData({ ...postData, describtion: "" });
  };

  function HandleIMGPopup(postId, pic_or_likes) {
    console.log("postId: " + postId);
    setCurrentPicture(userPosts.filter((post) => post._id === postId)[0].picture);
    setCurrentLikes(userPosts.filter((post) => post._id === postId)[0].likes);
    setChoosePicorLikes(pic_or_likes);
    setOpenImgPopup(true);
  }

  const unique = (user_posts) => {
    var arr_result = [];
    var arr_ids = [];
    for (let i = 0; i < user_posts.length; i++) {
      if (!arr_ids.includes(user_posts[i]._id.toString())) {
        arr_result.push(user_posts[i]);
        arr_ids.push(user_posts[i]._id);
      }
    }
    return arr_result;
  };

  const filter_out = (user_posts, filter_id) => {
    var arr_result = [];
    for (let i = 0; i < user_posts.length; i++) {
      if (filter_id !== user_posts[i]._id) {
        arr_result.push(user_posts[i]);
      }
    }
    return arr_result;
  };

  const DeletePost = async (postId) => {
    const delete_data = { user_id: user._id, post_id: postId };
    const res = await axios.post(SERVER_URL + `posts/delete`, delete_data);
    if (res.status === 200) {
      //console.log('filter_out(userPosts):', filter_out(userPosts, postId))
      setUserPosts(filter_out(userPosts, postId));
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const val_reset = window.confirm("Do you really want to reset your password?");
    if (val_reset) {
      sendPasswordResetEmail(auth, user.email)
        .then(() => {
          window.alert("Go to your Emails for the password reset link.");
        })
        .catch((error) => {
          console.log("An error occured");
        });
    }
  };

  const sortArray = (array_c) => {
    var array_conv = [...array_c];
    for (let i_c = 0; i_c < array_conv.length; i_c++) {
      array_conv[i_c].updatedAt = new Date(array_conv[i_c].updatedAt);
    }
    var sorted_array = array_conv.sort(function (a, b) {
      return b.updatedAt - a.updatedAt;
    });
    return sorted_array;
  };

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const res = await axios.get(SERVER_URL + "posts/" + user._id);
        const answer_posts = [...res.data];
        setUserPosts(sortArray(unique(answer_posts)));
        setLoadingFinished(1);
      } catch (err) {
        console.log(err);
      }
    };
    getUserPosts();
  }, [user]);

  return (
    <div>
      <Imgpopup
        open={openImgPopup}
        onClose={() => setOpenImgPopup(false)}
        picture={currentPicture}
        likes={currentLikes}
        choosePicorLikes={choosePicorLikes}
      />
      <TopbarProfile user={user} />

      <div className={styles.mainContainer}>
        <div className={styles.leftSide}>
          <div className={styles.overview}>
            <h2>Overview: </h2>
            <h3>User Name: {user.userName}</h3>
            <h3>Email: {user.email}</h3>
            <h3>Friends: {user.friends.length}</h3>
            <h3>Posts: {userPosts ? userPosts.length : ""}</h3>
          </div>
          <div className={styles.Abstand} />
          <h2>Update Profile Picture:</h2>
          <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <div className={styles.wrapperProfilePic}>
              <FileBase
                type="file"
                multiple={false}
                value={profilePictureData.selectedFile}
                onDone={({ base64 }) => {
                  setProfilePictureData({ ...profilePictureData, selectedFile: base64 });
                  setUpdateProfilePic(0);
                }}
              />
              <button type="submit" className={styles.white_btn3}>
                Update
              </button>
            </div>
          </form>
          {updateProfilePic ? <p>Profile picture was updated!</p> : <p></p>}
          <div className={styles.Abstand} />
          <h2>Change Password:</h2>
          <button className={styles.white_btn} onClick={handlePasswordReset}>
            Change
          </button>
        </div>

        <div className={styles.rightSide}>
          <form autoComplete="off" noValidate onSubmit={handleCreate}>
            <div className={styles.newPost}>
              <div className={styles.formWrapper}>
                <div className={styles.titleCreatePost}>Create post:</div>
                <FileBase
                  type="file"
                  multiple={false}
                  onDone={({ base64 }) => {
                    setPostData({ ...postData, selectedFile: base64 });
                  }}
                />
                <input
                  type="text"
                  className={styles.describtionInput}
                  placeholder={"Add a describtion"}
                  value={postData.describtion}
                  maxLength="22"
                  onChange={(e) => setPostData({ ...postData, describtion: e.target.value })}
                />
              </div>
              <button type="submit" className={styles.white_btn2}>
                Create
              </button>
            </div>
          </form>

          {!loadingFinished ? (
            <CircularProgress className={styles.circularProg} />
          ) : (
            <div>
              {!userPosts.length ? (
                <div className={styles.noConversationText}>In this area you can create a new post or alter existing posts</div>
              ) : (
                <div className={styles.gridPosts}>
                  {userPosts.map((post) => (
                    <div key={post._id} className={styles.singlePost}>
                      <img src={post.picture} key={post._id} alt="" className={styles.postImg} onClick={() => HandleIMGPopup(post._id, 0)} />

                      <div className={styles.timeAgo}>{format(post.createdAt)}</div>
                      <div className={styles.postDiscribtion}>{post.describtion}</div>
                      <div className={styles.postLikeandDelete}>
                        <div className={styles.postLike} onClick={() => HandleIMGPopup(post._id, 1)}>
                          <ThumbUpAltIcon fontSize="small" />
                          <div className={styles.likeCount}>See Likes: {post.likes.length}</div>
                        </div>
                        <div className={styles.postDelete} onClick={() => DeletePost(post._id)}>
                          <DeleteIcon fontSize="small" />
                          Delete
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
