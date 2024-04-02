const jwt=require('jsonwebtoken')

// Verify Token
function verifyToken(req,res,next){
    const authToken=req.headers.authorization
    console.log(authToken);
    if(authToken){
        const token=authToken.split(' ')[1]
        try{
            const decodedPayload=jwt.verify(token,process.env.JWT_SECRET)
            req.user=decodedPayload
            next()
        }catch(error){
            return res.status(401).json({message:'Invalid Token, access denied'})
        }
    }else{
        return res.status(401).json({message:'No Token provided, access denied'})
    }
} 

// verify Token & Admin
function verifyTokenAndAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next() 
        }else{
            return res.status(403).json({message:'Not Allowed'})
        }
    })
}

module.exports={verifyTokenAndAdmin}