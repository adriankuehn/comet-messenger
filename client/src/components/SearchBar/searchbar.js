import React, { useState } from "react";
import styles from "./searchbar.module.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import axios from "axios";
import SERVER_URL from "../../config";

function SearchBar({
  placeholder,
  data,
  userId,
  setFriendsPending,
  friendsPending,
  friendsToAccept,
  friends,
  setCurrentChat,
  conversations,
  setInSearch,
}) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
    setInSearch(0);
  };

  const handleConnectRequest = async (value) => {
    try {
      const postConnectRequest = async () => {
        const body = { userId: userId, requestedUserName: value };
        console.log("requested: " + value);
        await axios.post(SERVER_URL + "users/request", body);
      };
      await postConnectRequest();
      setFriendsPending(friendsPending.concat(value));
    } catch (err) {
      console.log("Found (Connect Request): " + err);
    }
  };

  const openChat = async (value) => {
    try {
      const newChat = conversations.filter((conv) => conv.members[0] === value || conv.members[1] === value);
      console.log("newChat[0]: " + JSON.stringify(newChat[0]));
      setCurrentChat(newChat[0]);
    } catch (err) {
      console.log("Could not open new Chat: " + err);
    }
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchInputs}>
        <input type="text" placeholder={placeholder} value={wordEntered} onChange={handleFilter} onClick={() => setInSearch(1)} />
        <div className={styles.searchIcon}>{filteredData.length === 0 ? <SearchIcon /> : <CloseIcon id="clearBtn" onClick={clearInput} />}</div>
      </div>
      {filteredData.length !== 0 && (
        <div className={styles.dataResult}>
          {filteredData.slice(0, 10).map((value, key) => {
            return (
              <div className={styles.dataItem} key={key}>
                <p>{value} </p>
                {friends.includes(value) ? (
                  <button className={styles.connectButton} onClick={() => openChat(value)}>
                    open
                  </button>
                ) : (
                  <>
                    {friendsPending.includes(value) || friendsToAccept.includes(value) ? (
                      <button className={styles.pendingButton}>pending</button>
                    ) : (
                      <button className={styles.connectButton} onClick={() => handleConnectRequest(value)}>
                        connect
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
