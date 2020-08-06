const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const config = require('config');
const { check, validationResult } = require('express-validator');

// admin route 
//@route GET api/admin
//@desc route
//@access private  
router.get('/:id', auth, async (req, res) => {
   try {   
      const admin = await Admin.findById(req.params.id);

      if (!admin) {
         return res.status(404).json({ msg: 'not found any id' });
      }
      res.json(admin);
   } catch (err) {
      console.error(err.message);      
      res.status(500).send('Server Error');
   }
});

//@route       GET api/auth
//@desc        Test route
//@access      public

router.get('/', auth, async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
   } 
});
 
// //@route POST api/auth
// //@desc authenticate user & get token
// //@access public

router.post(
   '/',
   [
      check('email', 'Please enter a valid email').isEmail(),
      check('password', 'Password is required').exists()
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
         let user = await User.findOne({ email });
         if (!user) {
            return res
               .status(400)
               .json({ errors: [{ msg: 'Invalid credentials' }] });
         }
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
            return res.status(400).json({
               errors: [
                  {
                     msg: 'Invalid Credentials'
                  }
               ]
            });
         }

         const payload = {
            user: {
               id: user.id
            }
         };

         jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
               
            },
            (err, token) => {
               if (err) throw err;
               res.json({ token });
            }
         );
      } catch (err) {
         console.error(err.message);
         res.status(500).send('Server error');
      }
   }
);

module.exports = router;
