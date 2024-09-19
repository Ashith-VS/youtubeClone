import styled from 'styled-components';

// const Container = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: flex-start;
//   width: 100%;
//   height: 100vh;
//   background-color: ${({ theme }) => theme.bg};
//   color: ${({ theme }) => theme.text};
//   padding: 20px;
//   box-sizing: border-box;
// `;

// const VideoSection = styled.div`
//   flex: 2;
//   background-color: ${({ theme }) => theme.bgLighter};
//   border: 1px solid ${({ theme }) => theme.soft};
//   border-radius: 10px;
//   height: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   padding: 20px;
// `;

// const VideoPlayer = styled.div`
//   width: 100%;
//   height: 100%;
//   background-color: black; /* Placeholder for video player */
//   border-radius: 10px;
// `;

// const ChatSection = styled.div`
//   flex: 1;
//   background-color: ${({ theme }) => theme.bgLighter};
//   border: 1px solid ${({ theme }) => theme.soft};
//   border-radius: 10px;
//   height: 100%;
//   margin-left: 20px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   padding: 20px;
// `;

// const ChatHeader = styled.div`
//   font-size: 18px;
//   font-weight: bold;
//   margin-bottom: 10px;
// `;

// const ChatMessages = styled.div`
//   flex: 1;
//   overflow-y: auto;
//   margin-bottom: 10px;
//   background-color: ${({ theme }) => theme.bg};
//   padding: 10px;
//   border-radius: 5px;
//   box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
// `;

// const ChatInputContainer = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 10px;
// `;

// const ChatInput = styled.input`
//   flex: 1;
//   padding: 10px;
//   border: 1px solid ${({ theme }) => theme.soft};
//   border-radius: 5px;
//   background-color: transparent;
//   color: ${({ theme }) => theme.text};
//   &:focus {
//     outline: none;
//     border-color: ${({ theme }) => theme.text};
//   }
// `;

// const SendButton = styled.button`
//   padding: 10px 20px;
//   background-color: ${({ theme }) => theme.soft};
//   color: ${({ theme }) => theme.textSoft};
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   &:hover {
//     background-color: ${({ theme }) => theme.textSoft};
//     color: ${({ theme }) => theme.bgLighter};
//   }
// `;

// export { Container, VideoSection, VideoPlayer, ChatSection, ChatHeader, ChatMessages, ChatInputContainer, ChatInput, SendButton };
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  box-sizing: border-box;
`;
const StreamInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 8px rgba(38, 143, 255, 0.3);
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  max-width: 400px;
  min-height: 100px;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  resize: vertical;  // Allows resizing vertically

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 8px rgba(38, 143, 255, 0.3);
  }
`;
const VideoSection = styled.div`
  flex: 2;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 10px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
`;

const VideoPlayer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  background-color: black; /* Placeholder for video player */
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;

const ChatSection = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 10px;
  height: 100%;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

const ChatHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  background-color: ${({ theme }) => theme.bg};
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 5px;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.text};
  }
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.textSoft};
    color: ${({ theme }) => theme.bgLighter};
  }
`;

const PlayPauseButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.textSoft};
    color: ${({ theme }) => theme.bgLighter};
  }`
const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

export { Container, VideoSection, VideoPlayer, ChatSection, ChatHeader, ChatMessages, ChatInputContainer, ChatInput, SendButton, PlayPauseButton, StreamInfoSection, Input, Textarea, ErrorMessage };
