import LiveStream from "../model/liveStream.js";

// Start a new live stream
export const startLiveStream = async (req, res) => {
    try {
        const { title, description,streamId,videoUrl,thumbnail } = req.body;
        const newStream = new LiveStream({
            streamId,  // unique identifier for the live stream
            title,
            description,
            user: req.id,
            isActive: true,
            thumbnail,
            videoUrl,  // will store the video URL for later use
        });
        await newStream.save();
        res.status(201).json(newStream);
    } catch (error) {
        res.status(500).json({ message: 'Error starting live stream', error });
    }
};

export const stopLiveStream = async (req, res) => {
    try {
        const { streamId, videoUrl } = req.body;
        // Find the live stream by ID
        const liveStream = await LiveStream.findOne({ streamId });
        if (!liveStream) {
            return res.status(404).json({ message: 'Live stream not found' });
        }
        if (liveStream.user.toString() !== req.id) {
            return res.status(403).json({ message: 'Unauthorized to stop this stream' });
        }
        liveStream.isActive = false;
        liveStream.videoUrl = videoUrl;  // store the video URL for later use
        await liveStream.save();
        res.status(200).json({ status: 'ok', message: 'Live stream stopped' });
    } catch (error) {
        res.status(500).json({ message: 'Error stopping live stream', error });
    }
};

// Get all active live streams
export const getAllActiveLiveStreams = async (req, res) => {
    try {
        const liveStreams = await LiveStream.find({ isActive: true }).populate('user', 'username');
        res.status(200).json(liveStreams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching live streams', error });
    }
};

// Get all  live streams
export const getAllLiveStreams = async (req, res) => {
    try {
        const liveStreams = await LiveStream.find({ isActive: false }).populate('user', 'username');
        res.status(200).json(liveStreams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching live streams', error });
    }
};


// Get a specific live stream by its ID
export const getLiveStreamById = async (req, res) => {
    try {
        const liveStream = await LiveStream.findById(req.params.id);
        if (!liveStream) {
            return res.status(404).json({ message: 'Live stream not found' });
        }
        res.status(200).json(liveStream);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching live stream', error });
    }
};