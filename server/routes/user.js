import { Router } from "express";
import { createUserDetails, getUserDetails } from "../controllers/user.js";

const router = Router();

router.get('/user-details', getUserDetails)
router.post('/create-user-details', createUserDetails)

export default router;