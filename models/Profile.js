const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({   
   no_of_votes :{
       type: Number,       
   },
   no_of_challenges: {
      type: String,
      required: true,
   },     
   expert_in :                       
                  {
                  skill: {
                      type: [String]
                  },
                  rating: {
                        type: [Number]
                  }
                }                       
});

module.exports = Profile = mongoose.model('Profile', ProfileSchema);
