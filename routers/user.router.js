import express from "express";

import { getAllUsers, AddUser, getUser, deleteUser, updateUser, SignUp, login, loginOtp, generateOtp, AdminLogin } from "../controllers/user.controller";

const router = express.Router();

router.get("/get-users", getAllUsers);

router.post("/add-user", AddUser);

router.get("/get-single-user/:user_id", getUser);

router.delete("/delete-user/:user_id", deleteUser);

router.put("/update-user/:user_id", updateUser)

router.post("/sign-up-user", SignUp)

router.post("/log-in", login);

router.get("/log-in-otp", loginOtp);

router.patch("/generate-otp", generateOtp)

router.post("/Admin-Login", AdminLogin)
export default router;

