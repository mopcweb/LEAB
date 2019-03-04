// =====> Use .env file
require('dotenv').config();

/* ------------------------------------------------------------------- */
/*                              MongoDb
/* ------------------------------------------------------------------- */

const {user, pwd, host, port, db, authSource} = {
  user: process.env.MONGO_USER,
  pwd: process.env.MONGO_PWD,
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  db: process.env.MONGO_DB,
  authSource: process.env.MONGO_AUTH_SOURCE
};

// =====> Build mongoURI
const MongoURI = `mongodb://${user}:${pwd}@${host}${port ? `:${port}` : ''}/${db}?authSource=${authSource}`;

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
  LANGS: api + '/langs',
  DASHBOARD: api + '/dashboard',
  MENU: api + '/menu',
  DISHES: api + '/dishes',
  DISHES_CATEGORIES: api + '/dishesCategories',
  PRODUCTS: api + '/products',
  PRODUCTS_CATEGORIES: api + '/productsCategories',

  AUTH: api + '/auth',
};

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

const config = {
  // ======> Api
  api,

  // =====> Routes
  routes,

  // =====> Mongo URI
  MongoURI,

  // =====> Mongo options
  MongoOpts: {
    useNewUrlParser: true,
    useFindAndModify: false,
    keepAlive: 1,
    connectTimeoutMS: 30000,
    reconnectTries: 30,
    reconnectInterval: 5000
  },

  // =====> Port
  port: process.env.PORT,

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

  // =====> Firebase Admin SDK
  databaseURL: process.env.FB_DATABASE_URL

};

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

module.exports = config;
