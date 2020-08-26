const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        topic:{
            type: String,
            required:true,
            unique:true
        },
        content:{
            type:String,
        },
        comments:[{
            profileId:{type:String},
            name:{type:String},
            image:{type:String},
            comment:{type:String},
            date:{type:Date}
        }],
        likes:[{
            type:String
        }],
        image:{
            type:Boolean,
            default:false
        },

    },
    { timestamps: true },
);

//userDb.ensureIndex({ fieldName: "googleId", unique: true });

const blogModel = mongoose.model('Blog', blogSchema);
 module.exports= blogModel;

