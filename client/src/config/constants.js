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

  // =====> Register btn
  submit: 'Create account',
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
  products
};

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

export default constants;
