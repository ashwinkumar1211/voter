const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   id: {
      type: String,
      required: true,
      unique: true  
   }   
});
module.exports = Admin = mongoose.model('Admin', AdminSchema);