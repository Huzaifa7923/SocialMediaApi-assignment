import redisClient from "../config/redisClient.js";
import Post from "../models/postModel.js";
import {validatePost} from '../validations.js'

// controller to get recent posts.
const getRecentsPosts=async(req,res)=>{
    try{
        const cachedData=await redisClient.get('allPosts');
        if(cachedData){
            return res.status(200).json({posts:JSON.parse(cachedData)});
        }
    const posts=await Post.find().populate({
        path:'user',
        select:'username email'
    }).sort({createdAt:-1});

    await redisClient.setEx('allPosts',300,JSON.stringify(posts));
    res.status(200).json({posts:posts});

    }catch(err){
        console.log(err);
        res.status(500).json({error:err})
    }
}

// PORT for redis : 6379
// const getOlderPosts=async(req,res)=>{
//     try{
//     const posts=await Post.find().sort({createdAt:1});
//     res.status(200).json({posts:posts});
//     }catch(err){
//         res.status(500).json({error:err})
//     }
// }


// controller to get post by Id.

const getPost=async(req,res)=>{
    try{
        const cachedData=await redisClient.get(req.params.id)
        if(cachedData){
            return res.status(200).json({
                post:JSON.parse(cachedData)
            })
        }

        const post=await Post.findById(req.params.id).populate({
            path:'user',
            select:'username email'
        })

        if(!post){
            return res.status(200).json({message:'No such post exists!'});
        }
        await redisClient.setEx(req.params.id, 120, JSON.stringify(post));

        res.status(201).json({post});
    }catch(err){
        res.status(500).json({error:err})
    }
}

const createPost=async(req,res)=>{
    try{
        const {error}=validatePost(req.body)
        if(error){
            return res.status(400).json({error });
        }
        const {content}=req.body;
        if(!content){
                return res.status(404).json({message:'content missing!'});
        }
        const post=await Post.create({
            user:req.user._id,
            content:content
        })
        res.status(200).json({post});
    }catch(err){
        res.status(500).json({error:err})
    }
}

const updatePost=async(req,res)=>{
    try{
        const cachedData=await redisClient.get(req.params.id)
        console.log('cachedData '+cachedData)
        if(cachedData){
            await redisClient.del('allPosts')
            await redisClient.del(req.params.id)
        }
        const post=await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({message:'No such post exists!'});
        }
        const {error}=validatePost(req.body)

        if(error){
            return res.status(400).json({error });
        }
        const {content}=req.body;
        post.content=content;

        await post.save();
        await redisClient.set(req.params.id, JSON.stringify(post));

        res.status(200).json({post});

    }catch(err){
        res.status(500).json({error:err})
    }
}

const deletePost=async(req,res)=>{
    try{
        const cachedData=await redisClient.get(req.params.id)
        await redisClient.del('allPosts')
        if(cachedData){
            await redisClient.del(req.params.id)
        }
            await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({message:'Post deleted successfully!'})
    }catch(err){
        res.status(500).json({error:err})
    }
}

export {getRecentsPosts,getPost,updatePost,createPost,deletePost}