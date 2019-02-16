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
/*                              Error
/* ------------------------------------------------------------------- */

const error = {
  // =====> Response msg
  response: {
    status: 'Error',
    statusCode: statusCodes.notFoundCode,
    result: 'No such api provided via web-server'
  }
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

  // =====> Error -> can't change userId
  userIdNoChangeMsg: 'It is not allowed to change userId property',

  // =====> 403: Forbidden
  forbiddenCode: statusCodes.forbiddenCode,
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

  // =====> Error -> can't change userId
  userIdNoChangeMsg: 'It is not allowed to change userId property',

  // =====> 403: Forbidden
  forbiddenCode: statusCodes.forbiddenCode,
};

/* ------------------------------------------------------------------- */
/*                             Functions
/* ------------------------------------------------------------------- */

const errorRes = (result, statusCode) => {
  return {status: 'Error', statusCode, result}
};

const successRes = (result, statusCode) => {
  return {status: 'Success', statusCode, result}
};

/* ------------------------------------------------------------------- */
/*                             Constants
/* ------------------------------------------------------------------- */

const constants = {
  errorRes,
  successRes,
  error,
  users,
  products,
  categories
};

/* ------------------------------------------------------------------- */
/*                               Export
/* ------------------------------------------------------------------- */

module.exports = constants;
