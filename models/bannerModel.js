const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
    {
        tagLine:{
            type: String
        },
        _id:{
            type: Number
        },
        image:{
            type:Boolean,
            default:false
        },
        bgColor:{
            type:String,
            default: '#e6e6e6'
        },
        textColor:{
            type:String,
            default: 'black'
        }

    },
    { timestamps: true },
);


const bannerModel = mongoose.model('Banner', bannerSchema);

module.exports= bannerModel;

