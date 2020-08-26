const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const userSchema = new mongoose.Schema(
    {
        googleId:{
            type: String
        },
        displayName : {
            type: String
        },

        image: {
            type: String
        },
        isAdmin:{
            type:Boolean, default:false
        }
    }
);


userSchema.statics.addAdmin = async function(){
    console.log("user model function");

    let admin = await userModel.find({isAdmin: true});

    if(admin.length === 0){
        userModel.create({googleId:process.env.googleId, displayName:process.env.displayName,
            image:process.env.image,
            isAdmin:true}
        , (err) => {
            if(err) console.log(err);
            })
    }

    else{
        console.log("admin:",admin);
    }
};

const userModel = mongoose.model('User', userSchema);

module.exports= userModel;

