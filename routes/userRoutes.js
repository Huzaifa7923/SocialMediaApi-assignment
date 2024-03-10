import express from 'express'
const router=express.Router();
import {registerUser,loginUser,getUserDetails,updateUserDetails,deleteUser,addToFollowing,removeFromFollowing,removeFromFollower,getFollowers,getFollowing, getMyFollowingPosts} from '../controllers/userControllers.js'
import {protect}  from '../middlewares/authMiddleware.js'

router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(protect,getUserDetails).put(protect,updateUserDetails).delete(protect,deleteUser);

router.route('/:myId/followers').get(protect,getFollowers)
router.route('/:myId/following').get(protect,getFollowing)
router.route('/:myId/following/:otherId').post(protect,addToFollowing).delete(protect,removeFromFollowing)
router.route('/:myId/followers/:otherId').delete(protect,removeFromFollower);

//:myId/following/posts
router.route('/:myId/following/posts').get(protect,getMyFollowingPosts);

export default router;