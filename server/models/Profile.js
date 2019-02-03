import mongoose, { Schema } from 'mongoose'

const ProfileSchema = new Schema(
  {
    name: String,
    email: String,
    pass: String,
    img: Buffer
  },
  {
    timestamps: true
  }
);

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile
