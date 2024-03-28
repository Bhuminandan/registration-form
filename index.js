// Import necessary modules
const express = require("express"); 
const mongoose = require("mongoose"); 
const bodyParser = require("body-parser");
const dotenv = require("dotenv"); 

// Create express application
const app = express();
dotenv.config(); 

// Define port for the server to listen on
const port = process.env.PORT || 3000;

// Retrieve MongoDB username and password from environment variables
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Connect to MongoDB Atlas cluster
mongoose.connect(`mongodb+srv://${username}:${password}@webrtc.dwi1kt6.mongodb.net/registrationFormDB`, {
    serverSelectionTimeoutMS: 5000, 
});

// Define schema for user registration
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Create a model based on the schema
const registration = mongoose.model("Registration", registrationSchema);

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to serve index.html page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

// Route to handle user registration
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user with given email already exists
        const existingUser = await registration.findOne({ email: email });
        if (!existingUser) {
            // If user does not exist, create a new registration entry
            const registrationData = new registration({
                name,
                email,
                password,
            });
            await registrationData.save(); 
            res.redirect("/success"); 
        } else {
            console.log("User already exists");
            res.redirect("/error"); 
        }
    } catch (error) {
        console.log(error);
    }
});

// Route to serve success.html page
app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

// Route to serve error.html page
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

// Start the server and listen on specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
