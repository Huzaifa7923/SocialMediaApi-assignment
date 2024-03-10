import mongoose, { Mongoose } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema=mongoose.Schema({
    id:{
        type:String,
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String,
    },
    profilePicture:{
        type:String
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'   
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'   
        }
    ]
})

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
    next();
})

const User=mongoose.model('User',userSchema)

export default User;