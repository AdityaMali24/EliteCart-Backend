import productModel from "../models/product.model";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    const subfolder = "products";

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

export const getProducts = async (req, res) => {
  try {
    const Products = await productModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: "$categories" },
      {
        $lookup: {
          from: "sub-categories",
          localField: "subcategory",
          foreignField: "_id",
          as: "sub-categories",
        },
      },
      { $unwind: "$sub-categories" },
    ]);
    if (Products) {
      return res.status(200).json({
        data: Products,
        message: "Success"
        // path:"http://localhost:8006/uploads/products/"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const addProduct = (req, res) => {
  try {
    const uploadProduct = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "Images", maxCount: 4 },
    ]);

    uploadProduct(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const {
        Name,
        category,
        subcategory,
        quantity,
        price,
        shortdescription,
        description,
      } = req.body;

      let thumbnail = null;
      if (req.files && req.files["thumbnail"]) {
        thumbnail = req.files["thumbnail"][0].filename;
      }

      let Images = [];
      if (req.files && req.files["Images"]) {
        req.files["Images"].forEach((file) => {
          Images.push(file.filename);
        });
      }

      const productData = new productModel({
        Name: Name,
        category: category,
        subcategory: subcategory,
        quantity: quantity,
        price: price,
        shortdescription: shortdescription,
        description: description,
        thumbnail: thumbnail,
        Images: Images.join(","),
      });

      const validationError = productData.validateSync();
      if (validationError) {
        return res.status(400).json({ message: validationError.message });
      }

      productData.save();

      if (productData) {
        return res.status(201).json({
          data: productData,
          message: "Product Added Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const uploadProduct = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "Images", maxCount: 4 },
    ]);

    uploadProduct(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const product_id = req.params.product_id;

      const productData = await productModel.findOne({ _id: product_id });
      const {
        Name,
        category,
        subcategory,
        quantity,
        price,
        shortdescription,
        description,
      } = req.body;

      let thumbnail = productData.thumbnail;
      if (req.files && req.files["thumbnail"]) {
        thumbnail = req.files["thumbnail"][0].filename;
        if (fs.existsSync("./uploads/products/" + productData.thumbnail)) {
          fs.unlinkSync("./uploads/products/" + productData.thumbnail);
        }
      }

      let Images = productData.Images;
      if (req.files && req.files["Images"]) {
        req.files["Images"].forEach((file) => {
          Images.push(file.filename);
        });
        if (fs.existsSync("./uploads/products/" + productData.Images)) {
          fs.unlinkSync("./uploads/products/" + productData.Images);
        }
      }

      const updatedProduct = await productModel.updateOne(
        { _id: product_id },
        {
          $set: {
            Name: Name,
            category: category,
            subcategory: subcategory,
            quantity: quantity,
            price: price,
            shortdescription: shortdescription,
            description: description,
            thumbnail: thumbnail,
            Images: Images,
          },
        }
      );
      const validationError = productData.validateSync();
      if (validationError) {
        return res.status(400).json({ message: validationError.message });
      }

      if (updatedProduct) {
        return res.status(201).json({
          data: updatedProduct,
          message: "Product Updated Successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product_id = req.params.product_id;

    const productData = await productModel.findOne({ _id: product_id });

    const images = productData.Images.split(",");

    for (let i = 0; i < images.length; i++) {
      const imagePath = "./uploads/products/" + images[i];
      if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    const thumbnailPath = "./uploads/products/" + productData.thumbnail;
    if (fs.existsSync(thumbnailPath) && fs.statSync(thumbnailPath).isFile()) {
      fs.unlinkSync(thumbnailPath);
    }

    const deletedProduct = await productModel.deleteOne({ _id: product_id });
    if (deletedProduct.acknowledged) {
      return res.status(200).json({
        data: deletedProduct,
        message: "Product Deleted Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};




// export const deleteProduct = async (req, res) => {
//   try {
//     const product_id = req.params.product_id;

//     const productData = await productModel.findOne({ _id: product_id });

//     const image = productData.Images.split(",");

//     console.log(image[1]);

//     console.log(fs.existsSync("./uploads/products/"));
//     for (let i = 0; i < image.length; i++) {
//       if (fs.existsSync("./uploads/products/" + image[i])) {
//         fs.unlinkSync("./uploads/products/" + image[i]);
//       }
//     }
//     if (fs.existsSync("./uploads/products/" + productData.thumbnail)) {
//       fs.unlinkSync("./uploads/products/" + productData.thumbnail);
//     }

//     const deletedProduct = await productModel.deleteOne({ _id: product_id });
//     if (deletedProduct.acknowledged) {
//       return res.status(200).json({
//         data: deletedProduct,
//         message: "Product Deleted Successfully",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const getProduct = async (req, res) => {
  try {
    const id = req.params.product_id;

    const productData = await productModel.findOne({ _id: id });
    console.log("Retrieved productData:", productData);

    if (!productData) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check if productData.Images is a string before splitting
    // if (typeof productData.Images === 'String') {
    //   const images = productData.Images.split(",");

      // Now, images should be an array of image URLs
      // console.log(images);

      return res.status(200).json({
        data: productData,
        // images: images,
        message: "Success",
      });
    // } else {
    //   // Handle the case where productData.Images is not a string
    //   return res.status(500).json({
    //     message: "Images data is not valid",
    //   });
    // }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

