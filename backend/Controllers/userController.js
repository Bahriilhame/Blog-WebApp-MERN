const asyncHandler=require('express-async-handler')
const { User } = require('../Models/User')
// const ObjectId=require('mongoose')
const { ObjectId } = require('mongoose').Types;
/**--------------------------------------------
 * @desc   Get All users profile
 * @route /api/users/profile
 * @method Get
 * @access private (only admin)   
 * ------------------------------------------*/

const getAllUsersCtrl = asyncHandler(async(req,res)=>{
    const users=await User.find()
    res.status(200).json(users)
})

/**--------------------------------------------
 * @desc   Get a user profile
 * @route /api/users/profile/:id
 * @method Get
 * @access public  
 * ------------------------------------------*/

const getUserProfileCtrl=asyncHandler(async(req,res)=>{
    // const user=await User.findOne({_id:req.params.id})
    const user = await User.findOne({ _id:new ObjectId(req.params.id) });
    if(!user){
        return res.status(404).json({message:'User not found'})
    }
    res.status(200).json(user)
})

module.exports={getAllUsersCtrl,getUserProfileCtrl}

