const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');

/* ------------------------------------------------------- */
/*                         Config
/* ------------------------------------------------------- */

// =====> Config
const { bp, port } = require('./config');

const app = express();
const PORT = process.env.PORT || port;

/* ------------------------------------------------------- */
/*                      Middlewares
/* ------------------------------------------------------- */

// Define max size of data loaded
app.use(bodyParser.json(bp.json));
app.use(bodyParser.urlencoded(bp.urlencoded));

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
