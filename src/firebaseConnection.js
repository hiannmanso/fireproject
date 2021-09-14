import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'



let firebaseConfig = {
    apiKey: "AIzaSyBP8kkQQDpqQJ0DjT2P12FuhDWh-RX8G80",
    authDomain: "reactjs-6b01e.firebaseapp.com",
    projectId: "reactjs-6b01e",
    storageBucket: "reactjs-6b01e.appspot.com",
    messagingSenderId: "499194842475",
    appId: "1:499194842475:web:c47140e80fb4e09009d02e",
    measurementId: "G-19T10RE857"
  };
  // Initialize Firebase

  if( ! firebase.apps.lenght ){
    firebase.initializeApp(firebaseConfig);
  }

  export default firebase