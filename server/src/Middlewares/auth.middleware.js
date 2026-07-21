const User = require("../Models/user.model");
const jwt = require("jsonwebtoken");



const isUserLogin = async (req,res,next) => {

    const token =  req.headers.authorization?.split(" ")[1] || req.cookies?.token;    
    
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    };

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({message:"Unauthorized"})
    }
    
    const user = await User.findById(decoded.id).select("-password");
    
    if(!user){
        return res.status(401).json({message:"Unauthorized"})
    };

    req.user = user;
    next();

};

const isInstructorLogin = async (req,res,next) => {

    const token =  req.headers.authorization?.split(" ")[1] || req.cookies?.token;    
    
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    };

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({message:"Unauthorized"})
    }
    
    const user = await User.findById(decoded.id).select("-password");
    
    if(!user || user.role!=="instructor"){
        return res.status(401).json({message:"Unauthorized"})
    };

    req.user = user;
    next();

};

module.exports={isUserLogin,isInstructorLogin};