const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        projects:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Projects"
        }]
    },
    { timestamps: true },
);

//userDb.ensureIndex({ fieldName: "googleId", unique: true });

const categoriesModel = mongoose.model('Categories', categoriesSchema);

module.exports= categoriesModel;

