import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  city: {type: String, required: true},
  postalCode: {type: String, required: true},
  streetAddress: {type: String, required: true},
  country: {type: String, required: true},
}, {
  timestamps: true,
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
