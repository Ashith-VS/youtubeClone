import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.bg};
  padding: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 10px;
  padding: 30px 40px;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 5px;
  padding: 10px;
  background-color: transparent;
  margin-bottom: 10px;
  &:focus {
    border-color: ${({ theme }) => theme.text};
    outline: none;
  }
`;

const Desc = styled.textarea`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 5px;
  padding: 10px;
  background-color: transparent;
  resize: vertical;
  outline: none;
  margin-bottom: 10px;
  &:focus {
    border-color: ${({ theme }) => theme.text};
  }
`;

const Button = styled.button`
  border-radius: 5px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  margin-top: 20px;
  align-self: center;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${({ theme }) => theme.textSoft};
    color: ${({ theme }) => theme.bgLighter};
  }
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.text};
  align-self: flex-start; /* Align labels to the left */
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin: 5px 0;
  padding: 5px 10px;
  background-color: #ffdada;
  border-radius: 5px;
  width: 100%;
`;

// Export the styled components
export { Container, Wrapper, Title, Input, Desc, Button, Label, ErrorMessage };
