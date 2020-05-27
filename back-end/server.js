if (process.env.NODE_ENV != 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const mysql = require('mysql')
const https = require('https');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

/* Database connection setup */
var connection = mysql.createConnection({
  host: process.env.DATABASE_URL,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
})
connection.connect(function(err) {
  if (err) console.log("Cannot connect to database");
  else console.log("Connected to database");
});

exports.connection = connection;

app.use(express.json());
app.use(fileUpload({
  createParentPath: true
}));
app.use(cors());
app.use(bodyParser.json());

/* Routes config */
const adminRouter = require('./routes/Admin');
const ActualTotalLoadRouter = require('./routes/ActualTotalLoad');
const ActualvsForecastRouter = require('./routes/ActualvsForecast');
const AggregatedGenerationPerTypeRouter = require('./routes/AggregatedGenerationPerType');
const DayAheadTotalLoadForecastRouter = require('./routes/DayAheadTotalLoadForecast');
const Base = require('./routes/Base');

app.use('/energy/api/Admin', adminRouter);
app.use('/energy/api/ActualTotalLoad', ActualTotalLoadRouter);
app.use('/energy/api/ActualvsForecast', ActualvsForecastRouter);
app.use('/energy/api/AggregatedGenerationPerType', AggregatedGenerationPerTypeRouter);
app.use('/energy/api/DayAheadTotalLoadForecast', DayAheadTotalLoadForecastRouter);
app.use('/energy/api/', Base);
app.get('/*', (req, res, next) => {
  res.sendStatus(400);
})

/* Create https server */
https.createServer({
  key: fs.readFileSync('sslcert/key.pem'),
  cert: fs.readFileSync('sslcert/cert.pem'),
  passphrase: process.env.HTTPS_SERVER_PASSPHRASE
}, app).listen(8765, () => { console.log('Connected to https server') });
