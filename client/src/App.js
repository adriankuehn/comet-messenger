import Login from "./components/Login/login";
import { Route, Routes } from "react-router-dom";
import Main from "./components/Main/main";
import Register from "./components/Register/register";
import Profile from "./components/Profile/profile";

function App() {
  //  Registration: Firebase crates firebaseKey which is stored in MongoDB
  // Login: First Login with Email in Password in Firebase, Firebase returns firebaseKey to client which can then be used
  // to get all the general userdata from MongoDb. This general userdata contains the MongoDB userID which is used for
  // authentication of all the server function except the login
  // Page Refresh: userdata is stored in localstorage
  const user = JSON.parse(localStorage.getItem("user_all"));

  return (
    <Routes>
      {user && <Route path="/" exact element={<Main user={user} />} />}
      {user && <Route path="/profile" exact element={<Profile user={user} />} />}
      <Route path="/register" exact element={<Register />} />
      <Route path="/profile" element={<Login />} />
      <Route path="/" exact element={<Login />} />
    </Routes>
  );
}

export default App;
