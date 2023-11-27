import { Router } from "express";
import limiter from "../utils/apiRateLimiter.js";
import { login, sendOtp, signUp, logout } from "../controllers/auth.js";

const router = Router();

router.post("/send-otp", limiter, sendOtp);
router.post("/signup", signUp);
router.post("/login", login)
router.post("/logout", logout);

export default router;