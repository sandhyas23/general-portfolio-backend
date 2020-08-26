// Route for adding details in social media

const express = require('express');
const router = express.Router();
const socialMediaDb = require('../models/socialMediaModel');

// Get all the social media details
router.get('/', async (req,res)=>{
    try{
        const socialMedia = await socialMediaDb.find({});
        res.status(200).json({socialMedia:socialMedia});

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

// Get all the social media details with display === true
router.get('/display', async (req,res)=>{
    try{
        const socialMedia = await socialMediaDb.find({display:true});
        res.status(200).json({socialMedia:socialMedia});

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

//post values for footer
router.put('/link/:socialMediaIcon', async (req,res)=>{
    try{
        console.log("kkkkk",req.params.socialMediaIcon)
        const socialMediaIcon = req.params.socialMediaIcon;
        const socialMediaInfo = {link:req.body[socialMediaIcon]};
        const socialMedia = await socialMediaDb.findOneAndUpdate({iconName:socialMediaIcon},socialMediaInfo,{new:true});
        res.status(200).json({success:true, socialMedia:socialMedia})
    }
    catch (e) {
        res.status(500).json(e);
    }
});

//change the display for each social media icon
router.put('/display/:socialMediaIcon', async (req,res)=>{
    try{
        const socialMediaIcon = req.params.socialMediaIcon;
        //console.log("jhhhhh",(req.body[socialMediaIcon]==='true'));
        const socialMediaInfo = {display:(req.body[socialMediaIcon]==='true')};
        const socialMedia = await socialMediaDb.findOneAndUpdate({iconName:socialMediaIcon},socialMediaInfo,{new:true});
        res.status(200).json({success:true, socialMedia:socialMedia})
    }
    catch (e) {
        res.status(500).json(e);
    }
});


module.exports = router;