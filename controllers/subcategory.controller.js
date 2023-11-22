import subcategoryModel from "../models/subcategory.model";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    const subfolder = "sub-category";

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
    const name = file.originalname; // abc.png
    const ext = path.extname(name); // .png
    const nameArr = name.split("."); // [abc,png]
    nameArr.pop();
    const fname = nameArr.join("."); //abc
    const fullname = fname + "-" + Date.now() + ext; // abc-12345.png
    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });


//Get Sub-Category
export const getsubcategory = async (req, res) => {
  try {
    const subcategoryData = await subcategoryModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: "$categories" },
    ]);
    if (subcategoryData) {
      return res.status(200).json({
        data: subcategoryData,
        message: "Success"
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}


//Get Single Sub-Category
export const getSingleSubCategory = async (req, res) => {
  try {
    const subcategoryID = req.params.subcategory_id;
    const categoryData = await subcategoryModel.findOne({ _id: subcategoryID });

    if (categoryData) {
      return res.status(200).json({
        data: categoryData,
        message: "Success"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

//Add Sub-Category
export const addsubCategory = (req, res) => {
  try {
    const uploadSubCat = upload.single("Image");
    uploadSubCat(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { Name, category } = req.body;
      let Image = null;
      if (req.file !== undefined) {
        Image = req.file.filename;
      }

      const subcategoryData = new subcategoryModel({
        Name: Name,
        category: category,
        Image: Image,
      });
      subcategoryData.save();
      if (subcategoryData) {
        return res.status(201).json({
          data: subcategoryData,
          message: "Category Added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}


//Update SubCategory
export const updateSubCategory = async (req, res) => {
  try {
    const uploadSubCat = upload.single("Image");
    uploadSubCat(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const subcategoryID = req.params.subcategory_id;
      const { Name, category } = req.body;

      const subcategoryData = await subcategoryModel.findOne({ _id: subcategoryID });
      let Image = subcategoryData.Image;


      if (req.file !== undefined) {
        Image = req.file.filename;
        if (fs.existsSync("./uploads/sub-category/" + subcategoryData.Image)) {
          fs.unlinkSync("./uploads/sub-category/" + subcategoryData.Image);
        }
      }

      const updatedsubCat = await subcategoryModel.updateOne(
        { _id: subcategoryID },
        {
          $set: {
            Name: Name,
            category: category,
            Image: Image,
          },
        }
      );

      if (updatedsubCat.acknowledged) {
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
}


//Delete Sub-Category
export const deleteSubCategory = async (req, res) => {
  try {
    const subcategoryID = req.params.subcategory_id;
    const subcategoryData = await subcategoryModel.findOne({ _id: subcategoryID });

    let Image = subcategoryData.Image;
    if (fs.existsSync("./uploads/sub-category/" + subcategoryData.Image)) {
      fs.unlinkSync("./uploads/sub-category/" + subcategoryData.Image);
    }

    const deletedSubCat = await subcategoryModel.deleteOne({ _id: subcategoryID });
    if (deletedSubCat.acknowledged) {
      return res.status(200).json({
        message: "Deleted",
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}