/* ------------------------------------------------------- */
/*                          Config
/* ------------------------------------------------------- */

import * as routes from './routes';

// =====> Default img
import defaultImg from './default.svg';

/* ------------------------------------------------------- */
/*                          Global
/* ------------------------------------------------------- */

const globalC = {
  // =====> localStorage 'user'
  userLC: 'user',

  // =====> localStorage 'token'
  tokenLC: 'token',

  // =====> Max file size for upload
  fileSize: 1000000
};

/* ------------------------------------------------------- */
/*                          Register
/* ------------------------------------------------------- */

export const register = {
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

  // =====> Exist user msg
  existMsg: 'Already exists',

  // =====> localStorage 'user'
  userLC: globalC.userLC,

  // =====> Input lables
  username: 'Username',
  email: 'Email',
  pwd: 'Password',
  confirmPwd: 'Confirm password',

  // =====> Register btn
  submit: 'Create account'

};

/* ------------------------------------------------------- */
/*                          Profile
/* ------------------------------------------------------- */

export const profile = {
  // =====> localStorage 'user'
  userLC: globalC.userLC,

  // =====> localStorage 'token'
  tokenLC: globalC.tokenLC,

  // =====> User
  user: JSON.parse(window.localStorage.getItem(globalC.userLC)),

  // =====> Form 1 (Change pwd)
  form1Title: 'Change password',
  form1Submit: 'Update',

  // =====> Change pwd input labels
  pwd: 'New password',
  confirmPwd: 'Confirm password',

  // =====> Form 2 (Edit)
  form2Title: 'Edit',
  form2Submit: 'Save',

  // =====> Edit input lavels
  username: 'Username',

  // =====> Select labels
  currency: 'Choose currency',

  // =====> Img btn-label
  imgUpload: 'Upload',

  // =====> Success pwd update message
  pwdUpdateMsg: 'Password update success',

  // =====> Only images allowed error Msg
  onlyImgsMsg: 'Only images allowed',

  // =====> File too big error msg
  fileTooBigMsg: `File too big. Max size is ${globalC.fileSize} kb`,

  // =====> File max size
  fileSize: globalC.fileSize,

  // =====> Profile update success
  profileUpMsg: 'Updated profile',

  defaultImg,
};

/* ------------------------------------------------------- */
/*                          Constants
/* ------------------------------------------------------- */

export const constants = {
  register,
  profile
};

/* ------------------------------------------------------- */
/*                          Export
/* ------------------------------------------------------- */

export default constants;
