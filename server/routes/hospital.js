import { Router } from "express";
import { createHospitalDetails } from "../controllers/hospital.js";

const router = Router();

router.post('/create-hospital-details', createHospitalDetails)

export default router;