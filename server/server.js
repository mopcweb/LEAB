import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Define max size of data loaded
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/', routes)

// Connect mongo
mongoose.connect('mongodb://localhost/leab', { useNewUrlParser: true });

// Get data for products
app.get('/getdata', (req ,res) => {
  const data = req.headers.data
  res.sendFile(path.join(__dirname, 'data', `${data}.json`))
})

// Serve static files from build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
};

app.listen(PORT, () => console.log(`Server is ready on localhost:${PORT}`))
