const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema(
    {
        aboutMe:{
            type: String
        },
        _id:{
            type: Number
        }

    },
    { timestamps: true },
);

//userDb.ensureIndex({ fieldName: "googleId", unique: true });


const homeModel = mongoose.model('Home', homeSchema);

module.exports= homeModel;

