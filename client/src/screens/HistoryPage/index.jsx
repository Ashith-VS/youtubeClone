import React, { useEffect, useState } from 'react';
import { HistoryContainer, HistoryItem, HistoryList, ItemLabel, ItemTime, NoHistoryMessage, Title, Thumbnail } from '../../assets/css/history';
import { UrlEndPoint } from '../../http/apiConfig';
import networkRequest from '../../http/api';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const url = UrlEndPoint.userHistory
            const res = await networkRequest({ url })
            setHistory(res);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <HistoryContainer>
            <Title>History</Title>
            <HistoryList>
                {history.length > 0 ? (
                    history.map((item, index) => (
                        <Link to={`/video/${item?.videoId?._id}`}>
                            <HistoryItem key={index}>
                                <Thumbnail src={item?.videoId?.thumbnail || item?.videoId?.imgUrl} alt={item?.videoId?.title} />
                                <ItemLabel>{item?.videoId?.title}</ItemLabel>
                                <ItemTime>{format(item.watchedAt)}</ItemTime> {/* Format time */}
                            </HistoryItem>
                        </Link>
                    ))
                ) : (
                    <NoHistoryMessage>No history available</NoHistoryMessage>
                )}
            </HistoryList>
        </HistoryContainer>
    );
};

export default HistoryPage;
