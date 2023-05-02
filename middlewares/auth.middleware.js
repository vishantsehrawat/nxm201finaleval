const jwt = require("jsonwebtoken")
const {redisClient} = require("../redis");
// const { decode } = require("punycode");


require("dotenv").config();

const authMiddleware = async(req,res,next)=>{
    const token = req.headers.authorization;
try {
    if(!token) return res.status(401).send({msg:"not authorised"})

    const tokenPresent = await redisClient.exists(jwttoken)
    if(!tokenPresent) return res.status(400).send("unauthorized");

    var decoded = jwt.verify(token, process.env.SECRETKEY);
    req.userId = decoded.userId;

    next();


    
} catch (error) {
    
    console.log(error)
    res.status(400).send(error);
}
}

module.exports ={authMiddleware};