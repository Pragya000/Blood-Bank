import mongoose from 'mongoose';

const UserDetailsSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
});

export default mongoose.model('UserDetails', UserDetailsSchema);