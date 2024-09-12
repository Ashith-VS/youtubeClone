import React, { useState } from 'react';
import networkRequest from '../../../http/api';
import { UrlEndPoint } from '../../../http/apiConfig';
import { loginFailure, loginSuccess } from '../../../redux/slice/authSlice';
import { useDispatch } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';
import { Container, Wrapper, Title, SubTitle, Input, Button, More, Links, Link } from "../../../assets/css/Signin";
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = UrlEndPoint.signIn; // Sign-in endpoint
    try {
      const res = await networkRequest({ url, method: 'post', data: formData });
      if (res?.token) {
        localStorage.setItem('auth_token', res.token);
        dispatch(loginSuccess(res));
      }
      setFormData({ email: '', password: '' });
    } catch (error) {
      dispatch(loginFailure(error));
    }
  };

  const SignInWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const url = UrlEndPoint.google;
        networkRequest({
          url,
          method: 'POST',
          data: {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          },
        }).then((res) => {
          dispatch(loginSuccess(res));
          navigate('/');
        });
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <SubTitle>to continue to VideoStreamer</SubTitle>
        <Input
          name="email"
          placeholder="email"
          onChange={handleChange}
          value={formData.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
          value={formData.password}
        />
        <Button onClick={handleSubmit}>Sign In</Button>
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
