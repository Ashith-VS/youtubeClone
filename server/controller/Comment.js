import Comment from "../model/Comment.js"
import Video from "../model/Video.js"


export const addComment=async(req,res)=>{
    try {
        const newComment =new Comment({...req.body,userId:req.id})
        await newComment.save()
        res.status(201).json(newComment)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getAllComments=async(req,res)=>{
    try {
        const comments = await Comment.find({videoId:req.params.videoId})
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const deleteComment=async(req,res)=>{
    try {
        const comment = await Comment.findById(req.params.id)
        const video =await Video.findById(req.params.id)
        if(req.user.id === comment.userId || req.user.id === video.userId){
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json({message: 'Comment deleted'})
        }else{
            res.status(400).json({message: 'Unauthorized'})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

