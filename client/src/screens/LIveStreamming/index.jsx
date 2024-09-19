import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  VideoSection,
  VideoPlayer,
  ChatSection,
  ChatHeader,
  ChatMessages,
  ChatInputContainer,
  ChatInput,
  SendButton,
  PlayPauseButton,
  StreamInfoSection,
  Input,
  Textarea,
  ErrorMessage,
} from '../../assets/css/live';
import networkRequest from '../../http/api';
import { UrlEndPoint } from '../../http/apiConfig';
import { useSelector } from 'react-redux';
import { socket } from '../../common/common';

const LiveStreaming = () => {
  const {currentUser}=useSelector(state=>state.common)
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const localVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };
//   let mediaRecorder;
// const recordedChunks = [];

// const startRecording = (stream) => {
//   mediaRecorder = new MediaRecorder(stream);
  
//   mediaRecorder.ondataavailable = (event) => {
//     if (event.data.size > 0) {
//       recordedChunks.push(event.data);
//     }
//   };

//   mediaRecorder.onstop = () => {
//     const blob = new Blob(recordedChunks, {
//       type: 'video/webm'
//     });
//     const videoUrl = URL.createObjectURL(blob);

//     // Save video URL to the database or upload it to storage
//     console.log('Video URL:', videoUrl);
//     saveVideoToDB(videoUrl);
//   };

//   mediaRecorder.start();
// };

// const stopRecording = () => {
//   if (mediaRecorder) {
//     mediaRecorder.stop();
//   }
// };


  

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(config);
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate);
      }
    };
  };

  const handleReceiveAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleNewICECandidate = (candidate) => {
    peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const startStreaming = async () => {
    if (!formData.title || !formData.description) {
      setErrorMessage('Title and Description are required to start streaming');
      return;
    }
    setErrorMessage(''); 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      localStream.current = stream;

    //     // Start recording the stream
    // startRecording(stream);

      createPeerConnection();
      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', offer);

      // Save video metadata to the database
      const url = UrlEndPoint.liveStart
      const res = await networkRequest({ url, method: "post", data:formData })
      if (res) {
        localStorage.setItem('streamId', res._id)
      }
      setIsStreaming(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopStreaming = async () => {
    try {
      // Stop the local video and audio tracks
      localStream.current?.getTracks().forEach((track) => track.stop());

    //    // Stop recording
    // stopRecording();

      // Close the peer connection
      peerConnection.current?.close();
      peerConnection.current = null;

      // Clear video elements
      localVideoRef.current.srcObject = null;
      const url = UrlEndPoint.liveEnd;
      const streamId = localStorage.getItem('streamId');
      const res = await networkRequest({ url, method: 'post', data: { streamId } });

      if (res?.status === 'ok') {
        localStorage.removeItem('streamId');
      }
      setIsStreaming(false);
      setFormData({ title: '', description: '' })
    } catch (error) {
      console.error('Error stopping live stream:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        username:currentUser?.name ,
        message: message
      };
      socket.emit('chat-message', messageData);
      setMessage('');
    }
  };

  // const saveVideoToDB = async (videoUrl) => {
  //   try {
  //     const streamId = localStorage.getItem('streamId');
  //     if (!streamId) {
  //       console.error('Stream ID is missing');
  //       return;
  //     }

  //     const url = UrlEndPoint.liveEnd; // Assuming you use this endpoint to update stream info
  //     const response = await networkRequest({
  //       url,
  //       method: 'post',
  //       data: { streamId, videoUrl }
  //     });

  //     if (response?.status === 'ok') {
  //       console.log('Video URL saved successfully');
  //     } else {
  //       console.error('Failed to save video URL');
  //     }
  //   } catch (error) {
  //     console.error('Error saving video URL:', error);
  //   }
  // };

  useEffect(() => {
    socket.on('chat-message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
 
    socket.on('answer', handleReceiveAnswer);
    socket.on('ice-candidate', handleNewICECandidate);

    return () => {
      socket.off('chat-message');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, []);

  return (
    <Container>
      <StreamInfoSection>
        <Input
          type="text"
          placeholder="Stream Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Textarea
          rows={4}
          cols={40}
          placeholder="Stream Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
         {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </StreamInfoSection>

      <VideoSection>
        <VideoPlayer>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%' }} />
          <PlayPauseButton onClick={isStreaming ? stopStreaming : startStreaming}>
            {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
          </PlayPauseButton>
        </VideoPlayer>
      </VideoSection>

      {/* Chat Section */}
      <ChatSection>
        <ChatHeader>Live Chat</ChatHeader>
        <ChatMessages>
          {messages.map((msg, index) => (
            <p key={index}><strong>{msg}</strong></p>
          ))}
        </ChatMessages>

        <ChatInputContainer>
          <ChatInput
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <SendButton onClick={sendMessage}>Send</SendButton>
        </ChatInputContainer>
      </ChatSection>
    </Container>
  );
};

export default LiveStreaming;
