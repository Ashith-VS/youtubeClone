import User from "../model/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const isSignUp = async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body
        // Check if the name or email already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { name }]
        });
        if (existingUser) {
            if (existingUser.email === email && existingUser.name === name) {
                return res.status(400).json({ status: 400, message: 'Email and name already in use' });
            } else if (existingUser.email === email) {
                return res.status(400).json({ status: 400, message: 'Email already in use' });
            } else {
                return res.status(400).json({ status: 400, message: 'Name already in use' });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, avatar })
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred while registering the user", error: error.message });
    }
}


export const isSignIn = async (req, res) => {
    try {
        // const { name, password } = req.body
        const user = await User.findOne({ name: req.body.name });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });
        // const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'2h'})
        // res.json({ success: true, message: "User logged in successfully",token });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        const { password, ...others } = user._doc
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(others)
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred while logging in the user", error: error.message });
    }
}


export const isGoogleAuth = async (req, res) => {
    try {
        const user= await User.findOne({email: req.body.email})
        if(user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(user._doc)
        }else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: req.body.img,
                fromGoogle:true
            })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            res.cookie('access_token', token, { httpOnly: true }).status(200).json(newUser._doc)
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred while logging in the user", error: error.message });
    }
}