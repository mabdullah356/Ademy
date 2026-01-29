const { decode } = require("punycode");
const User = require("../Models/user.model");
const jwt = require("jsonwebtoken");



const isUserLogin = async (req,res,next) => {

    const token =  req.headers.authorization?.split(" ")[1] || req.cookies?.token;    
    
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    };

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if(!decoded || !user.name){
        return res.status(401).json({message:"Unauthorized"})
    };

    const userObj = user.toObject();
    delete userObj.password;    
    req.user = userObj;
    next();

};

const isInstructorLogin = async (req,res,next) => {

    const token =  req.headers.authorization?.split(" ")[1] || req.cookies?.token;    
    
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    };

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if(!decoded || !user.name || user.role!=="instructor"){
        return res.status(401).json({message:"Unauthorized"})
    };

    const userObj = user.toObject();
    delete userObj.password;    
    req.user = userObj;
    next();

};

module.exports={isUserLogin,isInstructorLogin};