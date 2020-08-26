// Route for the banner that contains tag line and photo of the owner

const express = require('express');
const router = express.Router();
const bannerDb = require('../models/bannerModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: "./public/static/media/",
    filename: function(req, file, cb){
        cb(null,"bannerImage" + ".jpg");
    }
});

const upload = multer({
    storage: storage,
}).single("myImage");

router.post("/upload", (req,res)=> {
    if(Object.keys(req.cookies).length === 0){
        res.json({success:false,message:"Login to perform this action"})
    }
    else{
        upload (req,res, (err) => {
            console.log("Request ---", req.body);
            console.log("Request file ---", req.file);//Here you get file.
            /*Now do where ever you want to do*/
            if(!err)
                res.status(200).json({"imageUploaded":true, success:true});
            else{
                res.send("error");
            }
        })
    }

});

// Get the tagLine
router.get('/', async (req,res)=>{
    try{
        const banner = await bannerDb.findOne({_id:1});
        if(!banner) {
            // Initially, insert data to tag line
            bannerDb.create({tagLine: 'Give a tagLine for yourself here', _id: 1},
                (err, doc) => {
                    res.status(200).json({tagLine: doc.tagLine,image:doc.image});
                })
        }
        else{
            res.status(200).json({tagLine:banner.tagLine,image:banner.image,bgColor:banner.bgColor,textColor:banner.textColor});
        }

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

//Post the tagline
router.put('/', async(req,res) =>{
    // if(Object.keys(req.cookies).length === 0){
    //     await res.json({success:false,message:"Login to perform this action"})
    // }

    try{
        const bannerInfo ={tagLine:req.body.tagLine}

        const banner = await bannerDb.findOneAndUpdate({_id:1},bannerInfo,{new:true});

        res.status(200).json({tagLine:banner.tagLine , success:true,message:"Details saved"});
    }

    catch (e) {
        res.status(500).json(e);
    }

});

//Change the image to true pr false
router.put('/image',async (req,res)=>{
    try{
        const imageInfo = {image:(req.body.image === 'true')};
        const banner = await bannerDb.findOneAndUpdate({_id:1},imageInfo,{new:true});
        res.status(200).json({image:banner.image,success:true});
    }
    catch (e) {
        res.status(500).json(e);
    }
});


//Change the bg color
router.put('/bgColor',async (req,res)=>{
    try{
        const bgColor = {bgColor:req.body.bgColor};
        const banner = await bannerDb.findOneAndUpdate({_id:1},bgColor,{new:true});
        res.status(200).json({bgColor:banner.bgColor,success:true});
    }
    catch (e) {
        res.status(500).json(e);
    }
});

//Change the text color
router.put('/textColor',async (req,res)=>{
    try{
        const textColor = {textColor:req.body.textColor};
        const banner = await bannerDb.findOneAndUpdate({_id:1},textColor,{new:true});
        res.status(200).json({textColor:banner.textColor,success:true});
    }
    catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;