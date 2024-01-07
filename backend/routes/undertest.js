const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const app = express(); 

// GET api/users/:userId/profile
router.get('/:userId/profile', async (req, res) => {
 try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
 } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
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
 





module.exports = router;