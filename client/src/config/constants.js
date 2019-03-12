/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

import * as routes from './routes';

/* ------------------------------------------------------------------- */
/*                              Global
/* ------------------------------------------------------------------- */

// =====> Default img
import defaultImg from './default.svg';

export const globalC = {
  defaultImg,

  // =====> localStorage 'user'
  userLC: 'user',

  // =====> localStorage 'token'
  tokenLC: 'token',

  offlineErrorMsg: 'Network connection error. Please check your internet connection and come back',

  mongoErrorMsg: 'Database connection error. You will be logged out. Please, try relogin again later'
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

  // =====> Default currency
  currency: 'USD',

  // =====> Register btn
  submit: 'Create account',
};

/* ------------------------------------------------------------------- */
/*                              Status Codes
/* ------------------------------------------------------------------- */

export const statusCodes = {
  // =====> 200: OK
  successCode: 200,

  // =====> 400: Bad Request
  badReqCode: 400,

  // =====> 401: Unauthorized
  unauthorizedCode: 401,

  // =====> 403: Forbidden
  forbiddenCode: 403,

  // =====> 404: Not Found
  notFoundCode: 404,

  // =====> 409: Conflict (Use for Already exist only)
  conflictCode: 409,

  // =====> 500: Internal Server Error
  internalServerErrorCode: 500,

  // =====> 502: Bad Gateway
  badGatewayCode: 502,
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
