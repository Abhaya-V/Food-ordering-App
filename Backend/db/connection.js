const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connection established")
}).catch(()=>{
    console.log("connection not established")
})