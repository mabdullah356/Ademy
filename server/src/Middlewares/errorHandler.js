const errorHandler = (error,req,res,next)=>{
    console.log(error);
    return res.status(500).json({message:"Internal server error"})
}

module.exports = errorHandler;