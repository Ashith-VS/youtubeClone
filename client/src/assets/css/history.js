import styled from 'styled-components';

const HistoryContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #34495e;
  margin-bottom: 20px;
`;

const HistoryList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const HistoryItem = styled.li`
  display: flex;
  align-items: center; /* Center align items */
  padding: 10px;
  margin: 10px 0;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s; /* Transition for hover effect */

  &:hover {
    background-color: #ecf0f1; /* Change background on hover */
  }
`;

const Thumbnail = styled.img`
  width: 120px; /* Set a fixed width for thumbnails */
  height: 120px; /* Maintain aspect ratio */
  border-radius: 5px; /* Optional: Round the corners of the thumbnails */
  margin-right: 10px; /* Space between image and text */
  object-fit: cover; /* Ensure image scales proportionally */
`;

const ItemLabel = styled.span`
  color: #2c3e50;
  flex-grow: 1; /* Allow text to take up available space */
`;

const ItemTime = styled.span`
  color: #7f8c8d;
  white-space: nowrap; /* Prevent time from wrapping */
`;

const NoHistoryMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
`;

export {
    HistoryContainer,
    Title,
    HistoryList,
    HistoryItem,
    ItemLabel,
    ItemTime,
    NoHistoryMessage,
    Thumbnail,
};
