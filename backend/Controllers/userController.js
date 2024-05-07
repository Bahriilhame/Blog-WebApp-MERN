const asyncHandler=require('express-async-handler')
const { User, validateUpdateUser } = require('../Models/User')
const { ObjectId } = require('mongoose').Types;
const bcrypt=require('bcryptjs')
const path=require('path')  
const fs=require('fs')
const {cloudinaryRemoveImage,cloudinaryUploadImage}=require('../Utils/Cloudinary')

/**--------------------------------------------
 * @desc   Get All users profile
 * @route /api/users/profile
 * @method Get
 * @access private (only admin)   
 * ------------------------------------------*/

const getAllUsersCtrl = asyncHandler(async(req,res)=>{
    const users=await User.find().select('-password')
    res.status(200).json(users)
})

/**--------------------------------------------
 * @desc   Get a user profile
 * @route /api/users/profile/:id
 * @method Get
 * @access public  
 * ------------------------------------------*/

const getUserProfileCtrl=asyncHandler(async(req,res)=>{
    const user = await User.findOne({ _id:new ObjectId(req.params.id)}).select('-password');
    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    res.status(200).json(user)
})

/**--------------------------------------------
 * @desc   Update a user profile
 * @route /api/users/profile/:id
 * @method Update
 * @access private (only user)  
 * ------------------------------------------*/

const updateUserProfileCtrl=asyncHandler(async(req,res)=>{
    // Validate 
    const {error}= validateUpdateUser(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }

    // Hash password if updated
    if(req.body.password){
        const salt=await bcrypt.genSalt(10)
        req.body.password=await bcrypt.hash(req.body.password,salt)
    } 

    // Update User
    const userUpdated=await User.findByIdAndUpdate(req.params.id,{
        $set:{
            username:req.body.username,
            password:req.body.password,
            bio:req.body.bio
        }
    },{new:true}).select('-password')

    if(!userUpdated){
        res.status(400).json({message:"User not found"})
    }

    res.status(200).json(userUpdated)
})

/**--------------------------------------------
 * @desc   Get users count
 * @route /api/users/count
 * @method Get
 * @access private (only admin)  
 * ------------------------------------------*/

const getUsersCountCtrl=asyncHandler(async (req,res)=>{
    const usersCount=await User.find().countDocuments()
    res.status(200).json(usersCount)
})

/**--------------------------------------------
 * @desc   Profile photo upload
 * @route /api/users/profile/profile-photo-upload
 * @method POST
 * @access private (only logged in users)   
 * ------------------------------------------*/

const profilePhotoUploadCtrl=asyncHandler(async (req,res)=>{
    // Validation
    if(!req.file){
        return res.status(400).json({message: 'No file uploaded'})
    }

    // Get the path to the photo
    const imagePath=path.join(__dirname,`../images/${req.file.filename}`)

    // Upload the photo to the cloudinary
    const result=await cloudinaryUploadImage(imagePath)

    // Get the user from DB
    const user=await User.findById(req.user.id)

    // Delete the old profile phot if exists    
    if(user.profilePhoto.publicId!==null){
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }

    // Change the profile photo field in the DB
    user.profilePhoto={
        url:result.secure_url,
        publicId:result.public_id
    }
    await user.save();

    // Send response to the client
    res.status(200).json({message: 'photo Uploaded successfully',
        profilePhoto:{
            url:user.profilePhoto.url,
            publicId:user.profilePhoto.publicId
        }
    });

    // Remove the photo from the server 
    fs.unlinkSync(imagePath)
})

/**--------------------------------------------
 * @desc   Delete user profile (Account)
 * @route /api/users/profile/:id
 * @method DELETE
 * @access private (only admin OR user himself)   
 * ------------------------------------------*/

const deleteUserProfileCtrl=asyncHandler(async (req,res)=>{
    // Get the user from the DB
    const user=await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    // Get all the posts from DB

    // Get the public ids from the posts
    
    // Delete all posts images from the cloudinary that belong to this user

    // Delete the profile picture from the cloudinary
    await cloudinaryRemoveImage(user.profilePhoto.publicId)

    // Delete user posts & comments
    
    // Delete the user from the DB
    await User.findByIdAndDelete(req.params.id)

    // Send response to the client
    res.status(200).json({message:"Profile deleted successfully"})

})

module.exports={getAllUsersCtrl,getUserProfileCtrl,updateUserProfileCtrl,getUsersCountCtrl,profilePhotoUploadCtrl, deleteUserProfileCtrl}

