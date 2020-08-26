const mongoose = require('mongoose');
const Category = require('./categoriesModel')

const workSchema = new mongoose.Schema(
    {
        title: {
                type:String
        },
        description: {
                type:String
        },
        url:{
            type:String
        },
        image:{
            type:Boolean,
            default:false
        },
        category: [
            {type:mongoose.Schema.Types.ObjectId,
            ref:'Categories'}
            ]
    },
    { timestamps: true },
);

//userDb.ensureIndex({ fieldName: "googleId", unique: true });

const projectsModel = mongoose.model('Projects', workSchema);

module.exports= projectsModel;

