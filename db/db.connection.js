const mongoose = require("mongoose")

const dotenv = require("dotenv")

dotenv.config()

const mongoUri = process.env.mongoDbUrl

async function initializeDatabase() {
    await mongoose.connect(mongoUri)
    .then(()=>{console.log("connected to database")})
    .catch((err)=>{console.log("Error connecting to database",err)})
}

module.exports = {initializeDatabase}