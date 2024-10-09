import React, { useEffect, useState } from 'react'
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import networkRequest from '../http/api';
import { UrlEndPoint } from '../http/apiConfig';
import { currentUserAuth } from '../redux/slice/commonSlice';
import { isEmpty } from 'lodash';
import { Container, Wrapper, Search, Input, Button, User } from "../assets/css/navbar"
import LiveTvIcon from '@mui/icons-material/LiveTv';

const Navbar = () => {
  const [q, setQ] = useState("");
  const { currentUser } = useSelector(state => state.common)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('auth_token');
  const location = useLocation(); 
 
  const fetchCurrentUser = async () => {
    try {
      const url = UrlEndPoint.currentUser
      const res = await networkRequest({ url })
      dispatch(currentUserAuth(res.user))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (token && isEmpty(currentUser)) {
      fetchCurrentUser();
    }
  }, [token, currentUser])

  const handleSearch = () => {
    if (q.trim()) {
      navigate(`/search?q=${q}`);
      setQ("");  // Clear the search input after navigating
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear search input when navigating to any page
  useEffect(() => {
    setQ(""); // Clear search input on any route change
  }, [location.pathname]); // Dependency on the current route path

  return (
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Search" onChange={(e) => setQ(e.target.value)} onKeyPress={handleKeyPress} value={q}/>
          <SearchOutlinedIcon onClick={handleSearch} />
        </Search>
        {currentUser ? (
          <User>
            <VideoCallOutlinedIcon onClick={() => { navigate('/upload') }} style={{cursor:'pointer'}}/>
            <LiveTvIcon onClick={() => { navigate('/live') }} style={{cursor:'pointer'}}/>
          </User>
        ) : (
          <Link to="signin" style={{ textDecoration: "none" }}>
            <Button>
              <AccountCircleOutlinedIcon />
              SIGN IN
            </Button>
          </Link>
        )}
      </Wrapper>
    </Container>
  )
}

export default Navbar