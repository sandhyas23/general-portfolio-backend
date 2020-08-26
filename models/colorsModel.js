const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
    {
        _id:{
            type: Number,
        },
        footerBgColor:{
            type:String,
            default: '#e6e6e6'
        },
        footerTextColor:{
            type:String,
            default: 'black'
        }

    },
    { timestamps: true },
);


const colorsModel = mongoose.model('Color', colorSchema);

module.exports= colorsModel;

