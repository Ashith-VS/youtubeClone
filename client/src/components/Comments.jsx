import React, { useEffect, useState } from 'react'
import Comment from './Comment';
import { UrlEndPoint } from '../http/apiConfig';
import networkRequest from '../http/api';
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import {
  Container,
  NewComment,
  Avatar,
  Input
} from "../assets/css/comments"

const Comments = ({ videoId }) => {
  const [desc, setDesc] = useState('');
  const { currentUser } = useSelector(state => state.common)
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const url = UrlEndPoint.comments(videoId)
      const res = await networkRequest({ url });
      setComments(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const handleAddComment = async () => {
    const data = { videoId, desc }
    const url = UrlEndPoint.addComment
    try {
      await networkRequest({ url, method: 'post', data });
      setDesc('')
      fetchComments()
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.avatar} />
        <Input placeholder="Add a comment..." onChange={(e) => setDesc(e.target.value)} name='desc' value={desc} />
        <SendIcon onClick={handleAddComment} />
      </NewComment>
      {comments.map((comment) => {
        return <Comment key={comment?._id} comment={comment} />
      }
      )}
    </Container>
  )
}

export default Comments