// Route for work details

const express = require('express');
const router = express.Router();
const workDb = require('../models/workModel');
const categoriesDb = require('../models/categoriesModel');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: "./public/static/media/",
    filename: function(req, file, cb){
        cb(null, "project"+req.params.projectId  + ".jpg");
    }
});

const upload = multer({
    storage: storage,
}).single("workImage");

router.post("/upload/:projectId", (req,res)=> {
    // if(Object.keys(req.cookies).length === 0){
    //     res.json({success:false,message:"Login to perform this action"})
    // }
    // else{
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
    // }

});


// Get all the work details
router.get('/projects', async (req,res)=>{
    try{
        const work = await workDb.find({});
        await res.status(200).json({work:work});

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

// Get all the categories details
router.get('/categories', async (req,res)=>{
    try{
        const categories = await categoriesDb.find({});
        await res.status(200).json({categories:categories});

    }
    catch(err){
        res.status(500).json({error :err});
        //next();
    }
});

// Get all work based on category
router.get('/projects/:category', async (req,res)=>{
    try{
        const category = req.params.category;
        const cat = await categoriesDb.findOne({name:category});
        //const projects = categoriesDb.findOne({name:category}).populate("projects");
        const projects = await getProjectsWithCategory(cat._id)

        await res.status(200).json({work:projects});

    }
    catch(err){
        res.status(500).json({error :"Not found"});
        //next();
    }
});


//Add a new category
router.post('/categories',async (req,res)=>{
    try{
        const category = req.body.category;
        const cat = await categoriesDb.findOne({name:category});
        if(!cat){
            categoriesDb.create({name:category}, (err,doc)=>{
                res.status(200).json({category: doc, success:true, message:"Category added"});
            })
        }
        else{
            res.status(200).json({success:false,message:"Category already exists"});
        }

    }

    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Edit a category
router.put('/categories/:category',async (req,res)=>{
    try{
        const category = req.params.category;
        const newCategoryName = {name:req.body.newCategory};
        const cat = await categoriesDb.findOne(newCategoryName);
        //console.log("old: ",category," new: ",newCategoryName);
        if(!cat){
            const work = await categoriesDb.findOneAndUpdate({name:category},newCategoryName,{new:true});
            console.log("work",work);
            await res.status(200).json({success:true, work:work,message:"Category edited"})
        }
        else{
            res.status(200).json({success:false,message:"Category already exists"});
        }
    }

    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Add projects to category
router.post('/addProject',async(req,res)=>{
    try{
        const categoryArray = req.body.category;

            workDb.create({title:req.body.title,description:req.body.description,url:req.body.url},async (err,doc)=>{
                let categoryInProject  = null;
                let projectInCategory= null;
                 await Promise.all(categoryArray.map(async (element,index,array)=>{

                    const cat = await categoriesDb.findOne({name:element});
                     categoryInProject = await addCategoryToProject(doc._id,cat);
                    // console.log("categoryInProject",categoryInProject);
                    projectInCategory = await addProjectToCategory(cat._id,doc);
                     //console.log("projectInCategory",projectInCategory)
                    }))

                 await console.log("kkkkkk",categoryInProject);
                  await res.status(200).json({project: categoryInProject, success:true, message:"Project added"});
            })

    }
    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Edit projects to category
router.put('/editProject/:projectId',async(req,res)=>{
    try{
        let categoryInProject  = null;
        let projectInCategory= null;
        const categoryArray = req.body.category;
        const projectId = req.params.projectId;
        const work = await workDb.findByIdAndUpdate(projectId,{title:req.body.title,
            description:req.body.description, url:req.body.url}, {new:true});

        if(work!=null){
            await Promise.all(categoryArray.map(async (element,index,array)=>{
                const cat =  await categoriesDb.findOne({name:element});
                    //console.log("aaaaa");
                    //console.log("jjjjjj",cat);
                    if (!work.category.includes(cat._id)) {
                        console.log("work is there");
                        console.log("jjjjjj",cat);
                        categoryInProject = await addCategoryToProject(work._id, cat);
                        console.log("categoryInProject", categoryInProject);
                        projectInCategory = await addProjectToCategory(cat._id, work);
                        //console.log("projectInCategory", projectInCategory)
                    }

            }));
            await Promise.all(work.category.map(async (element,index,array)=>{
                const cat = await categoriesDb.findById(element);
                if(cat!=null){
                    //console.log("sjhshdsjdhs",cat);
                    if(!categoryArray.includes(cat.name)){
                        categoryInProject= await removeCategoryFromProject(work._id,cat);
                        projectInCategory= await removeProjectFromCategory(cat._id,work);
                    }
                }

            }));

        }

          await res.status(200).json({project: categoryInProject === null? work :categoryInProject,
              success:true,message:"Project edited"});

    }
    catch (e) {
        res.status(500).json({success:false,message:"Something went wrong!"});
    }
});

//Delete a category
router.delete('/category/:category',async (req,res)=>{
    try{

        const category = await categoriesDb.findOne({name:req.params.category});
        if(category){
            category.projects.forEach(async (element,index,array)=>{
                const project = await workDb.findById(element);
                await removeCategoryFromProject(project._id,category);
            })
        }
        const deletedCategory = await categoriesDb.findByIdAndRemove(category._id);
        await res.status(200).json({success:true,deletedCategory:deletedCategory,message:"Category deleted"});
    }

    catch (e) {
        res.status(500).json({e});
    }
});

//Delete a project
router.delete('/deleteProject/:projectId',async (req,res)=>{
    try{
        const project = await workDb.findOne({_id:req.params.projectId});
        if(project){
            project.category.forEach(async (element,index,array)=>{
                const category = await categoriesDb.findById(element);
                await removeProjectFromCategory(category._id,project);
            })
        }
        const deletedProject = await workDb.findByIdAndRemove(project._id);
        await res.status(200).json({success:true,deletedProject:deletedProject});

    }

    catch (e) {
        res.status(500).json({e});
    }
});

const addCategoryToProject =  (projectId, category)=> {
    return workDb.findByIdAndUpdate(
        projectId,
        { $push: { category: category._id } },
        { new: true}
    );
};

const addProjectToCategory = (categoryId, project) => {
    return categoriesDb.findByIdAndUpdate(
        categoryId,
        { $push: { projects: project._id } },
        { new: true}
    );
};

const getProjectsWithCategory = (id)=> {
    return categoriesDb.findById(id).populate("projects");
};



const removeCategoryFromProject = (projectId,category) =>{
    return workDb.findByIdAndUpdate(
        projectId,
        {$pull :{category:category._id}},
        { new: true}

    )
};

const removeProjectFromCategory = (categoryId, project) =>{
    return  categoriesDb.findByIdAndUpdate(
        categoryId,
        {$pull :{projects:project._id}},
        { new: true}

    )
};

//Change the image to true pr false
router.put('/image/:projectId',async (req,res)=>{
    try{
        const imageInfo = {image:(req.body.image === 'true')};
        const project = await workDb.findByIdAndUpdate(req.params.projectId,imageInfo,{new:true});
        res.status(200).json({image:project.image,success:true});
    }
    catch (e) {
        res.status(500).json(e);
    }
});


module.exports = router;