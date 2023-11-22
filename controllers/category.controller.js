import categoryModel from "../models/category.model";
import multer from "multer";
import fs from "fs";
import path from "path";



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = "./uploads";
      const subfolder = "category";
  
      // Create "uploads" folder if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
  
      // Create subfolder inside "uploads"
      const subfolderPath = path.join(uploadPath, subfolder);
      if (!fs.existsSync(subfolderPath)) {
        fs.mkdirSync(subfolderPath);
      }
  
      cb(null, subfolderPath);
    },
    filename: function (req, file, cb) {
        const name = file.originalname; //abc.png
        const ext = path.extname(name); //.png
        const nameArr = name.split("."); //[abc,png]
        nameArr.pop();
        const fname = nameArr.join("."); //abc
        const fullname = fname + "-" + Date.now() + ext; //abc-12345.png
        cb(null, fullname);
    },
});

const upload = multer({ storage: storage });



// Get all categories
export const getCategories = async (req, res) => {
    try {
      const categoryData = await categoryModel.find();
      if (categoryData) {
        return res.status(200).json({
          data: categoryData,
          message: "Successfully",
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  };


  //Add Category
  export const addCategory = (req, res) => {
    try{
        const uploadCat = upload.single("Image");

        uploadCat(req, res, function(err){
            if (err) return res.status(400).json({ message: err.message });
            
            console.log(req.body);
            const { Name} = req.body

            let Image = null;
            if(req.file !== undefined){
                Image = req.file.filename;
            }
            const categoryData = new categoryModel({
                Name: Name,
                Image: Image,
            });

            categoryData.save();

            if(categoryData){
                return res.status(201).json({
                    data: categoryData,
                    message: "Success",
                });
            }
        });
    } catch (error){
        return res.status(500).json({
            message: error.message,
        });
    }
  };


  //GetSingleCategory
  export const getCat = async (req, res) => {
    try {
        const id = req.params.category_id;

        const categoryData = await categoryModel.findOne({ _id: id });
        if (categoryData) {
            return res.status(200).json({
                data: categoryData,
                message: "Success",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

//UpdateCategory
export const updateCat = async (req, res) =>{
    try{
        const uploadCat = upload.single("Image");
        uploadCat (req, res, async function (err){
             if (err) return res.status(400).json({ message: err.message });
             const categoryID = req.params.category_id;
             const {Name} = req.body;

             const categoryData = await categoryModel.findOne({_id: categoryID});
             let Image = categoryData.Image;

             if (req.file !== undefined) {
                Image = req.file.filename;
                if (fs.existsSync("./uploads/category/"+ categoryData.Image)) {
                  fs.unlinkSync("./uploads/category/" + categoryData.Image);
                }
              }

              const updatedCat = await categoryModel.updateOne(
                {_id: categoryID},
                {
                    $set:{
                        Name: Name,
                        Image: Image,
                    },
                }
              );
              if (updatedCat.acknowledged) {
                return res.status(200).json({
                    message: "Updated",
                });
            } 
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

//DeleteCategory

export const deleteCat = async (req, res) => {
    try {
        const id = req.params.category_id;

        const categoryData = await categoryModel.findOne({ _id: id });


      let Image = categoryData.Image; //oldname
        if (fs.existsSync("./uploads/category/" + categoryData.Image)) {
            fs.unlinkSync("./uploads/category/" + categoryData.Image);
          }
        const deletedCat = await categoryModel.deleteOne({ _id: id });
        if (deletedCat.acknowledged) {
            return res.status(200).json({
                message: "Deleted",
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
