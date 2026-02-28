/**
 *
 * Passport config for user auth using local strategy
 * (email and password)
 *
 */

const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const prisma = require("./database"); // Reference to Prisma client
// const passport = require("passport");

/**
 *
 * Passport config below.
 *
 * */
module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await prisma.users.findUnique({ where: { email } });

          // if user does not exist
          if (!user) {
            return done(null, false, {
              message: "No user email found in our database",
            });
          }

          const isMatch = await bcrypt.compare(password, user.password_hash);
          // if password does not match
          if (!isMatch) {
            return done(null, false, { message: "Password is incorrect" });
          }
          
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
  // Keep user ID logged in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Retrieve user ID from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.users.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
