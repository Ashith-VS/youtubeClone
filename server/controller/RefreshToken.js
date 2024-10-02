import Token from "../model/RefreshToken.js";
import jwt from "jsonwebtoken";

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token is required" });
    try {
        // Verify if the refresh token is valid
        const existingToken = await Token.findOne({ token: refreshToken });
        if (!existingToken) return res.status(403).json({ message: "Refresh token is not valid" });

        // Verify token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
            if (err) return res.status(403).json({ message: "Token is invalid" });

            // Generate new access token
            const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
            res.json({ accessToken });
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Logout Route (to invalidate refresh tokens)
export const logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token is required" });
    // Remove refresh token from database
    await Token.findOneAndDelete({ token: refreshToken });
    res.sendStatus(204);  // Success, no content
    // res.json({ message: "Logged out successfully" });
}