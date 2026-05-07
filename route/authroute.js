import exp from "express"; // importing express
import bcrypt from "bcrypt"; // for password hashing
import jwt from "jsonwebtoken"; // for generating tokens
import { UserModel } from "../models/UserModel.js"; // importing user schema

export const authRouter = exp.Router(); // creating router instance

// REGISTER
authRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body; // get data from request body

        
    const existingUser = await UserModel.findOne({ email }); // check if user already exists in DB
    
    if (existingUser) return res.status(400).json({ message: "User already exists" }); // if exists, stop here
    
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password
        const newUser = new UserModel({ username, email, password: hashedPassword }); // create new user object
    
        await newUser.save(); // save to MongoDB
    
        res.status(201).json({ message: "User registered successfully" }); // send success response
    } catch (error) {
    
        res.status(500).json({ message: "Server error", error: error.message }); // catch any errors
    }
});


// LOGIN
authRouter.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body; // get email and password from request body
        const user = await UserModel.findOne({ email }); // find user in DB by email

        if (!user) return res.status(404).json({ message: "User not found" }); // if no user, stop here

        const isPasswordValid = await bcrypt.compare(password, user.password); // compare passwords
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" }); // if wrong, stop here

        const token = jwt.sign( // generate JWT token
            { userId: user._id, username: user.username }, // payload inside token
            process.env.JWT_SECRET, // secret key from .env
            { expiresIn: "1d" } // token expires in 1 day
        );

        res.status(200).json({ message: "Login successful", token, username: user.username }); // send token
    } catch (error) {

        res.status(500).json({ message: "Server error", error: error.message }); // catch any errors
    }

});

// LOGOUT
authRouter.post("/logout", (req, res) => {

    res.status(200).json({ message: "Logged out successfully" }); // logout handled on frontend

});