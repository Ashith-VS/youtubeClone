import React, { useEffect, useState } from 'react'
import { Container } from "../assets/css/recommendation"
import Card from './Card';
import { UrlEndPoint } from '../http/apiConfig';
import networkRequest from '../http/api';

const Recommendation = ({ tags }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const url = UrlEndPoint.recommendation(tags)
                const res = await networkRequest({ url });
                setVideos(res);
            } catch (error) {
                console.error(error)
            }
        }
        fetchVideos()
    }, [tags]);

    return (
        <Container>
            {videos.map(video => {
                return <Card type="sm" key={video?._id} video={video} />
            })}
        </Container>
    )
}

export default Recommendation