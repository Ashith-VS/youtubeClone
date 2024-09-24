import React, { useEffect, useState } from 'react'
import Card from '../../components/Card';
import networkRequest from '../../http/api';
import { UrlEndPoint } from '../../http/apiConfig';
import { Container } from "../../assets/css/home"

const Home = ({ type }) => {
  const [videos, setVideos] = useState([])

  const fetchVideos = async () => {
    try {
      const urls = [UrlEndPoint[type], UrlEndPoint.live]; // List all URLs
      const results = await Promise.all(urls.map((url) => networkRequest({ url })));
      setVideos(results.flat())  // Flatten the array of results
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // const fetchVideos = async () => {
  //   try {
  //     const url = UrlEndPoint[type]
  //     const res = await networkRequest({ url })
  //     return res
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // const fetchLiveVideos = async () => {
  //   try {
  //     const url = UrlEndPoint.live
  //     const res = await networkRequest({ url })
  //     return res;
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }


  useEffect(() => {
    // const fetchAllVideos = async () => {
    //     const [normalVideos, liveVideos,activeLive] = await Promise.all([fetchVideos(), fetchLiveVideos()]);
    //     // Merge the arrays, avoiding duplicates if necessary
    //     const allVideos = [...normalVideos, ...liveVideos];
    //     setVideos(allVideos);
    //   };
    // }
    // fetchAllVideos();
    fetchVideos()
  }, [type])

  return (
    <Container>
      {videos?.map((video) => (
        <Card key={video?._id} video={video} />
      ))}
    </Container>
  )
}

export default Home