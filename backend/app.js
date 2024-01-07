const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose once
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const cors = require('cors');

const app = express();

// Load environment variables from a .env file or your hosting platform
require('dotenv').config();

// Connect to MongoDB using the MONGODB_URI from your environment variables
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB!');
    // Define and use your routes here
    // ...
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for React frontend

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Configuration
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Connect flash for flash messages
app.use(flash());

// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
