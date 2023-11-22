import UserModel from "../models/user.model";
import multer from "multer";
import fs, { chown } from "fs";
import path from "path";
import bcrypt from "bcrypt";
import validator from "validator";
import otpGenerator from "otp-generator";
import userModel from "../models/user.model";
import jwt from "jsonwebtoken";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    const subfolder = "newFolder";

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

//GetAllUSers
export const getAllUsers = async (req, res) => {
  try {
    const userData = await UserModel.find();
    if (userData) {
      return res.status(200).json({
        data: userData,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//AddUsers
export const AddUser = (req, res) => { ;
  try {
    const uploadUser = upload.single("Avatar");

    uploadUser(req, res, function (err) {
      if (err) return res.status(400).json({ message: err.message });

      // console.log(req.body);
      const {
        FirstName,
        LastName,
        email,
        password,
        contact,
        DoB,
        Gender,
        About,
        OTP,
        role,
        Status,
      } = req.body;

      let Avatar = null;
      if (req.file !== undefined) {
        Avatar = req.file.filename;
      }
      const createdRecord = new UserModel({
        FirstName: FirstName,
        LastName: LastName,
        email: email,
        password: password,
        contact: contact,
        DoB: DoB,
        Gender: Gender,
        About: About,
        Avatar: Avatar,
        OTP: OTP,
        role: role,
        Status: Status,
      });

      createdRecord.save();

      if (createdRecord) {
        return res.status(201).json({
          data: createdRecord,
          message: "Success",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//GetSingleUser
export const getUser = async (req, res) => {
  try {
    const id = req.params.user_id;

    const userData = await UserModel.findOne({ _id: id });
    if (userData) {
      return res.status(200).json({
        data: userData,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//DeleteUser

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.user_id;

    const userData = await UserModel.findOne({ _id: id });

    let Avatar = userData.Avatar; //oldname
    if (fs.existsSync("./uploads/newFolder/" + userData.Avatar)) {
      fs.unlinkSync("./uploads/newFolder/" + userData.Avatar);
    }
    const deletedUser = await UserModel.deleteOne({ _id: id });
    if (deletedUser.acknowledged) {
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

//UpdteUser

export const updateUser = async (req, res) => {
  try {
    const uploadData = upload.single("Avatar");
    uploadData(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const user_id = req.params.user_id;
      const {
        FirstName,
        LastName,
        email,
        password,
        contact,
        DoB,
        Gender,
        About,
        OTP,
        Status,
      } = req.body;

      const userData = await UserModel.findOne({ _id: user_id });
      let Avatar = userData.Avatar; //oldname

      if (req.file !== undefined) {
        Avatar = req.file.filename;
        if (fs.existsSync("./uploads/newFolder/" + userData.Avatar)) {
          fs.unlinkSync("./uploads/newFolder/" + userData.Avatar);
        }
      }
      const updatedUser = await UserModel.updateOne(
        { _id: user_id },
        {
          $set: {
            FirstName: FirstName,
            LastName: LastName,
            email: email,
            password: password,
            contact: contact,
            DoB: DoB,
            Gender: Gender,
            About: About,
            Avatar: Avatar,
            OTP: OTP,
            Status: Status,
          },
        }
      );
      if (updatedUser.acknowledged) {
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

export const SignUp = async (req, res) => {
  try {
    const uploadUser = upload.single("Avatar");

    uploadUser(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      //   console.log(req.body);
      const { FirstName, LastName, email, password, contact } = req.body;
      console.log(email);

      let Avatar = null;
      if (req.file !== undefined) {
        Avatar = req.file.filename;
      }

      const isEmail = validator.isEmail(email);
      const isPassword = validator.isStrongPassword(password);

      if (!isEmail) {
        return res.status(400).json({
          message: "invalid email",
        });
      } else if (!isPassword) {
        return res.status(400).json({
          message:
            "passsword must be minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,",
        });
      }

      const existUser = await userModel.findOne({ email: email });
      if (existUser) {
        return res.status(400).json({
          message: "user already exist",
        });
      }
      const passToString = password.toString();

      const hashPassword = bcrypt.hashSync(passToString, 10);

      const newUser = new userModel({
        FirstName: FirstName,
        LastName: LastName,
        email: email,
        password: hashPassword,
        contact: contact,
        // DoB: DoB,
        // Gender: Gender,
        // About: About,
        // Avatar: Avatar,
        // OTP: OTP,
        // Status: Status,
      });
      newUser.save();

      if (newUser) {
        return res.status(201).json({
          message: "Successfully resgistered",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isEmail = validator.isEmail(email);
    const isPassword = validator.isStrongPassword(password);

    if (!isEmail) {
      return res.status(400).json({
        message: "invalid email",
      });
    } else if (!isPassword) {
      return res.status(400).json({
        message:
          "passsword must be minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,",
      });
    }
    const checkUser = await userModel.findOne({ email: email });

    if (!checkUser) {
      return res.status(400).json({
        message: "email not exist Please signup",
      });
    }

    const passwordCompare = await bcrypt.compare(password, checkUser.password);
    if (!passwordCompare) {
      return res.status(400).json({
        message: "Invlaid credetianls",
      });
    }
    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
      },
      "mysecretekey",
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      data:checkUser,
      token: token,
      message: "successfully login",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const loginOtp = async (req, res) => {
  try {
    const { contact, otp } = req.body;

    if (!contact) {
      return res.status(400).json({
        message: "invalid contact",
      });
    }

    const checkUser = await userModel.findOne({ contact: contact });
    console.log(checkUser.OTP);
    if (!checkUser) {
      return res.status(400).json({
        message: "contact not exist ,please create account",
      });
    }
    if (checkUser.OTP !== otp) {
      return res.status(400).json({
        message: "invalid otp",
      });
    }
    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
      },
      "mysecretkey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "successfully login",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const generateOtp = async (req, res) => {
  try {
    const { contact } = req.body;
    const userData = await userModel.findOne({ contact: contact });

    let otp;
    if (userData.contact === contact) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      console.log(otp);
    }

    if (!userData) {
      return res.status(200).json({
        message: "invalid number ",
      });
    }

    const updatedData = await userModel.updateOne(
      { contact: contact },
      {
        $set: {
          OTP: otp,
        },
      }
    );

    if (updatedData) {
      return res.status(200).json({
        message: "otp send",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email and password
    const user = await UserModel.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check if the user's role is "admin"
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Only admin users are allowed.",
      });
    }

    // Generate a JWT token for the admin user
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "mysecretekey", // Replace with your secret key for signing tokens
      { expiresIn: "1h" } // Set token expiration time as needed
    );
    return res.status(200).json({
      message: "Admin login successful.",
      token: token, // Send the generated token in the response
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
