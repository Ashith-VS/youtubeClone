import React, { useEffect, useState } from 'react'
import networkRequest from '../../http/api';
import { UrlEndPoint } from '../../http/apiConfig';
import { Container } from '../../assets/css/home';
import Card from '../../components/Card';
import { useParams } from 'react-router-dom';

const Live = () => {
    const { id } = useParams()
    const [videos, setVideos] = useState([])

    const fetchVideos = async () => {
        try {
            const url = UrlEndPoint.activeLive
            const results = await networkRequest({ url })
            setVideos(results)
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };
    const fetchLiveVideo = async () => {
        try {
          const url = UrlEndPoint.findlive(id)
          const res = await networkRequest({ url })
       
        } catch (error) {
          console.error(error);
        }
      }
    

    useEffect(() => {
        fetchVideos()
    }, [])

    return (
        <Container>
            {videos?.map((video) => (
                <Card key={video?._id} video={video} />
            ))}
        </Container>
    )
}

export default Live