const express = require("express");
const { connection } = require("./db");
const {userRouter} = require("./routes/user.routes")
const app = express();
app.use(express.json())


app.use("/user",userRouter);


app.get("/",(req,res)=>{
    res.status(200).send({msg:"home route"})
})

app.listen(8080, async()=>{
    try {
        await connection;
        console.log("db connected")
        console.log("server started at 8080")
    } catch (error) {
        console.log(error)   
    }
})


module.exports = app