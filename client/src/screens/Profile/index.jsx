import React, { useEffect, useState } from 'react';
import { ProfileContainer, ProfileHeader, ProfileImage, Username, Subscribers, EditButton, Tabs, Tab, BioSection, Bio, VideoCard, VideoGrid, Thumbnail, VideoInfo, VideoTitle, VideoViews } from "../../assets/css/profile"
import { useSelector } from 'react-redux';
import { UrlEndPoint } from '../../http/apiConfig';
import networkRequest from '../../http/api';

const ProfilePage = () => {
  const { currentUser } = useSelector(state => state.common)
  const [activeTab, setActiveTab] = useState('videos');
  const [userVideos, setUserVideos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: 'Welcome to my YouTube channel where I share tech tutorials.',
    profileImage: 'https://via.placeholder.com/150',
  });
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchLiveVideos = async () => {
    try {
      const url = UrlEndPoint.live
      const res = await networkRequest({ url })
      setUserVideos(res)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchLiveVideos();
  }, []);

  return (
    <ProfileContainer>
      <ProfileHeader>
        {isEditing ? (
          <input
            type="file"
            name="username"
            value={profileData.image}
            onChange={handleInputChange}
          />) : (
          <ProfileImage src={currentUser?.image ? currentUser?.image : profileData.profileImage} alt="Profile" />)}
        {isEditing ? (
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleInputChange}
          />
        ) : (
          <Username>{currentUser?.name}</Username>
        )}
        <Subscribers>{currentUser?.subscribers} subscribers</Subscribers>
        <EditButton onClick={handleEditClick}>
          {isEditing ? 'Save' : 'Edit Profile'}
        </EditButton>
      </ProfileHeader>
      <BioSection>
        {isEditing ? (
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
          />
        ) : (
          <Bio>{profileData.bio}</Bio>
        )}
      </BioSection>
      <Tabs>
        <Tab active={activeTab === 'videos'} onClick={() => handleTabClick('videos')}>Videos</Tab>
        <Tab active={activeTab === 'playlist'} onClick={() => handleTabClick('playlist')}>Playlist</Tab>
        <Tab active={activeTab === 'lives'} onClick={() => handleTabClick('lives')}>Lives</Tab>
        <Tab active={activeTab === 'subscribed'} onClick={() => handleTabClick('subscribed')}>Subscribed</Tab>
      </Tabs>
      {activeTab === 'lives' && (
        <VideoGrid>
          {userVideos && userVideos.length > 0 ? (
            userVideos.map(video => (
              <VideoCard key={video.id}>
                <Thumbnail src={video.thumbnail} alt={video.title} />
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoViews>{video.views} views</VideoViews>
                </VideoInfo>
              </VideoCard>
            ))
          ) : (
            <p>No videos uploaded yet.</p>
          )}
        </VideoGrid>
      )}

      {/* Similar conditionally rendered content for other tabs */}
      {activeTab === 'playlist' && <p>Display Playlist Content</p>}
      {activeTab === 'videos' && <p>Display  Videos</p>}
      {activeTab === 'subscribed' && <p>Display Subscribed Channels</p>}
      {activeTab === 'about' && <p>About Content</p>}
    </ProfileContainer>
  );
};

export default ProfilePage;


