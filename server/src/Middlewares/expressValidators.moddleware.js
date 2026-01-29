const { body } = require("express-validator");

const userRegisterMiddleware = () => {
  return [
    body("name")
      .notEmpty().withMessage("name is required")
      .isLength({ min: 3 }).withMessage("name must have at least 3 characters"),

    body("email")
      .isEmail().withMessage("email is not correct"),

    body("password")
      .notEmpty().withMessage("password is required")
      .isLength({ min: 8 }).withMessage("password must have at least 8 characters"),

    body("role")
      .isIn(["user", "instructor", "admin"])
      .withMessage("invalid role"),
  ];
};

const userLoginMiddleware = () => {
  return [
    body("email")
      .isEmail().withMessage("email is not correct"),

    body("password")
      .notEmpty().withMessage("password is required")
      .isLength({ min: 8 }).withMessage("password must have at least 8 characters")
    
    ];
};

module.exports = {userRegisterMiddleware,userLoginMiddleware};
