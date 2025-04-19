const expressHandler = require("express-async-handler");

const Image = require('../models/image');

const postImage = expressHandler(async(req, res) => {
    console.log("CALLING CONTROLLER....");
    
    try {
        if(!req.file) {
           return res.status(500).json({error: "NO FILE FOUND"}) 
        }
        const imageFile =  Image({
            filename: req.file.filename,
            filepath: req.file.path,
            uid: req.body.uid
        });

        console.log("imageFile ", imageFile);

        const saveImage = await imageFile.save();
        return res.status(200).json(saveImage) 


    } catch(error) {
        console.log(error);
        
        return res.status(500).json({error: "NO FILE FOUND"}) 

    }
});

module.exports = { postImage };