/* ------------------------------------------------------- */
/*                         Config
/* ------------------------------------------------------- */

// =====> Api
export const api = '/api';

// =====> Routes
export const HOME = api + '/';
export const LOGIN = api + '/login';
export const REGISTER = api + '/register';
export const PROFILE = api + '/profile';
export const DASHBOARD = api + '/dashboard';
export const MENU = api + '/menu';
export const DISHES = api + '/dishes';
export const DISHES_CATEGORIES = api + '/dishesCategories';
export const PRODUCTS = api + '/products';
export const PRODUCTS_CATEGORIES = api + '/productsCategories';

// =====> BodyParser options
export const bp = {
  json: {
    limit: '50mb'
  },
  urlencoded: {
    limit: '50mb',
    extended: true
  }
};

// =====> MongoURI
const {user, pwd, host, port, db} = {
  user: 'admin',
  pwd: 'qaz12345',
  host: 'localhost',
  port: '27017',
  db: 'leab'
};

export const MongoOpts = {
  useNewUrlParser: true,
  useFindAndModify: false
};

export const MongoURI = `mongodb://${user}:${pwd}@${host}${port ? `:${port}` : ''}/${db}`;





//
