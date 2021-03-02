import React, {useRef, useState} from 'react'
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCqBriY2xY17YZaaCrd-xwH_Iqh3dXJH2g",
  authDomain: "superchat-react-91351.firebaseapp.com",
  projectId: "superchat-react-91351",
  storageBucket: "superchat-react-91351.appspot.com",
  messagingSenderId: "539993701960",
  appId: "1:539993701960:web:9a5b6baa7d5cc552fa227d"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

function Chatroom() {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setformValue] = useState('');

  const dummy = useRef();
  const sendMessage = async(e)=>{
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;

    await messageRef.add({
      text: formValue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setformValue('');
    dummy.current.scrollIntoView({behavior : 'smooth'})
  }
  return (
    <>
      <main>
        {messages &&
          messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
          <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=> setformValue(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </>
  );
}
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL}></img>
      <p>{text}</p>
    </div>
  )
}
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className=""></header>
      <section>{user ? <Chatroom /> : <SignIn />}</section>
    </div>
  );
}

export default App;
