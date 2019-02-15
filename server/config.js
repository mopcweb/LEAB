// =====> MongoURI
const {user, pwd, host, port, db} = {
  user: 'admin',
  pwd: 'qaz12345',
  host: 'localhost',
  port: '27017',
  db: 'leab'
};

const MongoURI = `mongodb://${user}:${pwd}@${host}${port ? `:${port}` : ''}/${db}`;

/* ------------------------------------------------------- */
/*                         Config
/* ------------------------------------------------------- */

const config = {
  // =====> Port
  port: 3001,
  
  // ======> Api
  api: '/api',

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

/* ------------------------------------------------------- */
/*                         Config
/* ------------------------------------------------------- */

module.exports = config;
