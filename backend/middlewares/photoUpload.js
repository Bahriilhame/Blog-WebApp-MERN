const multer=require('multer');
const path=require('path');

const photoStorage=multer.diskStorage({
    destination:function(req, res, cb){
        cb(null, path.join(__dirname,"../images"));
    },
    filename:function(req, file, cb){    
        if(file){
            cb(null, new Date().toISOString().replace(/:/g,'-') +file.originalname);
        }
        else{
            cb(null, false);
        }
    }
})

// Photo upload middleware
const photoUpload=multer({
    storage:photoStorage,
    fileFilter:function(req,file,cb){
        if(file.mimetype.startsWith('image')){
            cb(null, true);
        }else{
            cb({message:"Unspported file format"},false);
        }
    },
    limits:{ fileSize:1024*1024 } //1 Megabyte
})

module.exports=photoUpload;