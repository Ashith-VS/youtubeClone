// import React, { useEffect, useRef, useState } from 'react';
// import io from 'socket.io-client';
// import { Container, VideoSection, VideoPlayer, ChatSection, ChatHeader, ChatMessages, ChatInputContainer, ChatInput, SendButton } from '../../assets/css/live';

// // Connect to Socket.IO server
// const socket = io('http://localhost:4000');

// const LiveStreaming = () => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnection = useRef(null);


//   const config = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' }
//     ]
//   };

//   const handleReceiveOffer = async (offer) => {
//     if (!peerConnection.current) createPeerConnection();
//     try {
//       await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);
//       socket.emit('answer', answer);
//     } catch (error) {
//       console.error('Error handling offer:', error);
//     }
//   };

//   const handleReceiveAnswer = async (answer) => {
//     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
//   };

//   const handleNewICECandidate = (candidate) => {
//     peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
//   };

//   const createPeerConnection = () => {
//     peerConnection.current = new RTCPeerConnection(config);

//     peerConnection.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('ice-candidate', event.candidate);
//       }
//     };

//     peerConnection.current.ontrack = (event) => {
//       remoteVideoRef.current.srcObject = event.streams[0];
//     };

//     return peerConnection.current;
//   };

 
//   const startStreaming = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localVideoRef.current.srcObject = stream;
      
//       createPeerConnection();
//       stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
      
//       const offer = await peerConnection.current.createOffer();
//       console.log('offer: ', offer);
//       await peerConnection.current.setLocalDescription(offer);
//       socket.emit('offer', offer);
//       console.log('stream: ', stream);
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };
  
//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       socket.emit('chat-message', message);
//       setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
//       setMessage('');
//     }
//   };


//   useEffect(() => {
//     socket.on('chat-message', (msg) => {
//       console.log('msg: ', msg);
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });
//     // socket.on('offer', handleReceiveOffer);
//     // socket.on('answer', handleReceiveAnswer);
//     // socket.on('ice-candidate', handleNewICECandidate);

//     return () => {
//       socket.off('chat-message');
//       socket.off('offer');
//       socket.off('answer');
//       socket.off('ice-candidate');
//     };
//   }, []);

//   console.log('localVideoRef: ', localVideoRef);
//   console.log('remoteVideoRef: ', remoteVideoRef);
//   return (
//     <Container>
//       {/* Video Player Section */}
//       <VideoSection>
//         <VideoPlayer>
//         {/* <video  controls  style={{ width: '100%', height: '100%' }} /> */}
//         <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%' }} />
//         <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }} />
//         </VideoPlayer>
//       </VideoSection>
//       <button onClick={startStreaming}>Start Streaming</button>

//       {/* Chat Section */}
//       <ChatSection>
//         <ChatHeader>Live Chat</ChatHeader>
//         <ChatMessages>
//           {/* Example chat messages */}
//           {/* <p><strong>User1:</strong> Hello, everyone!</p>
//           <p><strong>User2:</strong> Excited for this stream!</p> */}
//           {/* More messages will appear here */}
//           {messages.map((msg, index) => (
//             <p key={index}><strong>{msg}</strong></p>
//           ))}
//         </ChatMessages>

//         {/* Chat Input for Sending Messages */}
//         <ChatInputContainer>
//           <ChatInput type="text" placeholder="Type a message..."  value={message}  onChange={(e) => setMessage(e.target.value)}/>
//           <SendButton onClick={sendMessage}>Send</SendButton>
//         </ChatInputContainer>
//       </ChatSection>
//     </Container>
//   );
// };

// export default LiveStreaming;

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Container, VideoSection, VideoPlayer, ChatSection, ChatHeader, ChatMessages, ChatInputContainer, ChatInput, SendButton,PlayPauseButton } from '../../assets/css/live';

// Connect to Socket.IO server
const socket = io('http://localhost:4000');

const LiveStreaming = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  console.log('remoteVideoRef: ', remoteVideoRef);
  const peerConnection = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };
  const togglePlayPause = () => {
    if (remoteVideoRef.current.paused) {
      remoteVideoRef.current.play();
      setIsPlaying(true);
    } else {
      remoteVideoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleReceiveOffer = async (offer) => {
    if (!peerConnection.current) createPeerConnection();
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', answer);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleReceiveAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleNewICECandidate = (candidate) => {
    peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(config);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate);
      }
    };

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    return peerConnection.current;
  };

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('stream: ', stream);
      localVideoRef.current.srcObject = stream;
      
      createPeerConnection();
      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
      
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', offer);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat-message', message);
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('chat-message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('offer', handleReceiveOffer);
    socket.on('answer', handleReceiveAnswer);
    socket.on('ice-candidate', handleNewICECandidate);

    return () => {
      socket.off('chat-message');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, []);

  return (
    <Container>
      <VideoSection>
        <VideoPlayer>
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%' }} />
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }} />
          <PlayPauseButton onClick={togglePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </PlayPauseButton>
        </VideoPlayer>
      </VideoSection>
      <button onClick={startStreaming}>Start Streaming</button>

      {/* Chat Section */}
      <ChatSection>
        <ChatHeader>Live Chat</ChatHeader>
        <ChatMessages>
          {messages.map((msg, index) => (
            <p key={index}><strong>{msg}</strong></p>
          ))}
        </ChatMessages>

        {/* Chat Input for Sending Messages */}
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
