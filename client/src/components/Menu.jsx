import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logoicon from '../assets/images/icons/logos.jpg'
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Wrapper, Logo, Img, Item, Hr, Login, Button, Title } from "../assets/css/menu"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from '../redux/slice/commonSlice';
import { isEmpty } from 'lodash';
import axios from 'axios';
import { baseUrl, UrlEndPoint } from '../http/apiConfig';
import { categoryItems, menuItems, settingsItems } from '../constants/Icon_data/menuItem';

const Menu = ({ darkMode, setDarkMode }) => {
  const { currentUser } = useSelector(state => state.common)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    const res = await axios.post(baseUrl + UrlEndPoint.logOut, {}, { withCredentials: true }) //for passing refreshtoken in cookies
    // console.log('reslogout: ', res);
    localStorage.removeItem('auth_token');
    localStorage.clear()
    dispatch(logout());
    navigate('/')
  }

  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Img src={logoicon} />
            VideoStreamer
          </Logo>
        </Link>

        {/* Render menu items dynamically */}
        {menuItems?.map(({ path, icon, label, protected: isProtected }) => {
          // If the item is protected, check if the user is logged in
          if (isProtected && isEmpty(currentUser)) return null;

          return (
            <Link to={path} key={label} style={{ textDecoration: "none", color: "inherit" }}>
              <Item>
                {icon}
                {label}
              </Item>
            </Link>
          );
        })}


        <Hr />
        <Title>BEST OF VideoStreamer</Title>
        {categoryItems?.map(({ path, icon, label, protected: isProtected }) => {
          // If the item is protected, check if the user is logged in
          if (isProtected && isEmpty(currentUser)) return null;

          return (
            <Link to={path} key={label} style={{ textDecoration: "none", color: "inherit" }}>
              <Item>
                {icon}
                {label}
              </Item>
            </Link>
          );
        })}
        <hr />
        {/* Sign In/Out Logic */}
        {!isEmpty(currentUser) ? (
          <>
            <Item onClick={() => navigate('/profile')}>
              <AccountCircleIcon />
              Profile
            </Item>
            <Button onClick={handleLogout}>
              <LogoutIcon />
              Sign Out
            </Button>
          </>
        ) : (
          <Login>
            Sign in to like videos, comment, and subscribe.
            <Link to="signin" style={{ textDecoration: "none" }}>
              <Button>
                <AccountCircleOutlinedIcon />
                SIGN IN
              </Button>
            </Link>
          </Login>
        )}
        <Hr />
        {/* {settingsItems.map(({ path, icon, label, protected: isProtected }) => {
          // If the item is protected, check if the user is logged in
          if (isProtected && isEmpty(currentUser)) return null;
          return (
            <Link to={path} key={label} style={{ textDecoration: "none", color: "inherit" }}>
              <Item>
                {icon}
                {label}
              </Item>
            </Link>
          );
        })} */}

        <Item onClick={() => setDarkMode(!darkMode)}>
          <SettingsBrightnessOutlinedIcon />
          {darkMode ? "Light" : "Dark"} Mode
        </Item>
      </Wrapper>
    </Container>
  )
}

export default Menu