const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { checkApiKey } = require('./middlewares/auth.handler');

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');

const app = express();
const port = process.env.PORT || 3002;
app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({limit: '500mb', extended: true }));

const whitelist = [
  'http://localhost:3000',
  'https://localhost:3001',
  'http://localhost:3002',
  'https://localhost:3003',
];

const options = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(options));

require('./utils/auth');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/nueva-ruta', checkApiKey, (req, res) => {
  res.send('Nueva ruta');
});

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log('listening on port', port);
});
