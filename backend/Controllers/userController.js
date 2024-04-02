const asyncHandler=require('express-async-handler')
const { User } = require('../Models/User')

/**--------------------------------------------
 * @desc   Get All users profile
 * @route /api/users/profile
 * @method Get
 * @access private (only admin)   
 * ------------------------------------------*/


const getAllUsers = asyncHandler(async(req,res)=>{
    const users=await User.find()
    res.status(200).json(users)
})

module.exports={getAllUsers}