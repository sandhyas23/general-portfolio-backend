// Route for updating aboutme in homepage

const express = require('express');
const router = express.Router();
const homeDb = require('../models/homeModel');



// Get the aboutMe
router.get('/', async (req,res)=>{
    try{
        const aboutMe = await homeDb.findOne({_id:1});
        // Initially, insert data to aboutme
        if(!aboutMe){
            homeDb.create({aboutMe: 'Enter your about Me info here', _id: 1},
                (err, doc) => {
                    res.status(200).json({aboutMe: doc.aboutMe});
                })

        }
        else{
            res.status(200).json({aboutMe:aboutMe.aboutMe});
        }

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

//Post the about Me
router.put('/', async(req,res) =>{
    // if(Object.keys(req.cookies).length === 0){
    //     await res.json({success:false,message:"Login to perform this action"})
    // }
    try{
        const aboutMeInfo ={aboutMe:req.body.aboutMe};

        const home = await homeDb.findOneAndUpdate({_id:1},aboutMeInfo,{new:true});

        res.status(200).json({aboutMe:home.aboutMe , success:true});
    }
    catch (e) {
        res.status(500).json(e);
    }


});

module.exports = router;