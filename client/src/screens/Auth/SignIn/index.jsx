import React, { useEffect, useState } from 'react';
import networkRequest from '../../../http/api';
import { UrlEndPoint } from '../../../http/apiConfig';
import { loginFailure, loginSuccess } from '../../../redux/slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../../services/firebase';
import { Container, Wrapper, Title, SubTitle, Input, Button, ErrorMessage } from "../../../assets/css/auth";
import { Link, useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';

const SignIn = () => {
  const { currentUser } = useSelector(state => state.common)
  console.log('currentUser: ', !isEmpty(currentUser));
  const [errors, setErrors] = useState({})
  const { error } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!isEmpty(currentUser)) {
      navigate('/'); // Redirect to home or any other route
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' })
    dispatch(loginFailure(null));
  };

  const handleValidation = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = handleValidation()
    if (!isEmpty(valid)) {
      setErrors(valid)
    } else {
      const url = UrlEndPoint.signIn; 
      try {
        const res = await networkRequest({ url, method: 'post', data: formData });
        if (res?.token) {
          localStorage.setItem('auth_token', res.token);
          dispatch(loginSuccess(res));
          navigate('/');
        }
        setFormData({ email: '', password: '' });
      } catch (error) {
        dispatch(loginFailure(error));
      }
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
          localStorage.setItem('auth_token', res?.token);
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
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Title>Sign In</Title>
        <SubTitle>to continue to VideoStreamer</SubTitle>
        <Input
          name="email"
          placeholder="email"
          onChange={handleChange}
          value={formData.email}
        />
        {errors?.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        <Input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
          value={formData.password}
        />
        {errors?.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        <Button onClick={handleSubmit}>Sign In</Button>
        <Title>or</Title>
        <Button onClick={SignInWithGoogle}>Sign In with Google</Button>
        <Title />
        <Link to={"/signup"} style={{ textDecoration: 'none', color: "inherit", fontSize: '14px' }} >
          Create an account? Sign Up here
        </Link>
      </Wrapper>
    </Container>
  );
};

export default SignIn;
