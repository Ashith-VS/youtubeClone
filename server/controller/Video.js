import User from "../model/User.js"
import Video from "../model/Video.js"

export const addVideo = async (req, res) => {
    try {
        const newVideo = new Video({ userId: req.id, ...req.body })
        await newVideo.save()
        res.status(200).json(newVideo)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const updateVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
        if (!video) return res.status(404).json({ message: 'Video not found' })
        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })
            res.status(200).json(updatedVideo)
        } else {
            res.status(400).json({ message: 'Unauthorized' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
        if (!video) return res.status(404).json({ message: 'Video not found' })
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id)
            res.status(200).json({ success: true, message: "video successfully deleted" })
        } else {
            res.status(400).json({ message: 'Unauthorized' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
        if (!video) return res.status(404).json({ message: 'Video not found' })
        res.status(200).json(video)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const addView = async (req, res) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        })
        res.status(200).json({ message: 'View added' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const randomVideo = async (req, res) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }])
        res.status(200).json(videos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const trendVideo = async (req, res) => {
    try {
        const videos = await Video.find().sort({ views: -1 })
        // -1 give most view videos 1 give less view videos
        res.status(200).json(videos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const subscribedVideo = async (req, res) => {
    try {
        const user = await User.findById(req.id)
        const subscribedChannels = await user.subscribedChannels
        const list =await Promise.all(subscribedChannels.map(chanelId=>{
            return Video.find({userId:chanelId})
        }))
        // console.log('list: ', list);
        res.status(200).json(list)
        // res.status(200).json(list.flat().sort(a,b)=>b.createdAt-a.createdAt)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getByTags = async (req, res) => {
    const tags = req.query.tags.split(',')
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20)
        res.status(200).json(videos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getBySearch = async (req, res) => {
    const query = req.query.q
    try {
        const videos = await Video.find({ title: { $regex: query, $options: "i" } }).limit(40)
        res.status(200).json(videos)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
