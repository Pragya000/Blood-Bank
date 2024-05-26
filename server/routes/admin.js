import { Router } from "express";
import { getHospitalsList, populateUser } from "../controllers/admin.js";

const router = Router();

router.get('/get-hospitals-list', getHospitalsList)
router.post('/populate-user', populateUser)

export default router;