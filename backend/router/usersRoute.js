const router=require('express').Router()
const getAllUsers = require('../Controllers/userController')

// /api/users/profile 
router.route('/profile').get(getAllUsers)

module.exports=router