require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON data

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dob: { type: String, required: true },
    sex: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

// Signup API
app.post("/signup", async (req, res) => {
    try {
        const { id, name, dob, sex } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ id });
        if (existingUser) return res.status(400).json({ message: "Patient ID already exists" });

        const newUser = new User({ id, name, dob, sex });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const { id, name } = req.body;
        const user = await User.findOne({ id, name });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
