import React, { lazy, Suspense, useEffect, useState } from 'react'
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
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
// import Comment from './Comment';
// Lazy loading Comment component
const Comment = lazy(() => import('./Comment'));

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

  const data = { videoId, desc }
  const handleAddComment = async () => {
    setDesc('')
    if (!isEmpty(currentUser)) {
      const url = UrlEndPoint.addComment
      try {
        await networkRequest({ url, method: 'post', data });
        fetchComments()
      } catch (error) {
        console.error(error);
      }
    } else {
      toast.error('Please sign in to add a comment.')
      return;
    }
  }


  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.avatar} />
        <Input placeholder="Add a comment..." onChange={(e) => setDesc(e.target.value)} name='desc' value={desc} />
        {!isEmpty(desc) && <SendIcon onClick={handleAddComment} />}
      </NewComment>
      <Suspense fallback={<div>Loading ....</div>}>
        {comments.map((comment) => {
          return <Comment key={comment?._id} comment={comment} />
        }
        )}
      </Suspense>
    </Container>
  )
}

export default Comments