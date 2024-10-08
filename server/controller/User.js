import LiveStream from "../model/liveStream.js";
import User from "../model/User.js";
import Video from "../model/Video.js";
import History from "../model/History.js";

export const isUpdateUser = async (req, res) => {
    const { id } = req.params
    if (id === req.id) {
        try {
            // const updateUser = await User.findByIdAndUpdate(id, {
            //     $set: req.body
            // }, { new: true });
            // res.status(200).json(updateUser);
            // Fetch the current user data before updating
            const currentUser = await User.findById(id);
            if (!currentUser) return res.status(404).json("user not found");

            // Create an object to hold the updates
            const updates = {};

            // Check each field in req.body and add to updates if not empty
            for (const [key, value] of Object.entries(req.body)) {
                if (value) { // Only include fields that have a value
                    updates[key] = value;
                }
            }

            // Update user only if there are any updates to apply
            const updateUser = await User.findByIdAndUpdate(id, { $set: updates }, { new: true });

            res.status(200).json(updateUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(400).json({ message: 'Unauthorized' });
    }
}

export const isdeleteUser = async (req, res) => {
    const { id } = req.params
    if (id === req.id) {
        try {
            await User.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(400).json({ message: 'Unauthorized' });
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

export const toggleSubscription = async (req, res) => {
    const userId = req.id;
    const channelId = req.params.id;
    try {
        const user = await User.findById(userId)
        const isSubscribed = user.subscribedChannels.includes(channelId)
        if (!isSubscribed) {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { subscribedChannels: channelId }, // $addToSet prevents duplicates
            });
            await User.findByIdAndUpdate(channelId, {
                $inc: { subscribers: 1 },
            });
            const updatedUser = await User.findById(userId)
            res.status(200).json({ message: 'Subscribed successfully', updatedUser });
        } else {
            await User.findByIdAndUpdate(userId, {
                $pull: { subscribedChannels: channelId },
            });
            await User.findByIdAndUpdate(channelId, {
                $inc: { subscribers: -1 },
            });
            const updatedUser = await User.findById(userId)
            res.status(200).json({ message: 'Unsubscribed successfully', updatedUser });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const isLikeUser = async (req, res) => {
    const id = req.id; //from verifytoken
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
    const id = req.id; //from verifytoken
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

export const getUserVideos = async (req, res) => {
    try {
        const { id } = req.params
        const videos = await Video.find({ userId: id });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserLiveVideos = async (req, res) => {
    try {
        const { id } = req.params
        const videos = await LiveStream.find({ user: id, videoLive: true });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSubscribedChannels = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id).select('subscribedChannels')

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch details of each subscribed channel
        const subscribedChannelsDetails = await User.find({
            _id: { $in: user.subscribedChannels }, // Use $in to find all users whose IDs are in the subscribedChannels array
        }).select('name avatar subscribers bio'); // Select the fields you need for each subscribed channel

        res.status(200).json(subscribedChannelsDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export const isAddHistory = async (req,res) => {
    try {
        const { userId, videoId } = req.body;
       
        // Check if both IDs are provided
        if (!userId || !videoId) {
            return res.status(400).json({ message: 'User ID and Video ID are required.' });
        }
           // Check if the history entry already exists
           const existingHistory = await History.findOne({ userId, videoId });

           if (existingHistory) {
               // Optionally, update the existing entry instead of creating a new one
               // For example, updating the timestamp (if desired)
               existingHistory.watchedAt = new Date(); // Update the timestamp
               await existingHistory.save(); // Save the updated entry
               return res.status(200).json({ message: 'Watch history updated successfully.' });
           }
   
        // Create a new history entry
        const historyEntry = new History({
            userId,
            videoId,
           watchedAt: new Date(), // Record the timestamp when the video was watched
        });
        // console.log('historyEntry: ', historyEntry);
        // Save the history entry to the database
        await historyEntry.save();

        // Respond with a success message
        res.status(201).json({ message: 'Watch history recorded successfully.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getUserHistory = async (req, res) => {
    try {
       
        // Fetch history of watched videos
        const userHistory = await History.find({ userId: req.id })
            .sort({ watchedAt: -1 }) // Sort by the date watched
            .limit(20)
            .populate('videoId'); // Populate video details

        // console.log('userHistory: ', userHistory);
        res.status(200).json(userHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}