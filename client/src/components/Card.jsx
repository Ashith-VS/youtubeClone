import React, { useEffect, useState } from 'react'
import { Link} from "react-router-dom";
import {format} from "timeago.js"
import networkRequest from '../http/api';
import { UrlEndPoint } from '../http/apiConfig';
import {Container, Image, Details, ChannelImage, Texts, Title, ChannelName, Info} from "../assets/css/card"

const Card = ({type,video}) => {
  const [channel,setChannel]=useState({})

  const fetchChannels=async()=>{
   try {
     const url = UrlEndPoint.user(video?.userId)
    const res =await networkRequest({url})
     setChannel(res)
   } catch (error) {
     console.error(error)
   }
  }

 useEffect(()=>{
  if(video?.userId){
    fetchChannels()
  }
  },[video?.userId])


  return (
    <Link to={video?.isActive===true?`/live/${video?._id}`:`/video/${video?._id}`} style={{ textDecoration: "none" }}>
    <Container  type={type}>
    <Image
         type={type}
         src={video?.imgUrl}
       />
         <Details type={type}>
         <ChannelImage
           type={type}
           src={channel?.img}
           alt=''
         />
         <Texts>
           {video?.isActive===true&& <span style={{color:'red'}}>Live</span>}
           <Title>{video?.title}</Title>
           <ChannelName>{channel?.name}</ChannelName>
           <Info>{video?.views} views • {format(video?.createdAt)}</Info>
         </Texts>
       </Details>
   </Container>
   </Link>
  )
}

export default Card