import { Router } from "express";
import limiter from "../utils/apiRateLimiter.js";
import { sendOtp } from "../controllers/auth.js";

const router = Router();

router.post("/send-otp", limiter, sendOtp);
export default router;
