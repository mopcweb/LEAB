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

  // =====> Register btn
  submit: 'Create account',
};

/* ------------------------------------------------------------------- */
/*                              Profile
/* ------------------------------------------------------------------- */

export const profile = {
  // =====> Default img
  defaultImg,

  // =====> File max size
  fileSize,

  // =====> localStorage 'user'
  userLC: globalC.userLC,

  // =====> localStorage 'token'
  tokenLC: globalC.tokenLC,

  // =====> Error: Only images allowed error Msg
  onlyImgsMsg: globalC.onlyImgsMsg,

  // =====> Error: File too big error msg
  fileTooBigMsg: globalC.fileTooBigMsg,

  // =====> Success: pwd update message
  pwdUpdateMsg: 'Password update success',

  // =====> Success: Profile update success
  profileUpMsg: 'Updated profile',

  // =====> Form 1 (Change pwd)
  form1Title: 'Change password',
  form1Submit: 'Update',

  // =====> Change pwd input labels
  pwd: 'New password',
  confirmPwd: 'Confirm password',

  // =====> Form 2 (Edit)
  form2Title: 'Edit',
  form2Submit: 'Save',

  // =====> Edit input labels
  username: 'Username',
  standart: 'Standart portion (in grams)',
  big: 'Big portion (in grams)',

  // =====> Select labels
  currency: 'Choose currency',

  // =====> Img btn-label
  imgUpload: 'Upload',
};

/* ------------------------------------------------------------------- */
/*                             Products
/* ------------------------------------------------------------------- */

export const products = {
  // =====> File max size
  fileSize,

  // =====> Error: Only images allowed error Msg
  onlyImgsMsg: globalC.onlyImgsMsg,

  // =====> Error: File too big error msg
  fileTooBigMsg: globalC.fileTooBigMsg,

  // =====> Error: Empty cat title
  addEmptyCatTitleMsg: 'Can\'t add category without title',
  renameEmptyCatTitleMsg: 'Can\'t rename into empty string',

  // =====> Error: Already exists
  existMsg: 'There is already exists category with this title',

  // =====> Error: Unable delete category with products
  notEmptyCategoryMsg: 'Can\'t delete category with products in it',

  // =====> Success: Add new category
  addCategoryMsg: 'Added new category',

  // =====> Success: Delete category
  deleteCategoryMsg: 'Category deleted',

  // =====> Success: Update category
  updateCategoryMsg: 'Category updated',

  // =====> Header
  header: 'Products',

  // =====> File input label value (placeholder)
  catImgTitle: 'Image for category',

  // =====> File input placeholder
  catTitle: 'Category title',
};

/* ------------------------------------------------------------------- */
/*                             Constants
/* ------------------------------------------------------------------- */

export const constants = {
  globalC,
  register,
  profile,
  products
};

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

export default constants;
