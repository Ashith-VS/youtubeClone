import React, { useState } from 'react';
import networkRequest from '../../http/api';
import { UrlEndPoint } from '../../http/apiConfig';
import { loginFailure, loginSuccess } from '../../redux/slice/authSlice';
import {useDispatch} from 'react-redux'
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';
import{ Container, Wrapper, Title, SubTitle, Input, Button, More, Links, Link }from "../../assets/css/Signin"

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
      if(res?.token) return localStorage.setItem('auth_token', res.token);
      // dispatch(loginSuccess(res))
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
  dispatch(loginSuccess(res))
})
    }).catch((error)=>{
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
