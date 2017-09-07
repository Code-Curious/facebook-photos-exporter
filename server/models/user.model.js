// load the things we need
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
   facebook: {
      id: String,
      token: String,
      email: String,
      name: String
   },

   photos:[{
      created: {
        type: Date,
        default: Date.now
      },

      url:{
         type: String,
         trim: true
      },

      FBid: {
         type: String
      },

      name: {
         type: String
      },
      
      description: {
         type: String
      },

      albumId:{
         type: String
      },

      albumName:{
         type: String
      }
   }]

});


module.exports = mongoose.model('User', userSchema);
