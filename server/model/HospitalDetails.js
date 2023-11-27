import mongoose from 'mongoose';

const HospitalDetailsSchema = new mongoose.Schema({
    hospitalName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    contact: String,
});

export default mongoose.model('HospitalDetails', HospitalDetailsSchema);