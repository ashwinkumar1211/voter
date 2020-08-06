const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
//@route       POST api/users/:userid(to vote)
//@desc        Register Users
//@access      public

router.post(
   '/',
   auth,
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.body;
      try {
         //See if user exists (precheck)
         let user = await User.findOne({ id });
         user.no_of_votes =  user.no_of_votes+1;
         await user.save();   
       } catch (err) {
         console.error(err.message);
         res.status(500).send('Server error');
      }
   }
);

module.exports = router;
