import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import Post from "../models/postModel.js";
import {validateUserRegistration} from '../validations.js'

//creating a token
const generateToken=(id)=>{
         const token=jwt.sign({id},process.env.JWT_SECRET,{
            expiresIn:'30d'
        })
        return token;
}



// Register User
const registerUser=async(req,res)=>{
    try{

        const {error}=validateUserRegistration(req.body);
        if(error){
            return res.status(400).json({ error });
        }
       const {username,email,password,bio,profilePicture}=req.body;

    if(!username||!email||!password){
        return res.status(400).json({message:'Fields are still empty '});
    }
    const existedUser=await User.findOne({email});

    if(existedUser){
        return res.status(400).json({message:'email is already registered! Try with different email'})
    }
    const user=await User.create({
        id:uuidv4(),
        username,
        email,password,
        bio
        ,profilePicture
    })

    if(user){
        return res.status(201).json({
            id:user.id,
            email:user.email,
            token:generateToken(user._id)
        })
    }
}catch(err){
    console.log('error aagya , in catch block'+err);
    res.status(500).json({ error: err});
}
}

const loginUser=async(req,res)=>{
    try{
    const {email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({message:'Fields are still empty '});
    }
    const user=await User.findOne({email});
    // console.log(user)
    if(!user){
        return res.status(400).json({message:'No user with this email exist'});
    }

    const mp=await user.matchPassword(password);

    if(mp){
            return res.status(200).json({
                id:user.id,
                email:user.email,
                token:generateToken(user._id)
            })
    }else{
        return res.status(400).json({message:'Incorrect password'});   
    }
}catch(err){
    console.log(err);
    res.status(500).json({ error:err });
}
}


const getUserDetails=async(req,res)=>{
    try{
    if(!req.user){
        return res.status(400).json({message:'Login required!!'});
    }
    res.status(200).json({
        username:req.user.username,
        email:req.user.email,
        bio:req.user.bio,
        profilePicture:req.user.profilePicture
    })
}catch(err){
    console.log(err);
    res.status(500).json({ error: err });
}
}
const updateUserDetails=async(req,res)=>{
    try{
        const {error}=validateUserRegistration(req.body);
        if(error){
            return res.status(400).json({ error });
        }

        const {username,email,password,bio,profilePicture}=req.body;
        const oldUser=await User.findById(req.user._id);

        // console.log(oldUser);

        oldUser.username=username||oldUser.username
        oldUser.email=email||oldUser.email
        oldUser.password=password||oldUser.password
        oldUser.bio=bio||oldUser.bio
        oldUser.profilePicture=profilePicture||oldUser.profilePicture
 
        await oldUser.save();
        console.log(oldUser);

        res.status(200).json({message:'updated successfully'})

    }catch(err){
        console.log(err);
        res.status(500).json({ error: err});
    }
}
const deleteUser=async(req,res)=>{
    try{
        const user=User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message:'user not found '});
        }
        await User.findByIdAndDelete(req.user._id);

        return res.status(200).json({message:'Deleted successsfully'});

    }catch(err){
        console.log(err);
        res.status(500).json({ error: err});
    }
}

const removeFromFollower=async(req,res)=>{
    const {myId,otherId}=req.params;

    try{

        const user1=await User.findByIdAndUpdate(myId,{$addToSet:{followers:otherId}})
        const user2=await User.findByIdAndUpdate(otherId,{$addToSet:{following:myId}})

        if(!user1||!user2){
            return res.status(404).json({message:'user not found '});
        }

        res.status(200).json({message:'User removed from follower successfully!!'});

    }catch(err){
        console.error('Error occurred:', err);
        res.status(500).json({ error: err});
    }
}

const addToFollowing=async(req,res)=>{
    const {myId,otherId}=req.params;

    try{
        const user1=await User.findByIdAndUpdate(myId,{$addToSet:{following:otherId}})
        const user2=await User.findByIdAndUpdate(otherId,{$addToSet:{followers:myId}})

        if(!user1||!user2){
            return res.status(404).json({message:'user not found '});
        }

        res.status(200).json({message:'User followed successfully'});

    }catch(err){
        console.error('Error occurred:', err);
        res.status(500).json({ error:err});
    }
}

const removeFromFollowing=async(req,res)=>{
const {myId,otherId}=req.params;

try{
    const user1=await User.findByIdAndUpdate(myId,{$pull:{following:otherId}})
    const user2=await User.findByIdAndUpdate(otherId,{$pull:{followers:myId}})
        if(!user1||!user2){
            return res.status(404).json({message:'user not found '});
        }
    res.status(200).json({message:'User unfollowed successfully'});

}catch(err){
    console.error('Error occurred:', err);
    res.status(500).json({ error: err});
}
}

const getFollowers=async(req,res)=>{
    const { myId } = req.params;

    try {
        const user = await User.findById(myId).populate({
            path:'followers',
            select:'username email bio profilePicture'
        });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const followers = user.followers;

        res.status(200).json({ followers });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error:error});
    }
};

const getFollowing=async(req,res)=>{
    const { myId } = req.params;

    try {
        const user = await User.findById(myId).populate({
            path:'following',
            select:'username email bio profilePicture'
        });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const following = user.following;

        res.status(200).json({ following });
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: error });
    }
}


//:myId/following/posts
const getMyFollowingPosts=async(req,res)=>{
    try{
        if(!req.user){
            return res.status(404).json({ message: 'User not found' });
        }
        const following=req.user.following;

        const postByFollowing=await Post.find({user:{$in:following}}).populate({
            path:'user',
            select:'username'
        }).sort({createdAt:-1});

        res.status(200).json({postByFollowing});

    }catch(err){
        console.error('Error:', err);
        res.status(500).json({ error: err });
    }
}
//:myId/following/:followingUserId/posts

export {registerUser,loginUser,getUserDetails,updateUserDetails,deleteUser,removeFromFollower,removeFromFollowing,addToFollowing,getFollowers,getFollowing,getMyFollowingPosts};