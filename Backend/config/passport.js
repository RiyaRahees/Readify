const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../model/User");

passport.use(

    new GoogleStrategy(

        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:
                "http://localhost:5000/api/auth/google/callback"
        },

        async (accessToken, refreshToken, profile, done) => {

            try {

                let user = await User.findOne({
                    email: profile.emails[0].value
                });

                if (!user) {

                    user = await User.create({

                        name: profile.displayName,

                        email: profile.emails[0].value,

                        role: "user",

                        isVerified: true

                    });

                }

                done(null, user);

            }

            catch (err) {

                done(err);

            }

        }

    )

);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {

    const user = await User.findById(id);

    done(null, user);

});