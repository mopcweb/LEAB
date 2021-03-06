import app from 'firebase/app';
import 'firebase/auth';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

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

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password)
};



//
