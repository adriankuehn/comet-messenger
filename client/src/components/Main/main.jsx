import Topbar from "../Topbar/topbar";
import styles from "./main.module.css";
import "./main.module.css";
import Conversation from "../Conversations/conversation";
import Message from "../Message/message";
import SearchBar from "../SearchBar/searchbar";
import Posts from "../Posts/posts";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import SERVER_URL from "../../config";
import Popup from "../PopupRequests/popuprequests";
import Imgpopuphome from "../Posts/ImagePopUpHome/imgpopuphome";
import ChatIcon from "@material-ui/icons/Chat";
import CollectionsIcon from "@material-ui/icons/Collections";

const Main = (props) => {
  var user = props.user;

  //
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();
  const [receiver, setReceiver] = useState(null);
  const [userNameData, setUserNameData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [friendsPending, setFriendsPending] = useState([]);
  const [friendsToAccept, setFriendsToAccept] = useState([]);
  const [friends, setFriends] = useState([]);
  const [varChatPosts, setVarChatPosts] = useState(1);
  const [friendPosts, setFriendPosts] = useState([]);
  const [openImgPopupHome, setOpenImgPopupHome] = useState(false);
  const [currentPictureHome, setCurrentPictureHome] = useState("");
  const [inSearch, setInSearch] = useState(0);
  

  //
  //
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderName,
        text: data.text,
        createdAt: Date.now(),
        _id: Date.now(),
        // necessary to specify a id, otherwise each message wouldn't have a
        // unique key and browser would create warnings
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user.userName);
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(SERVER_URL + "conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log("Found: " + err);
      }
    };
    getConversations();
    const getUserNameData = async () => {
      try {
        const res = await axios.get(SERVER_URL + "users/allUserNames/" + user._id);
        //console.log("allUserNames: " + JSON.stringify(res.data))
        setUserNameData(res.data);
      } catch (err) {
        console.log("Found: " + err);
      }
    };
    getUserNameData();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const res = await axios.get(SERVER_URL + "messages/" + currentChat?._id);
          setMessages(res.data);
          const receiverName = currentChat.members.find((member) => member !== user.userName);
          //console.log(SERVER_URL + "posts/otheruser?userId="+user._id+"&userName="+receiverName)
          const res2 = await axios.get(SERVER_URL + "posts/otheruser/" + user._id + "/" + receiverName);
          setFriendPosts(sortArray(res2.data));
        }
      } catch (err) {}
    };
    getMessages();
  }, [currentChat, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, varChatPosts]);

  useEffect(() => {
    const getReceiver = async () => {
      if (currentChat != null) {
        const receiverName = currentChat.members.find((member) => member !== user.userName);
        try {
          const res = await axios.get(SERVER_URL + "users/friend/" + receiverName);
          setReceiver(res.data);
        } catch (err) {}
      }
    };
    getReceiver();
  }, [currentChat, user]);

  useEffect(() => {
    const getOpenRequests = async () => {
      try {
        const res = await axios.get(SERVER_URL + "users/openrequests/" + user._id);
        setFriendsPending(res.data.data.friendsPending);
        setFriendsToAccept(res.data.data.friendsToAccept);
        setFriends(res.data.data.friends);
      } catch (err) {
        console.log(err);
      }
    };
    getOpenRequests();
  }, [user]);

  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user.userName,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverName = currentChat.members.find((member) => member !== user.userName);
    socket.current.emit("sendMessage", {
      senderName: user.userName,
      receiverName: receiverName,
      text: newMessage,
    });
    try {
      const res = await axios.post(SERVER_URL + "messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log("Found3: " + err);
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

  function handleIMGPopupHome(postId) {
    //console.log("postId: " + JSON.stringify(postId));
    setCurrentPictureHome(friendPosts.filter((post) => post._id === postId)[0].picture);
    setOpenImgPopupHome(true);
  }

  //
  //
  return (
    <div>
      <Popup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        friendsPending={friendsPending}
        friendsToAccept={friendsToAccept}
        conversations={conversations}
        friends={friends}
        user={user}
        setFriendsToAccept={setFriendsToAccept}
        setFriendsPending={setFriendsPending}
        setConversations={setConversations}
        setFriends={setFriends}
      />
      <Imgpopuphome open={openImgPopupHome} onClose={() => setOpenImgPopupHome(false)} picture={currentPictureHome} />
      <Topbar user={user} setOpenPopup={setOpenPopup} friendsToAccept={friendsToAccept} friendsPending={friendsPending} setInSearch={setInSearch} />

      <div className={styles.mainContainer}>
        <div className={styles.leftBarWrapper}>
          <div className={styles.leftBar}>
            <SearchBar
              placeholder="Search for friends"
              data={userNameData}
              userId={user._id}
              setFriendsPending={setFriendsPending}
              friendsPending={friendsPending}
              friendsToAccept={friendsToAccept}
              friends={friends}
              setCurrentChat={setCurrentChat}
              conversations={conversations}
              setInSearch={setInSearch}
            />

            {conversations.length !== 0 ? (
              <div className={inSearch ? styles.conversationsWrapperSmall : styles.conversationsWrapper} onClick={() => setInSearch(0)}>
                {sortArray(conversations).map((c) => (
                  <div key={c._id} onClick={() => setCurrentChat(c)}>
                    <Conversation conversation={c} currentUser={user} />
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyConversationText}>Connect with friends first before starting to chat...</div>
            )}
          </div>
        </div>

        <div className={styles.mainBarChatPosts} onClick={() => setInSearch(0)}>
          <div className={styles.selectChatPosts}>
            <div className={varChatPosts ? styles.selectIconChat1 : styles.selectIconChat2} onClick={() => setVarChatPosts(1)}>
              <ChatIcon />
            </div>
            <div className={varChatPosts ? styles.selectIconPost1 : styles.selectIconPost2} onClick={() => setVarChatPosts(0)}>
              <CollectionsIcon />
            </div>
          </div>

          {varChatPosts ? (
            <div className={styles.chatBoxWrapper}>
              {currentChat ? (
                <>
                  <div className={styles.chatBoxTop}>
                    {messages.map((m) => (
                      <div key={m._id} ref={scrollRef}>
                        <Message
                          message={m}
                          own={m.sender === user.userName}
                          user_profilePicture={
                            m.sender === user.userName
                              ? user.profilePicture
                                ? user.profilePicture
                                : "images/noAvatar.png"
                              : !receiver
                              ? "images/noAvatar.png"
                              : receiver.profilePicture
                              ? receiver.profilePicture
                              : "images/noAvatar.png"
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className={styles.chatBoxBottom}>
                    <div className={styles.chatMessageInputWrapper}>
                      <textarea
                        className={styles.chatMessageInput}
                        placeholder={receiver ? "To: " + receiver.userName : ""}
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                      ></textarea>
                    </div>
                    <div className={styles.chatSubmitButtonWrapper}>
                      <button className={styles.chatSubmitButton} onClick={handleSubmit}>
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <span className={styles.noConversationText}>Open a conversation to start a chat.</span>
              )}
            </div>
          ) : (
            <Posts
              user={user}
              currentChat={currentChat}
              friendPosts={friendPosts}
              setFriendPosts={setFriendPosts}
              handleIMGPopupHome={handleIMGPopupHome}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
