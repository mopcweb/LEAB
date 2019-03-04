/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

const { routes, databaseURL } = require('./config');

/* ------------------------------------------------------------------- */
/*                         Firebase Admin SDK
/* ------------------------------------------------------------------- */

const admin = require('firebase-admin');
const serviceAccount = require('./privateKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL
});

/* ------------------------------------------------------------------- */
/*                              Constants
/* ------------------------------------------------------------------- */

const { errorRes, successRes } = require('./constants');

const {
  successCode, unauthorizedCode, badReqCode
} = require('./constants').statusCodes;

const { invalidTokenMsg, noUserIdMsg } = require('./constants').general;

/* ------------------------------------------------------------------- */
/*                            Verify Token
/* ------------------------------------------------------------------- */

const checkToken = (req, res, next) => {
  // Get url & method for error response
  const { originalUrl, method } = req;

  // Avoid verifying for GET or POST '/users'
  if (
    originalUrl.indexOf(routes.USERS) !== -1 &&
    (method === 'GET' || method === 'POST')
  ) return next();

  // Get token & uid from headers
  const { token, uid } = req.headers;

  if (!token || !uid)
  return errorRes(res, unauthorizedCode, invalidTokenMsg, originalUrl, method);

  // Verify token
  admin.auth()
    .verifyIdToken(token)
    .then(decodedToken => decodedToken.uid === uid
      ? next()
      : errorRes(res, unauthorizedCode, invalidTokenMsg, originalUrl, method))
    .catch(err => errorRes(res, unauthorizedCode, err, originalUrl, method));
};

/* ------------------------------------------------------------------- */
/*                       Provide & Verify userId
/* ------------------------------------------------------------------- */

const checkUserId = (req, res, next) => {
  // Get userId header
  const { userid } = req.headers;

  // Get url & method for error response
  const { originalUrl, method } = req;

  // Save into res.variable
  // LowerCase & trim() userId (which is email) -> to
  // prevent errors and duplicate userIds
  // If there is no userId -> send error
  if (userid) res.userId = userid.toLowerCase().trim()
  else return errorRes(res, badReqCode, noUserIdMsg, originalUrl, method);

  // Path results further
  return next();
};

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = {
  checkToken,
  checkUserId
};
