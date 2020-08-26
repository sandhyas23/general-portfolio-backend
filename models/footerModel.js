const mongoose = require('mongoose');

const footerSchema = new mongoose.Schema(
    {
        footerName:{
            type: String
        },
        value:{
            type: String
        },
        display:{
            type: Boolean
        }

    },
);


footerSchema.statics.addFooters = async function(){
    console.log("footer model function");

    let footer = await footerModel.find({});

    if(footer.length === 0){
        footerModel.insertMany([{footerName:'email',value:"",display:true},
            {footerName:'phone',value:"",display:false},
            {footerName:'address',value:"",display:false},
        ])
    }

    else{
        console.log("footer:",footer);
    }
};


const footerModel = mongoose.model('Footer', footerSchema);
module.exports = footerModel;

