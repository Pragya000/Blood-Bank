import { Router } from "express";
import { createPost, getPosts } from "../controllers/post.js";

const router = Router();

router.post('/create-post', createPost)
router.get('/get-posts', getPosts)

export default router;