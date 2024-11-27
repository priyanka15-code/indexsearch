const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
/*     unique: true
 */  },
  PhoneNo: {
    type: String,
    required: true
  },
  tags: [String], 
  location: {
    type: { type: String, enum: ['Point'] }, 
    coordinates: { type: [Number], required: false}
  },
  description: String,
  userId: String
});


// Create indexes in the model
userSchema.index({ Email: 1 });
userSchema.index({ Name: 1, Email: 1 });
userSchema.index({ Name: 1 });
userSchema.index({ location: '2dsphere' });
/* userSchema.index({ Name: 'text', description: 'text', Email: 'text', PhoneNo: 'text' });
 */userSchema.index({ userId: 'hashed' });

const User = mongoose.model('User', userSchema);
module.exports = User;

