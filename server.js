const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const session = require('express-session');
const User = require('./models/User');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configure and initialize Passport
passport.use(
  new TwitterStrategy(
    {
      consumerKey: '<your_consumer_key>',
      consumerSecret: '<your_consumer_secret>',
      callbackURL: '<your_callback_url>'
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
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://nanakwamedickson:bacteria1952@cluster0.hhph3e6.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Swagger API documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'API endpoints for managing books and users in a library',
    },
    security: [
      {
        TwitterAuth: []
      }
    ],
  },
  apis: ['./routes/users.js', './routes/books.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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