import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Card from '../../components/Card';
import networkRequest from '../../http/api';
import { UrlEndPoint } from '../../http/apiConfig';
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const Home = ({type}) => {
  const [videos,setVideos]=useState([])

   const fetchVideos=async()=>{
    try {
    const url = UrlEndPoint[type]
    const res =await networkRequest({url})
      setVideos(res)
    } catch (error) {
      console.error(error)
    }
   }

  useEffect(()=>{
fetchVideos()
   },[type])

  return (
    <Container>
      {videos.map((video)=>(
       <Card key={video?._id} video={video}/>
      ))}
</Container>
  )
}

export default Home