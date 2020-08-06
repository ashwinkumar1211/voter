const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/Admin');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
//@route       POST api/admin
//@desc        Register Users
//@access      public

router.post(
   '/',
   [
      check('name', 'Name is required')
         .not()
         .isEmpty(),
      check('id', 'Please enter a unique id')   
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { name, id } = req.body;
      try {const { check, validationResult } = require('express-validator');

         //See if admin exists (precheck)
         let admin = await Admin.findOne({ id });
         if (admin) {
            res.status(400).json({ errors: [{ msg: 'admin already exists' }] });
         }        
         admin = new Admin({
            name,
            id                   
         });
         await admin.save();
         res.send('Admin Added');
      } catch (err) {
         console.error(err.message);
         res.status(500).send('Server error');
      }
   }
);

module.exports = router;
