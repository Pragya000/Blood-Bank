// import * as crypto from "crypto";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import otpTemplate from "../utils/mailTemplates/otp.js";
import { createOtp } from "../utils/otp.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Send Otp to user
// route   POST /api/user/send-otp
// access  Public
export const sendOtp = async (req, res) => {
    console.log("/api/user/sendOtp Body......", req.body);
    const { email, type } = req.body;
  
    // Check if type is valid
    if (!type || (type !== "signup" && type !== "forgot-password")) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }
  
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
  
    const { otp, otpToken } = createOtp(email, type);
  
    // Sending OTP to the user via email
    try {
      const mailResponse = await mailSender(
        email,
        "OTP for Blood Connect",
        otpTemplate(otp, type)
      );
      console.log("Otp Email Sent Succesfully", mailResponse);
    } catch (error) {
      console.log("Could Not Send OTP Email", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  
    // set otptoken in cookie and send response
    res
      .cookie("otpToken", otpToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 5 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Otp Sent Successfully",
      });
  };