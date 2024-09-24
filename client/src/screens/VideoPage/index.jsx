import React, { useEffect, useState } from 'react'
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from '../../components/Comments';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import networkRequest from '../../http/api';
import { UrlEndPoint } from '../../http/apiConfig';
import { format } from 'timeago.js';
import { fetchSuccess } from '../../redux/slice/videoSlice';
import { currentUserAuth } from '../../redux/slice/commonSlice';
import { Container, Content, VideoWrapper, Title, Details, Info, Buttons, Button, Hr, Channel, ChannelInfo, Image, ChannelDetail, ChannelName, ChannelCounter, Description, Subscribe, VideoFrame } from "../../assets/css/video"
import Recommendation from '../../components/Recommendation';
import { toast } from 'react-toastify';
import { isEmpty } from 'lodash';

const Video = () => {
  const { currentUser } = useSelector(state => state.common)
  const { currentVideo } = useSelector(state => state.video)
  console.log('currentVideo: ', currentVideo);
  const dispatch = useDispatch();
  const { id } = useParams()
  const [channel, setChannel] = useState({})

  const fetchLiveVideo=async()=>{
    try {
      const url = UrlEndPoint.findlive(id)
      const res = await networkRequest({ url })
      dispatch(fetchSuccess(res))
    } catch (error) {
      console.error(error)
    }
  }

  const addViews = async () => {
    try {
      const url = UrlEndPoint.views(id)
      await networkRequest({ url, method: 'put' })
    } catch (error) {
      console.error(error)
    }

  }

  const fetchData = async () => {
    try {
      const videoUrl = UrlEndPoint.video(id);
      const videoRes = await networkRequest({ url: videoUrl });
      dispatch(fetchSuccess(videoRes)); // Update video state

      // Fetch the channel data using userId from video response
      const userId = videoRes.userId;
      if (userId) {
        const userUrl = UrlEndPoint.user(userId);
        const userRes = await networkRequest({ url: userUrl });
        setChannel(userRes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    addViews();
    fetchLiveVideo(); // Fetch live video data when video id changes
  }, [id])


  const handleLikes = async () => {
    if (!isEmpty(currentUser)) {
      try {
        const url = UrlEndPoint.like(currentVideo?._id)
        await networkRequest({ url, method: 'put' })
        fetchData()
      } catch (error) {
        console.error(error)
      }
    } else {
      toast.error('Please login to like or dislike videos.')
    }
  }

  const handleDislikes = async () => {
    if (!isEmpty(currentUser)) {
      try {
        const url = UrlEndPoint.dislike(currentVideo?._id)
        await networkRequest({ url, method: 'put' })
        fetchData()
      } catch (error) {
        console.error(error)
      }
    } else {
      toast.error('Please login to like or dislike videos.')
    }
  }


  const handleSubscribe = async () => {
    if (!isEmpty(currentUser)) {
      try {
        if (channel?._id) {
          const url = UrlEndPoint.subscribe(channel?._id)
          const res = await networkRequest({ url, method: 'put' })
          dispatch(currentUserAuth(res?.updatedUser))
          fetchData()
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      toast.error('Please login to subscribe to channels.')
    }
  }

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame src={currentVideo?.videoUrl} controls />
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>{currentVideo?.views} views • {format(currentVideo?.createdAt)}</Info>
          <Buttons>
            <Button onClick={handleLikes}>
              {currentVideo?.likes?.includes(currentUser?._id) ? (<ThumbUpIcon />) : (<ThumbUpOutlinedIcon />)}{currentVideo?.likes?.length}
            </Button>
            <Button onClick={handleDislikes}>
              {currentVideo.dislikes?.includes(currentUser?._id) ? (<ThumbDownIcon />) : (<ThumbDownOffAltOutlinedIcon />)} Dislike
            </Button>
            <Button>
              <ReplyOutlinedIcon /> Share
            </Button>
            <Button>
              <AddTaskOutlinedIcon /> Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel?.avatar} />
            <ChannelDetail>
              <ChannelName>{channel?.name}</ChannelName>
              <ChannelCounter>{channel?.subscribers} subscribers</ChannelCounter>
              <Description>
                {currentVideo?.description}
              </Description>
            </ChannelDetail>
          </ChannelInfo>
          <Subscribe onClick={handleSubscribe}>{currentUser?.subscribedChannels?.includes(channel?._id) ? "SUBSCRIBED" : "SUBSCRIBE"}</Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo?._id} />
      </Content>
      <Recommendation tags={currentVideo?.tags} />
    </Container>
  )
}

export default Video