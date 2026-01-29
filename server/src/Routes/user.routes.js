const express = require("express");
const { userRegisterMiddleware, userLoginMiddleware } = require("../Middlewares/expressValidators.moddleware");
const { registerUser, LoginUser, logoutUser, getProfile, googleLogin } = require("../Controllers/user.controller");
const { isUserLogin } = require("../Middlewares/auth.middleware");

const router = express.Router();

router.post("/register", userRegisterMiddleware(), registerUser);
router.post("/login", userLoginMiddleware(), LoginUser);
router.post("/google-login", googleLogin);

router.get("/logout", logoutUser);

router.get("/profile", isUserLogin, getProfile)



module.exports = router;