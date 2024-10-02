import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Card from '../../components/Card';
import { UrlEndPoint } from '../../http/apiConfig';
import networkRequest from '../../http/api';
import { useLocation } from 'react-router-dom';
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Search = () => {
    const [videos, setVideos] = useState([]);
    const query =useLocation().search

    useEffect(()=>{
       const fetchVideos = async()=>{
        try {
        const url = UrlEndPoint.search(query)
         const res = await networkRequest({url})
         setVideos(res)

        } catch (error) {
            console.error(error)
        }
       }
       fetchVideos()
    },[query]);

  return (
    <Container>
        {videos.length > 0 ?(videos.map((video)=>{
            return <Card key={video?._id} video={video}/>;
        })):(<h2>No results found</h2>)}
    </Container>
  )
}

export default Search