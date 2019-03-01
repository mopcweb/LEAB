/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

import * as routes from './routes';

/* ------------------------------------------------------------------- */
/*                              Global
/* ------------------------------------------------------------------- */

// =====> Default img
import defaultImg from './default.svg';

// =====> Max file size in kb for upload (default 1000000kb)
const fileSize = 1000000;

export const globalC = {
  defaultImg,

  // =====> localStorage 'user'
  userLC: 'user',

  // =====> localStorage 'token'
  tokenLC: 'token',

  // =====> Error: Only images allowed error Msg
  onlyImgsMsg: 'Only images allowed',

  // =====> Error: File too big error msg
  fileTooBigMsg: `File too big. Max size is ${fileSize} kb`,
};

/* ------------------------------------------------------------------- */
/*                              Register
/* ------------------------------------------------------------------- */

export const register = {
  // =====> Default img
  defaultImg,

  // =====> localStorage 'user'
  userLC: globalC.userLC,

  // =====> Error: Exist user msg
  existMsg: 'User with this email already exists',

  // =====> Error: Password too short
  weakPwdMsg: 'Password should be at least 6 characters',

  // =====> Welcome text
  welcome: 'Welcome to the LEAB app !',

  // =====> Tip text
  tip: 'Create your login and password, please!',

  // =====> Question text (under form)
  question: 'Have an account already ?',

  // =====> Question btn value
  questionBtn: 'Sign in',

  // =====> Links in header
  links: [
    {value: 'Home', link: routes.HOME},
    {value: 'Sign in', link: routes.LOGIN}
  ],

  // =====> Current page value in header
  activePage: 'Register',

  // =====> Input lables
  username: 'Username',
  email: 'Email',
  pwd: 'Password',
  confirmPwd: 'Confirm password',

  // =====> Default portions (in grams)
  defaultStandart: 500,
  defaultBig: 250,

  // =====> Default lang
  lang: 'en',

  // =====> Register btn
  submit: 'Create account',
};

/* ------------------------------------------------------------------- */
/*                             Constants
/* ------------------------------------------------------------------- */

export const constants = {
  globalC,
  register
};

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

export default constants;
