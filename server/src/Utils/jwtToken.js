const jwt = require("jsonwebtoken");

const generateToken=async (user,res)=>{
        const payload = {id:user._id};
        const token = await jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"7d"});

        res.cookie("token",token);
        return token;       
};

module.exports = generateToken;