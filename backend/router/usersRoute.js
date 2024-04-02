const router=require('express').Router()
const {getAllUsers} = require('../Controllers/userController')
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')

// /api/users/profile 
router.route('/profile').get(verifyTokenAndAdmin,getAllUsers)

module.exports=router