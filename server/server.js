import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import routes from './routes';

/* ------------------------------------------------------- */
/*                         Config
/* ------------------------------------------------------- */

// =====> Config
import * as config from './config';

const app = express();
const PORT = process.env.PORT || 3001;

/* ------------------------------------------------------- */
/*                      Middlewares
/* ------------------------------------------------------- */

// Define max size of data loaded
app.use(bodyParser.json(config.bp.json));
app.use(bodyParser.urlencoded(config.bp.urlencoded));

app.use('/', routes);

/* ------------------------------------------------------- */
/*                        Static
/* ------------------------------------------------------- */

// =====> Serve static files in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
};

/* ------------------------------------------------------- */
/*                         Listen
/* ------------------------------------------------------- */

app.listen(PORT, () => console.log(`Server is ready on localhost:${PORT}`))
