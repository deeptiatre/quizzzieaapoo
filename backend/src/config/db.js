
const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb is connected")
    } catch (error) {
        console.log("error in mongo db connection", error);
    }
}
module.exports = connectDB;