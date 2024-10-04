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

        // Store refresh token in httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite:'lax',
            // secure: true,  // Only in production with HTTPS
            secure: false,// Set to true in production
            // sameSite:'None',//cross Site cookie
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });

        res.json({ success: true, message: "User logged in successfully", accessToken });
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

export const refreshAccessToken = async (req, res) => {
    const cookies = req.cookies
    // console.log('cookies: ', cookies);
    if (!cookies?.refreshToken) return res.status(400).json({ message: "unAuthorized" });
    const refreshToken = cookies.refreshToken
    // console.log('refreshToken: ', refreshToken);
    try {
        //   Verify token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(403).json({ message: "Token is invalid || Forbidden " });

            // Generate new access token
            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.json({ accessToken });
        })
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

// Logout Route (to invalidate refresh tokens)
export const logout = async (req, res) => {
    const cookies = req.cookies
    // console.log('cookieslogout: ', cookies);
    if (!cookies?.refreshToken) return res.status(400).json({ message: "unauthorized" });
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: false });
    res.status(200).json({ message: "Cookies cleared" });
}