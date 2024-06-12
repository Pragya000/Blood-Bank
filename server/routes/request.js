import {Router} from 'express';
import { createRequest } from '../controllers/request.js';

const router = Router();

router.post('/create', createRequest)

export default router;