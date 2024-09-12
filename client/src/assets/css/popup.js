// import styled from "styled-components";

// const Container = styled.div`
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   top: 0;
//   left: 0;
//   background-color: #000000a7;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const Wrapper = styled.div`
//   width: 600px;
//   height: 600px;
//   background-color: ${({ theme }) => theme.bgLighter};
//   color: ${({ theme }) => theme.text};
//   padding: 20px;
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   position: relative;
// `;
// const Close = styled.div`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   cursor: pointer;
// `;
// const Title = styled.h1`
//   text-align: center;
// `;

// const Input = styled.input`
//   border: 1px solid ${({ theme }) => theme.soft};
//   color: ${({ theme }) => theme.text};
//   border-radius: 3px;
//   padding: 10px;
//   background-color: transparent;
//   z-index: 999;
// `;
// const Desc = styled.textarea`
//   border: 1px solid ${({ theme }) => theme.soft};
//   color: ${({ theme }) => theme.text};
//   border-radius: 3px;
//   padding: 10px;
//   background-color: transparent;
//   z-index: 1001; /* Same as Input */
//   resize: vertical; /* Allow textarea resizing */
//   outline: none; /* Remove default outline */
//   &:focus {
//     border-color: ${({ theme }) => theme.text}; /* Add a border color on focus for better UX */
//   }
// `;
// const Button = styled.button`
//   border-radius: 3px;
//   border: none;
//   padding: 10px 20px;
//   font-weight: 500;
//   cursor: pointer;
//   background-color: ${({ theme }) => theme.soft};
//   color: ${({ theme }) => theme.textSoft};
// `;
// const Label = styled.label`
//   font-size: 14px;
// `;

// export { Container, Wrapper, Close, Title, Input, Desc, Button, Label };
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  max-width: 90%; /* Ensure it fits smaller screens */
  height: auto; /* Adjust height dynamically */
  max-height: 90vh; /* Prevent it from going out of the viewport */
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 30px 40px; /* Added padding for better spacing */
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  border-radius: 10px; /* Rounded corners for a modern look */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Add a shadow effect */
  overflow-y: auto; /* Allow scrolling if content exceeds height */
`;

const Close = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  font-size: 18px; /* Increased font size for better visibility */
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px; /* Space below the title */
  font-size: 24px;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 5px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
  margin-bottom: 5px; /* Add margin below input */
  &:focus {
    border-color: ${({ theme }) => theme.text}; /* Border color on focus */
  }
`;

const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 5px;
  padding: 10px;
  background-color: transparent;
  z-index: 1001;
  resize: vertical;
  outline: none;
  margin-bottom: 5px; /* Add margin below textarea */
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
  margin-top: 20px; /* Space above button */
  align-self: center; /* Center the button */
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px; /* Add space between label and input */
  color: ${({ theme }) => theme.text};
`;

// New Error Message Style
const ErrorMessage = styled.p`
  color: red; /* Error text color */
  font-size: 12px; /* Smaller font size for error */
  margin: 5px 0 10px; /* Spacing around the error message */
  padding: 5px 10px; /* Padding to make it look nicer */
  background-color: #ffdada; /* Light red background for visibility */
  border-radius: 5px; /* Rounded corners for error box */
`;

export { Container, Wrapper, Close, Title, Input, Desc, Button, Label, ErrorMessage };
