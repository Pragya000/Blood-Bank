import mongoose from "mongoose";
// import UserDetails from './UserDetails.js';
// import HospitalDetails from './HospitalDetails.js';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // trim whitespace
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["User", "Hospital", "Admin"],
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
      required: true,
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "detailsModel",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

UserSchema.virtual("detailsModel").get(function () {
  return this.accountType === "User" ? "UserDetails" : "HospitalDetails";
});

const User = mongoose.model("User", UserSchema);

export default User;
