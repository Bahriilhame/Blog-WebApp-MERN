const asyncHandler=require('express-async-handler')
const { User, validateUpdateUser } = require('../Models/User')
const { ObjectId } = require('mongoose').Types;
const bcrypt=require('bcryptjs')

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

module.exports={getAllUsersCtrl,getUserProfileCtrl,updateUserProfileCtrl,getUsersCountCtrl}

