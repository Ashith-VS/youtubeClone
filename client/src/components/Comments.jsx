import React, { useEffect, useState } from 'react'
import Comment from './Comment';
import { UrlEndPoint } from '../http/apiConfig';
import networkRequest from '../http/api';
import { useSelector } from 'react-redux';
import { Container,
  NewComment,
  Avatar,
  Input}from "../assets/css/comments"

const Comments = ({videoId}) => {
  const {currentUser} = useSelector(state=>state.common)
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const url=UrlEndPoint.comments(videoId)
        const res = await networkRequest({url});
        setComments(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComments();
  }, [videoId]);

  return (
   <Container>
     <NewComment>
        <Avatar src={currentUser?.avatar} />
        <Input placeholder="Add a comment..." />
      </NewComment>
      {comments.map((comment) => {
        return <Comment key={comment?._id} comment={comment} />
      }
      )}
   </Container>
  )
}

export default Comments