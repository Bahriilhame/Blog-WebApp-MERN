const router=require('express').Router()
const {getAllUsersCtrl , getUserProfileCtrl} = require('../Controllers/userController')
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')

// /api/users/profile 
router.route('/profile').get(verifyTokenAndAdmin,getAllUsersCtrl)

// /api/users/profile/:id
router.route('/profile/:id').get(getUserProfileCtrl)

module.exports=router