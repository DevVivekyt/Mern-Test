const mongoose = require("mongoose")

const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb+srv://vivekmishra:vivek12345@cluster0.73mgg8t.mongodb.net/MREN?retryWrites=true&w=majority&appName=Cluster0")
        console.log("db connected!");
    } catch (error) {
        console.log(`error ${error}`);
    }
}

module.exports = dbConnection