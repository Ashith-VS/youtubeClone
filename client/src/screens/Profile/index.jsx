import React, { useEffect, useState } from 'react';
import { ProfileContainer, ProfileHeader, ProfileImage, Username, Subscribers, EditButton, Tabs, Tab, BioSection, Bio, VideoCard, VideoGrid, Thumbnail, VideoInfo, VideoTitle, VideoViews } from "../../assets/css/profile"
import { useDispatch, useSelector } from 'react-redux';
import { UrlEndPoint } from '../../http/apiConfig';
import networkRequest from '../../http/api';
import { Link, useParams } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from "uuid"
import { storage } from '../../services/firebase';
import { currentUserAuth } from '../../redux/slice/commonSlice';

const ProfilePage = () => {

  const { id } = useParams()
  const { currentUser } = useSelector(state => state.common)
  const userId = id ? id : currentUser?._id;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('videos');
  const [userVideos, setUserVideos] = useState([]);
  const [liveVideos, setLiveVideos] = useState([]);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: 'Welcome to my YouTube channel where I share tech tutorials.',
    avatar: 'https://via.placeholder.com/150',
  });
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const handleEditClick = async () => {
    setIsEditing(!isEditing);
    try {
      const url = UrlEndPoint.profileUpdate(currentUser._id)
      const res = await networkRequest({ url, method: 'put', data: profileData });
      if (res) {
        dispatch(currentUserAuth(res))
      }
    } catch (error) {
      console.error(error)
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    uploadFile(file, 'imgUrl');
  }

  const uploadFile = (file, urlType) => {
    const filename = `${file?.name}_${uuid()}`// Generate a unique name using UUID
    const storageRef = ref(storage, `youtubeClone/${filename}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('progress: ', progress);
        // setPercentage((prev) => ({ ...prev, [urlType === 'imgUrl' ? 'imgPercentage' : 'videoPercentage']: Math.round(progress) }));
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            break;
        }
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfileData((prev) => ({ ...prev, avatar: downloadURL }));
        });
      }
    )
  }

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };
  const fetchSubscribedChannels = async (userId) => {
    try {
      const url = UrlEndPoint.subscribedChannels(userId);
      const res = await networkRequest({ url });
      setSubscribedChannels(res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLiveVideos = async (userId) => {
    try {
      const url = UrlEndPoint.userLive(userId)
      const res = await networkRequest({ url })
      setLiveVideos(res)
    } catch (error) {
      console.error(error)
    }
  }
  const fetchUserVideos = async (userId) => {
    try {
      const url = UrlEndPoint.userVideo(userId)
      const res = await networkRequest({ url })
      setUserVideos(res)
    } catch (error) {
      console.error(error)
    }
  }


  //  Fetch data when the profile page is opened or the id changes
  useEffect(() => {
    // Check if viewing own profile or other user's profile
    fetchProfileData(userId);
    fetchUserVideos(userId);
  }, [id]);


  // Function to fetch profile data of the user (either current user or other user)
  const fetchProfileData = async (userId) => {
    try {
      const url = UrlEndPoint.user(userId);  // Define an endpoint to fetch user profile by id
      const res = await networkRequest({ url });
      setProfileData(res);  // Save the fetched profile data
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <ProfileContainer>
      <ProfileHeader>
        {isEditing ? (
          <input
            type="file"
            name="avatar"
            onChange={handleUploadFile}
          />) : (
          <ProfileImage src={profileData.avatar ? profileData.avatar : currentUser?.image} alt="Profile" />)}
        {isEditing ? (
          <input
            type="text"
            name="name"
            placeholder='name'
            value={profileData.name}
            onChange={handleInputChange}
          />
        ) : (
          <Username>{profileData.name ? profileData.name : currentUser?.name}</Username>
        )}
        <Subscribers>{profileData.subscribers ? profileData.subscribers : currentUser?.subscribers} subscribers</Subscribers>
        {currentUser?._id === userId &&
          <EditButton onClick={handleEditClick}>
            {isEditing ? 'Save' : 'Edit Profile'}
          </EditButton>}
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
        <Tab active={activeTab === 'videos'} onClick={() => {
          handleTabClick('videos')
          fetchUserVideos(userId)
        }}>Videos</Tab>
        <Tab active={activeTab === 'lives'} onClick={() => {
          handleTabClick('lives')
          fetchLiveVideos(userId)
        }}>Lives</Tab>
        <Tab active={activeTab === 'subscribed'} onClick={() => {
          handleTabClick('subscribed')
          fetchSubscribedChannels(userId)
        }}>Subscribed</Tab>
      </Tabs>
      {activeTab === 'videos' && (
        <VideoGrid>
          {userVideos && userVideos.length > 0 ? (
            userVideos.map(video => (
              <VideoCard key={video._id}>
                <Link to={`/video/${video._id}`}>
                  <Thumbnail src={video.imgUrl} alt={video.title} />
                </Link>
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
      {activeTab === 'lives' && (
        <VideoGrid>
          {liveVideos && liveVideos.length > 0 ? (
            liveVideos.map(video => (
              <VideoCard key={video._id}>
                <Link to={`/video/${video._id}`}>
                  <Thumbnail src={video?.thumbnail} alt={video.title} />
                </Link>
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  {/* <VideoViews>{video.views} views</VideoViews> */}
                </VideoInfo>
              </VideoCard>
            ))
          ) : (
            <p>No lives uploaded yet.</p>
          )}
        </VideoGrid>
      )}


      {activeTab === 'subscribed' && (
        <div>
          {subscribedChannels.length > 0 ? (
            <div>
              {subscribedChannels.map((channel) => (
                <Link to={`/profile/${channel._id}`} style={{ textDecoration: 'none' }} key={channel._id}>
                  <div style={{ display: "flex" }}>
                    <img src={channel.avatar} alt={channel.name} width="50" />
                    <h3>{channel.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p>No subscribed channels yet.</p>
          )}
        </div>
      )}
    </ProfileContainer>
  );
};

export default ProfilePage;