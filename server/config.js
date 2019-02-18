/* ------------------------------------------------------------------- */
/*                              MongoDb
/* ------------------------------------------------------------------- */

const {user, pwd, host, port, db} = {
  user: 'admin',
  pwd: 'qaz12345',
  host: 'localhost',
  port: '27017',
  db: 'leab'
};

const MongoURI = `mongodb://${user}:${pwd}@${host}${port ? `:${port}` : ''}/${db}`;

/* ------------------------------------------------------------------- */
/*                               Routes
/* ------------------------------------------------------------------- */

const api = '/api';

const routes = {
  ERROR: api,
  HOME: api + '/',
  LOGIN: api + '/login',
  REGISTER: api + '/register',
  USERS: api + '/users',
  DASHBOARD: api + '/dashboard',
  MENU: api + '/menu',
  DISHES: api + '/dishes',
  DISHES_CATEGORIES: api + '/dishesCategories',
  PRODUCTS: api + '/products',
  PRODUCTS_CATEGORIES: api + '/productsCategories'
};

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

const config = {
  // =====> Port
  port: 3001,

  // ======> Api
  api,

  // =====> Routes
  routes,

  // =====> BodyParser options
  bp: {
    json: {
      limit: '50mb'
    },
    urlencoded: {
      limit: '50mb',
      extended: true
    }
  },

  // =====> Mongo options
  MongoOpts: {
    useNewUrlParser: true,
    useFindAndModify: false
  },

  // =====> Mongo URI
  MongoURI
}

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

module.exports = config;
