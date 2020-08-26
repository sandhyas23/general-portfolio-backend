// Route for work details

const express = require('express');
const router = express.Router();
const blogDb = require('../models/blogModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: "./public/static/media/",
    filename: function(req, file, cb){
        cb(null,'blog'+req.params.blogId + ".jpg");
    }
});

const upload = multer({
    storage: storage,
}).single("blogImage");

router.post("/upload/:blogId", (req,res)=> {
    if(Object.keys(req.cookies).length === 0){
        res.json({success:false,message:"Login to perform this action"})
    }
    else{
        upload (req,res, (err) => {
            console.log("Request ---", req.body);
            console.log("Request file ---", req.file);//Here you get file.
            /*Now do where ever you want to do*/
            if(!err)
                res.status(200).json({"image":true, success:true});
            else{
                res.send("error");
            }
        })
    }

});



// Get all the blog details
router.get('/', async (req,res)=>{
    try{
        const blog = await blogDb.find({});
        res.status(200).json({blog:blog});

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

//Add a new blog post
router.post('/',async (req,res)=>{
    try{
            blogDb.create({topic:req.body.topic,content:req.body.content,comments:[],likes:[]}, async(err,doc)=>{
               await console.log("blog",doc);
                await res.status(200).json({success:true, blog:doc, message:"Blog added"});
            })

    }

    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Edit a blog
router.put('/:blogId',async (req,res)=>{
    try{
        const blogId = req.params.blogId;
        const blogInfo = req.body;
        const blog = await blogDb.findByIdAndUpdate(blogId,blogInfo,{new:true});
        res.status(200).json({success:true, blog:blog, message:"Blog edited"})

    }

    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Delete a blog
router.delete('/:blogId',async (req,res)=>{
    try{
        const blogId = req.params.blogId;
        const deletedBlog = await blogDb.findByIdAndRemove(blogId);
        await res.status(200).json({success:true,deletedBlog:deletedBlog,message:"Blog deleted"})
    }

    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Get a specific blog
router.get('/:blogId', async (req,res)=>{
    try{
        const blogId= req.params.blogId;
        const blog = await blogDb.findById(blogId);
        res.status(200).json({blog:blog});

    }
    catch(err){
        res.status(500).json({success:false,message:"Something went wrong!"});
        //next();
    }
});


// Add a comment
router.post('/comment/:blogId',async (req,res)=>{
    try{
        const blogId = req.params.blogId;
        const commentInfo = {profileId:req.body.profileId,name:req.body.name,image:req.body.image,comment:req.body.comment,
            date:new Date().toISOString()};
        //console.log(commentInfo);
        const blog = await blogDb.findByIdAndUpdate(blogId,
            {$push:{comments:commentInfo}}
            ,{new:true});
        console.log("blog::",blog);
        res.status(200).json({success:true,blog:blog,message:"Comment posted"})

    }
    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Edit a comment
router.put('/comment/:blogId',async (req,res)=>{
    try{
        const blogId = req.params.blogId;
        const commentId = req.body.id;
        //console.log(commentInfo);
        const blog = await blogDb.findOneAndUpdate({_id:blogId,'comments._id':commentId,'comments.profileId':req.body.profileId},
            {$set:{'comments.$.comment':req.body.comment,'comments.$.date':new Date().toISOString()}},
            {new:true});
        console.log("blog::",blog);
        res.status(200).json({success:true, blog:blog,message:"Comment edited"})

    }
    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Delete a comment
router.delete('/comment/:blogId',async (req,res)=>{
    try{
        const blogId = req.params.blogId;
        const deletedComment = await blogDb.findByIdAndUpdate(blogId,
            {$pull:{comments:{_id:req.body.id,profileId:req.body.profileId}}})
         await res.status(200).json({success:true,deletedComment:deletedComment,message:"Comment deleted"})
    }

    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Add a like
router.post('/like/:blogId',async (req,res)=>{
    try{
        const blogId = req.params.blogId;
        //console.log(commentInfo);
        const blog = await blogDb.findByIdAndUpdate(blogId,
            {$push:{likes:req.body.profileId}}
            ,{new:true});
        //console.log("blog::",blog);
        res.status(200).json({success:true,blog:blog,message:"Like posted successfully"})

    }
    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Delete a like
router.delete('/like/:blogId',async (req,res)=>{
    try{
        const blogId = req.params.blogId;
        const deletedLikes = await blogDb.findByIdAndUpdate(blogId,
            {$pull:{likes:req.body.profileId}},
            {new:true})
         await res.status(200).json({success:true,deletedLikes:deletedLikes,message:"Disliked successfully"})
    }
    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Change the image to true pr false
router.put('/image/:blogId',async (req,res)=>{
    try{
        const imageInfo = {image:(req.body.image === 'true')};
        const blog = await blogDb.findByIdAndUpdate(req.params.blogId,imageInfo,{new:true});
        res.status(200).json({image:blog.image,success:true});
    }
    catch (e) {
        res.status(500).json(e);
    }
});


module.exports = router;