import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { format } from "timeago.js"
import networkRequest from '../http/api';
import { UrlEndPoint } from '../http/apiConfig';
import { Container, Image, Details, ChannelImage, Texts, Title, ChannelName, Info } from "../assets/css/card"
import { formatViews } from '../constants/common';

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({})

  const fetchChannels = async () => {
    try {
      const url = UrlEndPoint.user(video?.userId)
      const res = await networkRequest({ url })
      setChannel(res)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (video?.userId) {
      fetchChannels()
    }
  }, [video?.userId])

  return (
    <Container type={type}>
      <Link to={video?.isActive === true ? `/live/${video?.streamId}` : `/video/${video?._id}`} style={{ textDecoration: "none" }}>
        <Image
          type={type}
          src={video?.imgUrl || video?.thumbnail}
        />
      </Link>
        <Link to={`profile/${channel?._id}`} style={{textDecoration:'none'}}>
      <Details type={type}>
        <ChannelImage
          type={type}
          src={channel?.avatar || channel?.thumbnail}
          alt='profile'
        />
        <Texts>
          {video?.isActive === true && <span style={{ color: 'red' }}>Live</span>}
          <Title>{video?.title}</Title>
          <ChannelName>{channel?.name}</ChannelName>
          <Info>{formatViews(video?.views)} views • {video.isActive === false ? `streamed ${format(video?.createdAt)}` : format(video?.createdAt)}</Info>
        </Texts>
      </Details>
        </Link>
    </Container>
  )
}

export default Card