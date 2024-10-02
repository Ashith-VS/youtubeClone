import User from "../model/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Token from "../model/RefreshToken.js"

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

// Helper function to generate tokens
const generateTokens = (user) => {
    // Generate access token (short-lived)
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    // Generate refresh token (longer-lived)
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '2d' });
    return { accessToken, refreshToken };
};


export const isSignIn = async (req, res) => {
    try {
        // const { name, password } = req.body
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        // Validate password
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });
        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user)

        // // Generate access token (short-lived)
        // const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        // // Generate refresh token (longer-lived)
        // const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '5d' })

        // Save refresh token to the database
        const token = new Token({ userId: user._id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        await token.save();

        res.json({ success: true, message: "User logged in successfully", accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred while logging in the user", error: error.message });
    }
}


export const isGoogleAuth = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
            res.json({ success: true, message: "User logged in successfully", accessToken });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: req.body.img,
                fromGoogle: true
            })
            await newUser.save()
            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
            res.json({ success: true, message: "User logged in successfully", accessToken });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred while logging in the user", error: error.message });
    }
}

export const isCurrentUser = async (req, res) => {
    try {
        const userId = req.id //from header token
        const user = await User.findById(userId).select('-password')
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ status: 200, user })
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data' });
    }
}

