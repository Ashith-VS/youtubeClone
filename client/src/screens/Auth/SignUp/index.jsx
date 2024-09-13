import React, { useState } from 'react';
import networkRequest from '../../../http/api';
import { UrlEndPoint } from '../../../http/apiConfig';
import { RegistrationFailure } from '../../../redux/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Wrapper, Title, SubTitle, Input, Button, ErrorMessage } from "../../../assets/css/auth"
import { Link, useNavigate } from 'react-router-dom';
import {isEmpty} from 'lodash'

const SignUp = () => {
  const { error } = useSelector(state => state.auth)
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]:''})
    dispatch(RegistrationFailure(null))
  };

  const handleValidation = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/i.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid =handleValidation()
    if(!isEmpty(valid)) {
      setErrors(valid)
      return;
    }else{
      const url = UrlEndPoint.signUp;
      try {
        const res = await networkRequest({ url, method: 'post', data: formData });
        if (res) {
          navigate('/signin');
        }
        setFormData({ name: '', email: '', password: '' });
      } catch (error) {
        dispatch(RegistrationFailure(error));
      }
    }
  };

  return (
    <Container>
      <Wrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
        <Title>Sign Up</Title>
        <SubTitle>to continue to VideoStreamer</SubTitle>
        <Input
          name="name"
          placeholder="username"
          onChange={handleChange}
          value={formData.name}
        />
       {errors?.name &&<ErrorMessage>{errors.name}</ErrorMessage>}
        <Input
          name="email"
          placeholder="email"
          onChange={handleChange}
          value={formData.email}
        />
        {errors?.email &&<ErrorMessage>{errors.email}</ErrorMessage>}
        <Input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
          value={formData.password}
        />
        {errors?.password &&<ErrorMessage>{errors.password}</ErrorMessage>}
        <Button onClick={handleSubmit}>Sign Up</Button>
        <Title />
        <Link to={"/signin"} style={{ textDecoration: 'none', color: "inherit", fontSize: '14px' }}>Already have an account? Sign In</Link>
      </Wrapper>
    </Container>
  );
};

export default SignUp;
