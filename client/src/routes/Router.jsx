import React, { Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GetStreaming, Home, Category, LiveStreamming, Profile, Search, SignIn, SignUp, UploadVideo, Video } from '../screens';
import styled, { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from '../utils/Theme';
import Navbar from '../components/Navbar';
import Menu from '../components/Menu';

const Container = styled.div`
display: flex;`

const Main = styled.div`
flex: 7;
background-color: ${({ theme }) => theme.bg};`

const Wrapper = styled.div`
padding: 22px 96px;
`;

const Router = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/" element={<Home type='random' />} />
                <Route path="/trends" element={<Home type='trend' />} />
                <Route path="/subscriptions" element={<Home type='sub' />} />
                <Route path="/video/:id" element={<Video />} />
                <Route path="/search" element={<Search />} />
                <Route path="/upload" element={<UploadVideo />} />
                <Route path="/live" element={<LiveStreamming />} />
                <Route path="/livelist" element={<Category Category='live' />} />
                <Route path="/music" element={<Category Category='music'/>} />
                <Route path="/sports" element={<Category Category='sports'/>} />
                <Route path="/gaming" element={<Category Category='game'/>} />
                <Route path="/movies" element={<Category Category='movies'/>} />
                <Route path="/news" element={<Category Category='news'/>} />
                <Route path="/live/:id" element={<GetStreaming />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
              </Suspense>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  )
}

export default Router