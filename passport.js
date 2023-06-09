const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongodb = require('./db/connect');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (
          !profile ||
          !profile.id ||
          !profile.emails ||
          !profile.emails[0].value
        ) {
          throw new Error('Invalid profile data');
        }

        // Check if the user exists in the database
        const existingUser = await mongodb
          .getDb()
          .db('task_mgt_sys')
          .collection('users')
          .findOne({ email: profile.emails[0].value });

        if (existingUser) {
          // User already exists, return the user
          done(null, existingUser);
        } else {
          // Create a new user
          const newUser = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
            // Additional user data
          };

          const response = await mongodb
            .getDb()
            .db('task_mgt_sys')
            .collection('users')
            .insertOne(newUser);

          if (response.acknowledged) {
            done(null, newUser);
          } else {
            done(new Error('Failed to create a new user'));
          }
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
