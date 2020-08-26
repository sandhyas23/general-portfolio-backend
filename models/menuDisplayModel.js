const mongoose = require('mongoose');

const menuDisplaySchema = new mongoose.Schema(
    {
        menu:{
            type: String
        },
        display:{
            type: Boolean
        }

    },
);

menuDisplaySchema.statics.addMenu = async function(){
    console.log("Menu model function");

    let menu = await menuDisplayModel.find({});

    if(menu.length === 0){
        menuDisplayModel.insertMany([{menu:'home',display:true},
            {menu:'blog',display:false},
            {menu:'work',display:false},
            {menu:'contact',display:false},
        ])
    }

    else{
        console.log(menu);
    }
};


const menuDisplayModel = mongoose.model('MenuDisplay', menuDisplaySchema);
module.exports = menuDisplayModel;

