import React, { useEffect, useState } from 'react'
import networkRequest from '../../http/api';
import { UrlEndPoint } from '../../http/apiConfig';
import { Container } from '../../assets/css/home';
import Card from '../../components/Card';

const Category = ({ Category }) => {
    const [videos, setVideos] = useState([])

    const fetchVideos = async () => {
        try {
            const url = `${Category === 'live' ? UrlEndPoint.activeLive : UrlEndPoint.Category(Category)}`
            const results = await networkRequest({ url })
            setVideos(results)
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    useEffect(() => {
        fetchVideos()
    }, [Category])

    return (
        <Container>
            {videos && videos.length > 0 ? (
                videos?.map((video) => {
                    return (
                        <Card key={video?._id} video={video} />
                    )
                })
            ) : (<p>{`No ${Category} Videos`}</p>)}
        </Container>
    )
}

export default Category