const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const session = require('express-session');
const User = require('./models/User');
const swaggerDocument = require('./swagger.yaml');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configure and initialize Passport
passport.use(
  new TwitterStrategy(
    {
      consumerKey: 'KNWouMHGOUVtYaKawaxd8m8JZ',
      consumerSecret: 'CbVZEYBiovKvsRHEkAFAAP3ci45GLRzAbT5vIRX6nnNlPSCUEd',
      callbackURL: 'http://localhost:3030/auth/twitter/callback'
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await User.findOne({ twitterId: profile.id });

        if (user) {
          // If user exists, return it
          done(null, user);
        } else {
          // If user doesn't exist, create a new user in the database
          const newUser = new User({
            name: profile.displayName,
            username: profile.username,
            profileImageUrl: profile.photos[0].value,
            twitterId: profile.id
          });

          user = await newUser.save();
          done(null, user);
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

app.use(session({ secret: 'njk8090909009', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://nanakwamedickson:bacteria1952@cluster0.hhph3e6.mongodb.net/library';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument));

// Routes
const usersRoutes = require('./routes/users');
const booksRoutes = require('./routes/books');
app.use('/users', passport.authenticate('twitter'), usersRoutes);
app.use('/books', passport.authenticate('twitter'), booksRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});