import styled from 'styled-components';
const ProfileContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 3px solid #ecf0f1;
`;

const Username = styled.h2`
  font-size: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Subscribers = styled.p`
  color: #7f8c8d;
`;

const EditButton = styled.button`
  padding: 8px 16px;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #34495e;
  }
`;

const Tabs = styled.div`
  display: flex;
  margin: 20px 0;
`;

const Tab = styled.div`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: ${({ active }) => (active ? '#3498db' : '#ecf0f1')};
  color: ${({ active }) => (active ? '#fff' : '#34495e')};
 
  cursor: pointer;
  border-radius: 20px;
  &:hover {
    background-color: ${({ active }) => (active ? '#2980b9' : '#bdc3c7')};
  }
`;

const BioSection = styled.div`
  margin-top: 20px;
`;

const Bio = styled.p`
  font-size: 16px;
  color: #34495e;
`;

const UploadButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c0392b;
  }
`;


const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 30px;
  margin-top: 60px;
`;

const VideoCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const VideoInfo = styled.div`
  padding: 10px;
`;

const VideoTitle = styled.h3`
  font-size: 18px;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const VideoViews = styled.p`
  font-size: 14px;
  color: #7f8c8d;
`;
export {ProfileContainer,ProfileHeader,ProfileImage,Username,Subscribers,EditButton,Tabs,Tab,BioSection,Bio,UploadButton,VideoCard,VideoGrid,Thumbnail,VideoInfo,VideoTitle,VideoViews}
