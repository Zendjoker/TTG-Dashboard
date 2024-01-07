const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const app = express(); 



// User registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Hash the password before saving it in the database
    const saltRounds = 10; // You can adjust the number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = new User({
      username,
      passwordHash: hashedPassword,
      totalBalance: 0, // Initialize TotalBalance, Profits, and Losses
      profits: 0,
      losses: 0,
      role: 'user', // Set the role to 'user' by default
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully' });
    // After successful registration, add the following line to redirect to the login page
    res.redirect('/auth/login'); // Change the route path as needed
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // At this point, user is logged in and you can access their user object
      // which contains all user information
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

// User logout
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logout successful' });
});

// GET username by user ID
router.get('/user/:userId/username', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by their user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract and return the username from the user object
    const username = user.username;

    return res.status(200).json({ username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// GET total balance for a user by user ID
router.get('/user/:userId/total-balance', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by their user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract and return the total balance from the user object
    const totalBalance = user.totalBalance;

    return res.status(200).json({ totalBalance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET profits for a user by user ID
router.get('/user/:userId/profits', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by their user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract and return the profits from the user object
    const profits = user.profits;

    return res.status(200).json({ profits });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// GET user bio by user ID
router.get('/user/:userId/bio', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by their user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract and return the user's bio from the user object
    const bio = user.bio;

    return res.status(200).json({ bio });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET losses for a user by user ID
router.get('/user/:userId/losses', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by their user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract and return the losses from the user object
    const losses = user.losses;

    return res.status(200).json({ losses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Define a route to fetch user profile data by user ID
router.get('/:userId/profile', async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user profile data as JSON response
    res.json({
      username: user.username,
      profilePicUrl: user.profilePicUrl,
      bio: user.bio,
      totalBalance: user.totalBalance,
      profits: user.profits,
      losses: user.losses,
      role: user.role,
      // Add other user profile data fields as needed
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

 // Route to get user ID by username
router.get('/getUserId/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user's ID
    res.json({ userId: user._id });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});




module.exports = router;
