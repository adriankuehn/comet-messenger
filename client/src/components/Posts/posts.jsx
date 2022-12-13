import styles from "./posts.module.css";
import axios from "axios";
import SERVER_URL from "../../config";
import { format } from "timeago.js";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";


const Posts = (props) => {
  var user = props.user;
  var currentChat = props.currentChat;
  var friendPosts = props.friendPosts;
  var setFriendPosts = props.setFriendPosts;
  var handleIMGPopupHome = props.handleIMGPopupHome;

  const addLike = (arrayPosts, filter_id) => {
    var arr_result = [];
    for (let i = 0; i < arrayPosts.length; i++) {
      if (filter_id === arrayPosts[i]._id) {
        arr_result.push(arrayPosts[i]);
        arr_result[i].likes.push(user.userName);
      } else {
        arr_result.push(arrayPosts[i]);
      }
    }
    return arr_result;
  };

  const GiveLike = async (postId) => {
    const receiverName = currentChat.members.find((member) => member !== user.userName);
    const like_data = { user_id: user._id, post_id: postId, receiverName: receiverName };
    const res = await axios.post(SERVER_URL + `posts/givelike`, like_data);
    if (res.status === 200) {
      //console.log('filter_out(friendPosts):', filter_out(friendPosts, postId))
      console.log("Succesfully like given");
      setFriendPosts(addLike(friendPosts, postId));
    }
  };

  return (
    <div className={styles.PostWrapper}>
      <div className={styles.gridPosts}>
        {friendPosts.map((post) => (
          <div key={post._id} className={styles.singlePost}>
            <img src={post.picture} key={post._id} alt="" className={styles.postImg} onClick={() => handleIMGPopupHome(post._id)} />

            <div className={styles.timeAgo}>{format(post.createdAt)}</div>
            <div className={styles.postDescription}>{post.describtion}</div>
            <div className={styles.postLikeandDelete}>
              <div className={styles.postLike} onClick={() => GiveLike(post._id)}>
                <ThumbUpAltIcon fontSize="small" />
                <div className={styles.likeCount}>Likes: {post.likes.length}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
