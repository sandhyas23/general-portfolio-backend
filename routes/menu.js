// Route for menu details

const express = require('express');
const router = express.Router();
const menuDb = require('../models/menuDisplayModel');

// Get all the menu details
router.get('/', async (req,res)=>{
    try{
        const menu = await menuDb.find({});
        res.status(200).json({menu:menu});

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

// Get all the menu details with display === true
router.get('/display', async (req,res)=>{
    try{
        const menu = await menuDb.find({display:true});
        res.status(200).json({menu:menu});

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});



//change the display for each menu icon
router.put('/display/:menu', async (req,res)=>{
    try{
        const menu = req.params.menu;
        //console.log("jhhhhh",(req.body[socialMediaIcon]==='true'));
        const menuInfo = {display:(req.body[menu]==='true')};
        const menuData = await menuDb.findOneAndUpdate({menu:menu},menuInfo,{new:true});
        res.status(200).json({success:true, menu:menuData})
    }
    catch (e) {
        res.status(500).json(e);
    }
});


module.exports = router;