import React, { useState } from 'react';
import networkRequest from '../../../http/api';
import { UrlEndPoint } from '../../../http/apiConfig';
import { loginFailure, loginSuccess } from '../../redux/slice/authSlice';
import { useDispatch } from 'react-redux';
import { Container, Wrapper, Title, SubTitle, Input, Button, More, Links, Link } from "../../../assets/css/Signin"
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    const url = UrlEndPoint.signUp; 
    try {
      const res = await networkRequest({ url, method: 'post', data: formData });
      if (res?.token) {
        localStorage.setItem('auth_token', res.token);
        dispatch(loginSuccess(res));
        navigate('/signin');
      }
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      dispatch(loginFailure(error));
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign Up</Title>
        <SubTitle>to continue to VideoStreamer</SubTitle>
        <Input
          name="name"
          placeholder="username"
          onChange={handleChange}
          value={formData.name}
        />
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
        <Button onClick={handleSubmit}>Sign Up</Button>
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

export default SignUp;
