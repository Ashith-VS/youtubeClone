import React, { useEffect, useState } from 'react'
import networkRequest from '../../http/api';
import { UrlEndPoint } from '../../http/apiConfig';
import { Container } from '../../assets/css/home';
import Card from '../../components/Card';

const Live = () => {
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

    
    useEffect(() => {
        fetchVideos()
    }, [])
    
    return (
        <Container>
            {videos?.map((video) => {
            return(
                <Card key={video?._id} video={video} />
            )})}
        </Container>
    )
}

export default Live