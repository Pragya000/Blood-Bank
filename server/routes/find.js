import { Router } from "express";
import { findDonors, findHospitals } from "../controllers/find.js";

const router = Router();

router.get('/donors', findDonors)
router.get('/hospitals', findHospitals)

export default router;