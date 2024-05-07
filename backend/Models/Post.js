const { mongoose } = require("mongoose")
const Joi=require("joi");

const PostSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200
    },
    description:{
        type: String,
        required: true,
        trim: true,
        minlength: 10,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category:{
        type: String,
        required: true,
    },
    image:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            publicId:null
        }
    },
    like:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        }
    ]
},{
    timestamps:true
})

const Post=mongoose.model('Post',PostSchema)


// Validate create post
function validateCreatePost(obj){
    const schema=Joi.object({
        title:Joi.string().trim().min(2).max(200).required(),
        description:Joi.string().trim().min(10).required(),
        category:Joi.string().trim().required(),
    })
    return schema.validate(obj)
}

// Validate update post
function validateUpdatePost(obj){
    const schema=Joi.object({
        title:Joi.string().trim().min(2).max(200),
        description:Joi.string().trim().min(10),
        category:Joi.string().trim(),
    })
    return schema.validate(obj)
}

module.exports={Post, validateCreatePost, validateUpdatePost}
