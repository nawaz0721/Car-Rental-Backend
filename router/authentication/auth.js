import express from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../../models/users.js";

const router = express.Router();
const tokenBlacklist = new Set();

const checkTokenBlacklist = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token && tokenBlacklist.has(token)) {
        return res.status(401).json({
            status: false,
            message: "Token is no longer valid",
        });
    }
    next();
};

router.use(checkTokenBlacklist);

// Update validation schemas to use CNIC for login
const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string(),  // Make sure this is optional if you don't require it every time
});


// Assuming "router" is an Express router and User is a Mongoose model
router.post("/register", async (req, res) => {
    const { name, email, password, phone } = req.body;
  
    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Create a new user and hash their password
      user = new User({
        name,
        email,
        password, // Consider hashing the password before saving
        phone
      });
  
      await user.save(); // Save the user in the database
  
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  


router.post("/login", async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details[0].message,
        });
    }

    const user = await User.findOne({ cnic: value.cnic });
    if (!user) {
        return res.status(403).json({
            status: false,
            message: "CNIC not registered",
        });
    }

    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({
            status: false,
            message: "Incorrect password",
        });
    }

    const token = jwt.sign({ _id: user._id }, process.env.AUTH_SECRET);

    res.status(200).json({
        status: true,
        message: "Login successful",
        data: { user, token },
    });
});

router.post("/logout", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(400).json({
            status: false,
            message: "Token is required for logout",
        });
    }

    jwt.verify(token, process.env.AUTH_SECRET, (err) => {
        if (err) {
            return res.status(403).json({
                status: false,
                message: "Invalid token",
            });
        }

        tokenBlacklist.add(token);

        res.status(200).json({
            status: true,
            message: "User logged out successfully",
        });
    });
});

export default router;