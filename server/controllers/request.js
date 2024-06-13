/* eslint-disable no-undef */
import User from "../model/User.js";
import Post from "../model/Post.js";
import Request from "../model/Request.js";
import mongoose from "mongoose";
import { isCompatible } from "../../src/data/compatibility.js";
import { decryptData } from "../utils/decodeEncode.js";
const MONGO_FIELD_KEY = process.env.MONGO_FIELD_ENCRYPTION_SECRET;

// @desc    Create a Request
// @route   POST /api/request/create
// @access  Private
export const createRequest = async (req, res) => {
    try {
        const user = req.user;

        if (user?.approvalStatus !== 'Approved') {
            return res.status(400).json({ message: "You are not approved" });
        }

        if (user?.accountType !== 'User') {
            return res.status(400).json({ message: "Only User can create request" });
        }

        const { post, requestee, additionalInfo } = req.body;

        if (post && mongoose.Types.ObjectId.isValid(post)) {

            if (user?.accountType !== 'User') {
                return res.status(400).json({ message: "Only User can create request" });
            }

            const postObj = await Post.findById(post).populate('user');

            if (!postObj) {
                return res.status(400).json({ message: "Post not found" });
            }

            if (postObj.requestStatus !== 'Pending' && postObj.user?.accountType !== 'Hospital') {
                return res.status(400).json({ message: "Post is not valid" });
            }

            if (postObj.user._id.toString() === user._id.toString()) {
                return res.status(400).json({ message: "You can't request yourself" });
            }

            if (postObj.users.includes(user._id)) {
                return res.status(400).json({ message: "You have already requested" });
            }

            const donorBloodGroup = `${decryptData(user?.additionalFields?.bloodType, MONGO_FIELD_KEY)}${decryptData(user?.additionalFields?.rhFactor, MONGO_FIELD_KEY) === 'Positive' ? '+' : '-'}`
            const recipientBloodGroup = `${decryptData(postObj?.user?.additionalFields?.bloodType, MONGO_FIELD_KEY)}${decryptData(postObj?.user?.additionalFields?.rhFactor, MONGO_FIELD_KEY) === 'Positive' ? '+' : '-'}`
            const compatible = isCompatible(donorBloodGroup, recipientBloodGroup);

            if (!compatible) {
                return res.status(400).json({ message: "Blood group is not compatible" });
            }

            // requestee is recipient
            // requester is donor
            const payload = {
                requestee: post?.user?._id,
                requester: user?._id,
                post: postObj._id,
                requestType: 'Post'
            }

            await Request.create(payload);
            postObj.users.push(user?._id);
            await postObj.save();

            return res.status(201).json({ success: true, message: "Request created successfully" });
        }

        if (!requestee && !mongoose.Types.ObjectId.isValid(requestee)) {
            return res.status(400).json({ message: "Invalid requestee" });
        }

        const requesteeUser = await User.findById(requestee);

        if (!requesteeUser) {
            return res.status(400).json({ message: "Requestee not found" });
        }

        // requestee is donor
        // requester is recipient
        let payload = {
            requestee,
            requester: user._id,
        }

        if (requesteeUser.accountType === 'User') {

            const donorBloodGroup = `${decryptData(requesteeUser?.additionalFields?.bloodType, MONGO_FIELD_KEY)}${decryptData(requesteeUser?.additionalFields?.rhFactor, MONGO_FIELD_KEY) === 'Positive' ? '+' : '-'}`
            const recipientBloodGroup = `${decryptData(user?.additionalFields?.bloodType, MONGO_FIELD_KEY)}${decryptData(user?.additionalFields?.rhFactor, MONGO_FIELD_KEY) === 'Positive' ? '+' : '-'}`
            const compatible = isCompatible(donorBloodGroup, recipientBloodGroup);

            if (!compatible) {
                return res.status(400).json({ message: "Blood group is not compatible" });
            }

            payload['requestType'] = 'User';
        }

        if (requesteeUser.accountType === 'Hospital') {
            payload['requestType'] = 'Hospital';
        }

        if (additionalInfo) {
            payload['additionalInfo'] = additionalInfo;
        }

        await Request.create(payload);
        await User.findByIdAndUpdate(user._id, {
            $push: {
                requestedByMe:
                    new mongoose.Types.ObjectId(requestee)
            }
        });

        return res.status(201).json({ success: true, message: "Request created successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}