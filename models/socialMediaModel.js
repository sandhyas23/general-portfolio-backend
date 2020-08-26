const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema(
    {
        iconName:{
            type: String
        },
        link:{
            type: String
        },
        display:{
            type: Boolean
        }

    },
);


socialMediaSchema.statics.addSocialMediaIcons = async function(){
    console.log("socialMedia model function");

    let socialMediaIcons = await socialMediaModel.find({});

    if(socialMediaIcons.length === 0){
        socialMediaModel.insertMany([{iconName:'linkedIn',link:"",display:true},
            {iconName:'facebook',link:"",display:true},
            {iconName:'pinterest',link:"",display:true},
            {iconName:'twitter',link:"",display:true},
            {iconName:'youTube',link:"",display:true},
            {iconName:'reddit',link:"",display:true},
            {iconName:'gitHub',link:"",display:true},
            {iconName:'instagram',link:"",display:true},

        ])
    }

    else{
        console.log(socialMediaIcons);
    }
};


const socialMediaModel = mongoose.model('SocialMedia', socialMediaSchema);
module.exports = socialMediaModel;

