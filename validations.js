import Joi from 'joi'
import sanitizeHtml from 'sanitize-html'


const userSchema=Joi.object({
    username:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().required().min(4),
    bio:Joi.string(),
    profilePicture:Joi.string()
})

const updateUserSchema = Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(4),
    bio: Joi.string(),
    profilePicture: Joi.string()
});

// regex /^[0-9a-fA-F]{24}$/ ensures that the userId is a 24-character hexadecimal string, which is the format of MongoDB ObjectIds

const createPostSchema = Joi.object({
    content: Joi.string().required()
});

const sanitizeInput = (value) => {
    return sanitizeHtml(value);
};

const validateUserRegistration=(data)=>{
    if(data.username)
    data.username = sanitizeInput(data.username);
    if(data.email)
    data.email = sanitizeInput(data.email);
    if(data.password)
    data.password = sanitizeInput(data.password);
    if (data.bio)
     data.bio = sanitizeInput(data.bio);
    if (data.profilePicture) 
    data.profilePicture = sanitizeInput(data.profilePicture);

    return userSchema.validate(data);
}

const validatePost=(data)=>{
    data.content=sanitizeInput(data.content);
    return createPostSchema.validate(data);
}


export {validatePost,validateUserRegistration};