import React, { useState } from 'react';
import styled from 'styled-components';
import networkRequest from '../../http/api';
import { UrlEndPoint } from '../../http/apiConfig';
import { loginFailure, loginSuccess } from '../../redux/slice/authSlice';
import {useDispatch} from 'react-redux'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignIn = () => {
  const dispatch =useDispatch()
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp ? UrlEndPoint.signUp : UrlEndPoint.signIn; // Dynamically choose the endpoint
    try {
      const res = await networkRequest({url,method: 'post',data: formData});
      dispatch(loginSuccess(res))
      setFormData({
        name: '',
        email: '',
        password: '',
      })
      console.log(isSignUp ? 'Sign Up Response: ' : 'Sign In Response: ', res);
    } catch (error) {
      // console.error(error);
      dispatch(loginFailure(error))
    }
  };

  const SignInWithGoogle=async()=>{
    signInWithPopup(auth,provider).then((result)=>{
// console.log(result)
const url=UrlEndPoint.google
networkRequest({url,method:'POST',data:{
  name:result.user.displayName,
  email:result.user.email,
  img:result.user.photoURL
}}).then((res)=>{
  // console.log('res:444 ', res);
  dispatch(loginSuccess(res))
})
    }).catch((error)=>{
      // console.error(error);
      dispatch(loginFailure(error))
    });
  }

  return (
    <Container>
      <Wrapper>
        <Title>{isSignUp ? 'Sign Up' : 'Sign In'}</Title>
        <SubTitle>to continue to VideoStreamer</SubTitle>
        <Input
          name="name"
          placeholder="username"
          onChange={handleChange}
          value={formData.name}
        />
        {isSignUp && (
          <Input
            name="email"
            placeholder="email"
            onChange={handleChange}
            value={formData.email}
          />
        )}
        <Input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
          value={formData.password}
        />
        <Button onClick={handleSubmit}>{isSignUp ? 'Sign Up' : 'Sign In'}</Button>

        <Button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : 'Create an account'}
        </Button>
        <Title>or</Title>
        <Button onClick={SignInWithGoogle}>Sign In with Google</Button>
      </Wrapper>
      <More>
        English (USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignIn;
