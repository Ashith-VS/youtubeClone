import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f4f4f4;
  text-align: center;
  padding: 20px;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  color: #2c3e50;
  margin: 0;
`;

const Message = styled.h2`
  font-size: 2rem;
  color: #2c3e50;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 10px 0;
`;

const StyledLink = styled(Link)`
  font-size: 1rem;
  color: white;
  background-color: #2c3e50;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;

  &:hover {
    background-color: #34495e;
  }
`;

export {
    Container,
    ErrorCode,
    Message,
    Description,
    StyledLink,
}