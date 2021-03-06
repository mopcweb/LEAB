/* ------------------------------------------------------------------- */
/*                              Status Codes
/* ------------------------------------------------------------------- */

const statusCodes = {
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
};

/* ------------------------------------------------------------------- */
/*                              General
/* ------------------------------------------------------------------- */

const general = {
  // =====> No userId provided error
  noUserIdMsg: 'There were no userId provided',

  // =====> 400: Bad Request
  badReqCode: statusCodes.badReqCode,
};

/* ------------------------------------------------------------------- */
/*                              Error
/* ------------------------------------------------------------------- */

const error = {
  // =====> No userId provided error
  errorMsg: 'No such api provided via web-server',

  // =====> 400: Bad Request
  notFoundCode: statusCodes.notFoundCode,
};

/* ------------------------------------------------------------------- */
/*                              Users
/* ------------------------------------------------------------------- */

const users = {
  // =====> Updated success
  updateSuccessMsg: 'Updated user profile: success',

  // =====> Updated error
  updateErrorMsg: 'Error occured while updating',

  // =====> Delete success
  deleteSuccessMsg: 'Deleted user: success',

  // =====> Delete error
  deleteErrorMsg: 'Error occured while deleting',

  // =====> No email provided error
  noEmailMsg: 'There were no email provided',

  // =====> 400: Bad Request
  badReqCode: statusCodes.badReqCode,

  // =====> Exist response
  existMsg: 'There is already exists a user with email:',

  // =====> 409: Conflict
  existCode: statusCodes.conflictCode,

  // =====> 200: OK
  successCode: statusCodes.successCode,

  // =====> Error -> can't change email
  emailNoChangeMsg: 'It is not allowed to change email property',

  // =====> 403: Forbidden
  forbiddenCode: statusCodes.forbiddenCode,
};

/* ------------------------------------------------------------------- */
/*                              Langs
/* ------------------------------------------------------------------- */

const langs = {
  // =====> Updated success
  updateSuccessMsg: 'Updated lang: success',

  // =====> Updated error
  updateErrorMsg: 'Error occured while updating',

  // =====> Delete success
  deleteSuccessMsg: 'Deleted lang: success',

  // =====> Delete error
  deleteErrorMsg: 'Error occured while deleting',

  // =====> No email provided error
  noEmailMsg: 'There were no title provided',

  // =====> Exist response
  existMsg: 'There is already exists a lang with title:',

  // =====> Error -> can't change email
  emailNoChangeMsg: 'It is not allowed to change email property',

};

/* ------------------------------------------------------------------- */
/*                              Products
/* ------------------------------------------------------------------- */

const products = {
  // =====> Updated success
  updateSuccessMsg: 'Updated product: success',

  // =====> Updated error
  updateErrorMsg: 'Error occured while updating',

  // =====> Delete success
  deleteSuccessMsg: 'Deleted product: success',

  // =====> Delete error
  deleteErrorMsg: 'Error occured while deleting',

  // =====> 400: Bad Request
  badReqCode: statusCodes.badReqCode,

  // =====> Exist response
  existMsg: 'There is already exists a product with title:',

  // =====> 409: Conflict
  existCode: statusCodes.conflictCode,

  // =====> 200: OK
  successCode: statusCodes.successCode,
};

/* ------------------------------------------------------------------- */
/*                             Categories
/* ------------------------------------------------------------------- */

const categories = {
  // =====> Updated success
  updateSuccessMsg: 'Updated category: success',

  // =====> Updated error
  updateErrorMsg: 'Error occured while updating',

  // =====> Delete success
  deleteSuccessMsg: 'Deleted category: success',

  // =====> Delete error
  deleteErrorMsg: 'Error occured while deleting',

  // =====> 400: Bad Request
  badReqCode: statusCodes.badReqCode,

  // =====> Exist response
  existMsg: 'There is already exists a category with title:',

  // =====> 409: Conflict
  existCode: statusCodes.conflictCode,

  // =====> 200: OK
  successCode: statusCodes.successCode,
};

/* ------------------------------------------------------------------- */
/*                             Functions
/* ------------------------------------------------------------------- */

// =====> Success response
const successRes = (res, status, result, url, method) => {
  console.log({ status, statusText: 'Success', url, method, result });
  return res.status(status).send({ status, statusText: 'Success', url, method, result });
};

// =====> Error response
const errorRes = (res, status, result, url, method) => {
  console.error({ status, statusText: 'Error', url, method, result });
  return res.status(status).send({ status, statusText: 'Error', url, method, result });
};

/* ------------------------------------------------------------------- */
/*                             Constants
/* ------------------------------------------------------------------- */

const constants = {
  statusCodes,
  errorRes,
  successRes,
  general,
  error,
  users,
  langs,
  products,
  categories
};

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = constants;
