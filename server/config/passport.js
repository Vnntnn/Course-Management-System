const LocalStrategy = require("passport-local").Strategy;
const prisma = require("./database");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  // Local strategy configuration
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const normalizedEmail = email?.trim()?.toLowerCase();
          const user = await prisma.users.findUnique({ where: { email: normalizedEmail } });

          if (!user) {
            return done(null, false, {
              message: "Invalid email or password",
            });
          }

          const isMatch = await bcrypt.compare(password, user.password_hash);

          if (!isMatch) {
            return done(null, false, {
              message: "Invalid email or password",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.users.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
