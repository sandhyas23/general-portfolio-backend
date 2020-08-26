// Route for adding details in footer

const express = require('express');
const router = express.Router();
const footerDb = require('../models/footerModel');
const colorDb = require('../models/colorsModel');

// Get all the footer details
router.get('/', async (req,res)=>{
    try{
        const footer = await footerDb.find({});
        res.status(200).json({footer:footer});

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

// Get all the footer details with display== true
router.get('/display', async (req,res)=>{
    try{
        const footer = await footerDb.find({display:true});
        res.status(200).json({footer:footer});

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});
//post values for footer
router.put('/value/:footerName', async (req,res)=>{
    try{
        const footerName = req.params.footerName;
        const footerInfo = {value:req.body[footerName]};
        const footer = await footerDb.findOneAndUpdate({footerName:footerName},footerInfo,{new:true});
        res.status(200).json({success:true, footer:footer});
    }
    catch (e) {
        res.status(500).json(e);
    }
});

//change the display of each topic in footer
router.put('/display/:footerName',async (req,res)=>{
    try{
        const footerName = req.params.footerName;
        const footerInfo = {display:(req.body[footerName] === 'true')};
        const footer = await footerDb.findOneAndUpdate({footerName:footerName},footerInfo,{new:true});
        res.status(200).json({success:true,footer:footer});
    }
    catch (e) {
        res.status(500).json(e);
    }
});

//get the bg color and text color
router.get('/color',async (req,res)=>{

    try{
        const colors = await colorDb.findOne({_id:1});
        console.log("colors",colors);
        if(!colors) {
            // Initially, insert data to tag line
            colorDb.create({ _id: 1},
                (err, doc) => {
                    res.status(200).json({bgColor:doc.footerBgColor,textColor:doc.footerTextColor});
                })
        }
        else{
            res.status(200).json({bgColor:colors.footerBgColor,textColor:colors.footerTextColor});
        }

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

//Change the bg color
router.put('/bgColor',async (req,res)=>{
    try{
        const bgColor = {footerBgColor:req.body.bgColor};
        const bgColorInfo = await colorDb.findOneAndUpdate({_id:1},bgColor,{new:true});
        res.status(200).json({bgColor:bgColorInfo.footerBgColor,success:true});
    }
    catch (e) {
        res.status(500).json(e);
    }
});

//Change the text color
router.put('/textColor',async (req,res)=>{
    try{
        const textColor = {footerTextColor:req.body.textColor};
        const textColorInfo = await colorDb.findOneAndUpdate({_id:1},textColor,{new:true});
        res.status(200).json({textColor:textColorInfo.footerTextColor,success:true,message:"Text color changed"});
    }
    catch (e) {
        res.status(500).json(e);
    }
});


module.exports = router;