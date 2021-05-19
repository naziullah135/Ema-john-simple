import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useContext, useState } from "react";
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import  './Login.css';
firebase.initializeApp(firebaseConfig);

function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password: "",
    photo: "",
    error: "",
    success: false,
  });
   
  const [loggedInUser,setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };
  

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUserToken();
        setUser(signedInUser);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };

  const setUserToken = () =>{
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
      sessionStorage.setItem('token',idToken)
    }).catch(function(error) {
      // Handle error
    });
  }
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const singnedOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          photo: "",
        };
        setUser(singnedOutUser);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.name.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };
  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          updateUserName(user.name);
        });
    }

    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          setLoggedInUser(newUserInfo);
          history.replace(from);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }

    e.preventDefault();
  };

  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name,
      })
      .then(function () {
        console.log("user name updated successfuly");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleFbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // The signed-in user info.
        var user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var accessToken = credential.accessToken;
        console.log(user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        // ...
      });
  };
  return (
    <div style={{textAlign:'center'}}>
      {user.isSignedIn ? (
        <button className="google-btn" onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button className="google-btn btn btn-danger" onClick={handleSignIn}>Sign in with Google</button>
      )}
      <br />
      <button className="input-field btn btn-primary" onClick={handleFbSignIn}>Sign in using Facebook</button>
      {user.isSignedIn && (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
      <h1>Own authentication</h1>
      <input className="input-field"
        type="checkbox"
        name="newUser"
        onChange={() => setNewUser(!newUser)}
        id=""
      /><label htmlFor="newUser">New user sign Up</label>
      
      <form onSubmit={handleSubmit}>
        {newUser && (
          <input  className="input-field"
            type="text"
            name="name"
            onBlur={handleBlur}
            placeholder="Enter your name"
            id=""
            required
          />
        )}
        <br />
        <input  className="input-field"
          type="text"
          name="email"
          onBlur={handleBlur}
          placeholder="Enter your email"
          id=""
          required
        />
        <br />
        <input  className="input-field"
          type="password"
          name="password"
          onBlur={handleBlur}
          placeholder="Enter your password"
          required
          id=""
        />
        <br />
        <input  className="input-field btn btn-warning" type="submit" value={newUser ? "Sign Up" : "Sign In"} />
      </form>
      {/* <p style={{color:'red'}}>{user.error}</p> */}
      {user.success ? (
        <p style={{ color: "green" }}>
          User {newUser ? "created" : "logged in"} successfuly
        </p>
      ) : (
        <p style={{ color: "red" }}>{user.error}</p>
      )}
    </div>
  );
}

export default Login;
