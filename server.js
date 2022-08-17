const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');
const cors = require("cors");




const PORT = process.env.PORT || 3001;
const app = express();

// // LOCAL
// app.use(cors());

// DEPLOYED
// app.use(cors({
//   origin:"https://glittery-hotteok-47aca0.netlify.app/existing"
// }))

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'https://glittery-hotteok-47aca0.netlify.app/'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
