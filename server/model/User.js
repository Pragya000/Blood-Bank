import mongoose from 'mongoose';
import UserDetails from './UserDetails';
import HospitalDetails from './HospitalDetails';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, // trim whitespace
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    accountType: ['User', 'Hospital', 'Admin'],
    accountDetails: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'accountType'
    }
})

// Set up discriminators
UserSchema.path('accountDetails').discriminator('User', UserDetails);
UserSchema.path('accountDetails').discriminator('Hospital', HospitalDetails);

export default mongoose.model('User', UserSchema);