import React, { useEffect, useState } from 'react'
import { format } from 'timeago.js';
import networkRequest from '../http/api';
import { UrlEndPoint } from '../http/apiConfig';
import {Container,
  Avatar,
  Details,
  Name,
  Date,
  Text}from "../assets/css/comment"
const Comment = ({comment}) => {
const [CommentedUser,setCommentedUser]=useState({})

const fetchCommentedUser=async()=>{
  try {
    const url =UrlEndPoint.user(comment?.userId)
   const res= await networkRequest({url})
   setCommentedUser(res)
  } catch (error) {
    console.error(error)
  }
  }
useEffect(() => {
  fetchCommentedUser()
}, [])

  return (
    <Container>
    <Avatar src={CommentedUser?.avatar} />
    <Details>
      <Name>
        {CommentedUser?.name} <Date>{format(comment?.createdAt)}</Date>
      </Name>
      <Text>{comment?.desc}</Text>
    </Details>
  </Container>
  )
}

export default Comment