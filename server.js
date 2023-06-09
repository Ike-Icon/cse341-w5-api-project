const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const app = express();
const exphbs = require('express-handlebars');
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

  // Set the view engine
  .engine('.hbs', exphbs.create({ defaultLayout: 'main', extname: '.hbs' }).engine)
  .set('view engine', '.hbs')

  // Sessions
  .use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false
    })
  )

  // Passport middleware
  .use(passport.initialize())
  .use(passport.session())

  // Static folder
  .use(express.static(path.join(__dirname, 'public')))

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
