import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, SignIn, Video } from '../screens';
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
              <Routes>
                <Route path="/" element={<Home type='random' />} />
                <Route path="/trends" element={<Home type='trend' />} />
                <Route path="/subscriptions" element={<Home type='sub' />} />
                <Route path="/video/:id" element={<Video />} />
                <Route path="/signin" element={<SignIn />} />
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  )
}

export default Router