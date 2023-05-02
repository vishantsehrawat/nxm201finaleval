const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const {redisClient} = require("../redis")

require('dotenv').config();

const { UserModel } = require("../model/user.model");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { BlacklistModel } = require("../model/blacklist.model");

const userRouter = express();
userRouter.use(express.json());



// register 

userRouter.post("/register", async (req, res) => {
    const userData = req.body;
    // console.log(userData)
    try {
        const hash = bcrypt.hashSync(userData.password, 4);
        userData.password = hash;
        const user = new UserModel(userData);
        await user.save();
        res.status(200).send({ msg: "new user addded" })
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "cannot add new user " })
    }
})

//login route 

userRouter.post("/login", async (req, res) => {
    const userData = req.body;
    // console.log(userData)
    try {
        const myuser = await UserModel.findOne({ email: userData.email });
        // console.log("🚀 ~ file: user.routes.js:35 ~ userRouter.post ~ myuser:", myuser)

        bcrypt.compare(userData.password, myuser.password, function (err, result) {
            // result == true
            if (result) {
                // console.log(result)
                var token = jwt.sign({ userId: myuser.email }, process.env.SECRETKEY);
                // saving token in redis
                // redis.set("jwttoken", token);
                redisClient.set("jwttoken",token)
                res.status(200).send({ msg: "logged in successfully", token })
            }
            else {
                console.log(err)
                res.status(400).send({ msg: "login error" })
            }
        });

    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "cannot login " })
    }
})


// using it above both logut and get ip routes 

//commented temporarily  // uncomment afte completion *******************************************************
// userRouter.use(authMiddleware)

// logout 
userRouter.post("/logout", async (req, res) => {
    const token = await redisClient.get("jwttoken")
    // console.log("🚀 ~ file: user.routes.js:66 ~ userRouter.post ~ token:", token)
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ2aXNoYW50QGdtYWlsLmNvbSIsImlhdCI6MTY4MzAyMTkxMH0._0qh7J3lvLuhBDckqEyW5sRtLaOSdWa2rm0rELhc12E"

    try {
        const blacklist= new BlacklistModel({token:token})
        await blacklist.save();
        res.status(200).send({ msg: "logged out " })
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "cannot logout " })
    }
})



//ip info route 

userRouter.get("/info",(req,res)=>{

})


module.exports = { userRouter }