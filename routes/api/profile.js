const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const user = require('../../models/User');
const { check, validationResult } = require('express-validator');

//@route       Get api/profile/me
//@desc        Get current user profile
//@access      Private 

router.get('/me', auth, async (req, res) => {
   try {
      const profile = await Profile.findOne({
         user: req.user.id
      }).populate('user', ['name']);
      if (!profile) {
         return res
            .status(400)
            .json({ msg: 'There is no profile for this user' });
      }
      res.json(profile);
   } catch (err) {
      Console.log(err.message);
      res.status(500).send('Server Error');
   }
});
 
//@route       Get api/profile/
//@desc        update profile
//@access      Private 

router.post(
   '/',
   [
      auth,
      [
         check('no_of_challenges', 'no_of_challenges is required')
            .not()
            .isEmpty(),
         check('expert_in', 'expert_in is required')
            .not()
            .isEmpty()
      ]                    
   ],
   async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const {
         no_of_challenges,
         skill,
         rating             
      } = req.body;
      const profileFields = {};
      profileFields.user = req.user.id;
      if (no_of_challenges) profileFields.no_of_challenges = no_of_challenges;      
      profileFields.skill = skill.split(',').map(skill => skill.trim());
      profileFields.rating = rating.value.split(',').map(rating => rating.trim());

       
      console.log(profileFields.skill);
      console.log(profileFields.rating);
      //build social object
     
      try {
         let profile = await Profile.findOne({ user: req.user.id });
         if (profile) {
            //update the profile
            Profile = await Profile.findOneAndUpdate(
               { user: req.user.id },
               { $set: profileFields },
               { new: true }
            );
            return res.json(profile);
         }
         //create
         profile = new Profile(profileFields);
         await profile.save();
         res.json(profile);
      } catch (err) {
         console.error(err.message);
         res.status(500).send('Server Error');
      }
   }
);

//@route Get api/profile
//@desc Get all profiles and no of votes
//@access public
router.get('/', async (req, res) => {
   try {
      const profiles = await Profile.find().populate('user', [
         'name',
         'no_of_votes'         
      ]);
      res.json(profiles);
   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
   }
});

//@route Get api/profile/user/:userid
//@desc Get profile by user id
//@access public
 
router.get('/user/:user_id', async (req, res) => {
   try {
      const profile = await Profile.findOne({
         user: req.params.user_id
      }).populate('user', ['name', 'no_of_votes']);
      if (!profile) return res.status(400).json({ msg: 'profile not found' });
      res.json(profile);
   } catch (err) {
      console.error(err.message);
      if (err.kind == 'ObjectId') {
         return res.status(400).send('profile not found');
      }
      res.status(500).send('server error');
   }
});

//to delete profile

//@route Get api/profile
//@desc delete profile, user & posts
//@access private(auth middleware) admin 

router.delete('/', auth, async (req, res) => {
   try {
      // remove users posts
      await this.post.deleteMany({user: req.user.id});
      //Remove profile
      await Profile.findOneAndRemove({ user: req.user.id });
      //Remove user -- _id - default
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ msg: 'user removed' });
   } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
   }
});

module.exports = router;
