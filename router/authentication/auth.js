import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import "dotenv/config";
import User from "../../models/users.js";

const router = express.Router();

// Login Schema Validation
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Register Schema Validation
const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
});

// Login Route
router.post("/login", async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
        return res.status(403).json({ message: "Email not registered" });
    }

    const isPasswordValid = await bcrypt.compare(value.password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.AUTH_SECRET, { expiresIn: "1h" });

    res.status(200).json({
        status: true,
        message: "Login successful",
        data: { user, token }
    });
});

// Register Route
router.post("/register", async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            phone
        });

        await user.save(); // Save user to database

        res.status(201).json({
            status: true,
            message: "User registered successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Logout Route (Invalidate the JWT Token)
router.post("/logout", (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(400).json({
            message: "Token is required for logout",
        });
    }

    // Blacklist token or invalidate it
    res.status(200).json({
        message: "User logged out successfully",
    });
});

export default router;
