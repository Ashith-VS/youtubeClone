import User from "../model/User.js";
import Video from "../model/Video.js";

export const isUpdateUser = async (req, res) => {
    const { id } = req.params
    if (id === req.user.id) {
        try {
            const updateUser = await User.findByIdAndUpdate(id, {
                $set: req.body
            }, { new: true });
            res.status(200).json(updateUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export const isdeleteUser = async (req, res) => {
    const { id } = req.params
    if (id === req.user.id) {
        try {
            await User.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export const isgetUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const isSubscribeUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedChannels: req.params.id, }
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        })
        res.status(200).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const isUnSubscribeUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedChannels: req.params.id, }
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        })
        res.status(200).json({ message: 'UnSubscribed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const isLikeUser = async (req, res) => {
    const id = req.user.id; //from verifytoken
    const videoId = req.params.vidid
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        })
        res.status(200).json({ message: 'video Liked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const isDislikeUser = async (req, res) => {
    const id = req.user.id; //from verifytoken
    const videoId = req.params.vidid
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        })
        res.status(200).json({ message: 'video DisLiked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}