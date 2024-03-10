import express from 'express'
const router=express.Router();

import {protect}  from '../middlewares/authMiddleware.js'
import {getPost,updatePost,createPost,deletePost, getRecentsPosts} from '../controllers/postControllers.js'

router.route('/')
    .get(getRecentsPosts)
    .post(protect,createPost);

router.route('/:id')
    .get(protect,getPost)
    .put(protect,updatePost)
    .delete(protect,deletePost);


export default router;