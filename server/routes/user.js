import { Router } from "express";
import { getUserDetails } from "../controllers/user.js";

const router = Router();

router.get('/user-details', getUserDetails)

export default router;