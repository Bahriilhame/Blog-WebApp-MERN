const asyncHandler=require('express-async-handler')
const bcrypt=require('bcryptjs')
const {User,validateRegisterUser,validateLoginUser}=require('../Models/User')

/**--------------------------------------------
 * @desc   Register New User
 * @route /api/auth/register
 * @method POST
 * @access public   
 * ------------------------------------------*/

module.exports.registerUserCtrl=asyncHandler(async (req,res)=>{
    // Validation
    const {error}=validateRegisterUser(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }

    // is user already exists
    let user=await User.findOne({email:req.body.email})
    if(user){
        return res.status(400).json({message:'User already exists'})
    }

    // hash the password
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(req.body.password,salt) 

    // new user and save it to DB
    user=new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword,
    })
    await user.save()

    // send a response to client
    res.status(201).json({message:"You registred successfuly, please log in"})
})


/**--------------------------------------------
 * @desc   Login User
 * @route /api/auth/login
 * @method POST
 * @access public   
 * ------------------------------------------*/

module.exports.loginUserCtrl=asyncHandler(async (req,res)=>{
    // Validation
    const {error}=await validateLoginUser(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }

    // Check if user exist
    const user=await User.findOne({email:req.body.email})
    if(!user){
        res.status(400).json({message:"Invalid email or password"})
    }

    // Check password
    const isPasswordMatch=bcrypt.compare(req.body.password)
    if(!isPasswordMatch){
        res.status(400).json({message:"Invalid email or password"})
    }

    // generate token (jwt)
    const token=user.generateAuthToken()

    // response to client
    res.status(200).json({
        _id:user._id,
        isAdmin:user.isAdmin,
        profilePhoto:user.profilePhoto,
        token
    })
})