const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const mongodb = require('./db/connect');
const port = process.env.PORT || 3000;

// Passport config
require('./passport');

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })



  // Passport middleware
  .use(passport.initialize())
  .use(passport.session())


  // Routes
  .use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
    });
  }
});
