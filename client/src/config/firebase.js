import app from 'firebase/app';
import 'firebase/auth';

import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> API
// import * as api from './api';

// const devConfig = {
//   apiKey: process.env.REACT_APP_DEV_API_KEY,
//   authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
//   projectId: process.env.REACT_APP_DEV_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
// };

// const prodConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
// };

// const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

const config = {
  apiKey: "AIzaSyBgeZLWVC-YmZMPgR_VdZvfgNPgvxx82wM",
  authDomain: "leab-a658d.firebaseapp.com",
  databaseURL: "https://leab-a658d.firebaseio.com",
  projectId: "leab-a658d",
  storageBucket: "leab-a658d.appspot.com",
  messagingSenderId: "17150711236"
};

/* ------------------------------------------------------------------- */
/*                              Firebase
/* ------------------------------------------------------------------- */

export default class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
  }

  // ==================>                             <================== //
  //                             Auth API
  // ==================>                             <================== //

  // =====> Create account
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  // =====> Sign in
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  // =====> Sign Out
  doSignOut = () => this.auth.signOut()

  // =====> Reset Pwd
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  // =====> Update Pwd
  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password)

  // =====> Send token
  doGetIdToken = (uid, email) =>
    this.auth.currentUser.getIdToken(true)
      // .then(token => axios
      //   .post(api.AUTH, { uid }, { headers: { token } })
      //   .then(res => res)
      //   .catch(err => new Error(err)))
      .then(token => {
        // Provide headers to axios
        axios.defaults.headers.common['token'] = token;
        axios.defaults.headers.common['uid'] = uid;
        axios.defaults.headers.common['userid'] = email;
      })
      .catch(err => console.log('=====> Error sending token', err))
};



//
