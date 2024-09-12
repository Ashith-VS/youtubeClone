import React, { useEffect, useState } from 'react'
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import networkRequest from '../http/api';
import { UrlEndPoint } from '../http/apiConfig';
import { currentUserAuth } from '../redux/slice/commonSlice';
import { isEmpty } from 'lodash';
import {Container,Wrapper,Search,Input,Button,User} from "../assets/css/navbar"
import Popup from './Popup';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { currentUser } = useSelector(state => state.common)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('auth_token');

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
  }, [])

  return (
    <>
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Search" onChange={(e)=>setQ(e.target.value)} />
          <SearchOutlinedIcon onClick={()=>navigate(`/search?q=${q}`)}/>
        </Search>
        {currentUser ? (
          <User>
            <VideoCallOutlinedIcon onClick={() => {setOpen(true)}} />
            {/* <img src={currentUser?.avatar} style={{ width: '32px', height: "32px", borderRadius: "50%", backgroundColor: "#999"}} /> */}
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
    {open && <Popup setOpen={setOpen}/>}
    </>
  )
}

export default Navbar