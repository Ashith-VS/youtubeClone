
// import React, { useEffect, useRef, useState } from 'react'
// import { ChatHeader, ChatInput, ChatInputContainer, ChatMessages, ChatSection, Container, PlayPauseButton, SendButton, VideoPlayer, VideoSection } from '../../assets/css/live'
// import { useSelector } from 'react-redux';
// import { socket } from '../../constants/common';
// import { useParams } from 'react-router-dom';

// const GetStreaming = () => {
//   const { currentUser } = useSelector(state => state.common);
//   const remoteVideoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const { id } = useParams();

//   const config = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//       { urls: 'stun:stun1.l.google.com:19302' },
//       { urls: 'stun:stun2.l.google.com:19302' },
//     ]
//   };

//   useEffect(() => {
//     // Viewer joins the room using roomId from the URL
//     socket.emit('join-room', id)

//     createPeerConnection();

//     // Listen for chat messages
//     socket.on('chat-message', (msg) => {
//       setMessages(prevMessages => [...prevMessages, msg]);
//     });

//     // Handle offer from the broadcaster
//     socket.on('offer', async (offer) => {
//       try {
//         // Set the received offer as the remote description
//         await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

//         // Create an answer and set it as the local description
//         const answer = await peerConnection.current.createAnswer();
//         await peerConnection.current.setLocalDescription(answer);

//         // Send the answer back to the broadcaster
//         socket.emit('answer', answer, id); 
//         console.log('Answer emitted:', answer);
//       } catch (error) {
//         console.error('Error handling offer:', error);
//       }
//     });
//     // Handle ICE candidate from the broadcaster
//     socket.on('ice-candidate', (candidate) => {
//       if (peerConnection.current) {
//         peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
//           .catch(error => console.error('Error adding ICE candidate:', error));
//       }
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.off('chat-message');
//       socket.off('offer');
//       socket.off('ice-candidate');
//       if (peerConnection.current) {
//         peerConnection.current.close();
//         peerConnection.current = null;
//       }
//     };
//   }, [id]);

//   // Ensure the video is played when metadata is loaded
//   useEffect(() => {
//     const videoElement = remoteVideoRef.current;
//     console.log('remoteVideoRef.current: ', remoteVideoRef);

//     if (videoElement) {
//       console.log('videoElement: ', videoElement);
//       if (videoElement.readyState >= 1) {
//         // If the metadata is already loaded
//         console.log('Metadata already loaded');
//         videoElement.play().catch(error => {
//           console.error('Autoplay error:', error);
//         });
//       } else {
//         // If the metadata is not loaded yet, add an event listener
//         videoElement.addEventListener('loadedmetadata', () => {
//           console.log('Metadata loaded. Attempting to play the video');
//           videoElement.play().catch(error => {
//             console.error('Autoplay error:', error);
//           });
//         });
//       }
//     }

//     return () => {
//       if (videoElement) {
//         videoElement.removeEventListener('loadedmetadata', () => { });
//       }
//     };
//   }, []);

//   const createPeerConnection = () => {
//     console.log("Creating")
//     peerConnection.current = new RTCPeerConnection(config);
//     console.log('peerConnection.current: ', peerConnection.current);

//     // Handle when a video track is received
//     peerConnection.current.ontrack = (event) => {
//       console.log('event: ', event);
//       if (remoteVideoRef.current) {
//         console.log('Received remote stream:', event.streams[0]);
//         // Assign the received stream to the video element
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };
//     // Handle ICE candidates
//     peerConnection.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit('ice-candidate', event.candidate, id);// Pass roomId here
//       }
//     };
//   };

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       const messageData = {
//         username: currentUser?.name,
//         message: message,
//         roomId: id // Include room ID when sending messages
//       };
//       socket.emit('chat-message', messageData, id);// Ensure the roomId is included
//       setMessage('');
//     }
//   };

//   return (
//     <Container>
//       <VideoSection>
//         <VideoPlayer>
//           <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }} />
//         </VideoPlayer>
//       </VideoSection>

//       {/* Chat Section */}
//       <ChatSection>
//         <ChatHeader>Live Chat</ChatHeader>
//         <ChatMessages>
//           {messages?.map((msg, index) => (
//             <p key={index}><strong>{msg}</strong></p>
//           ))}
//         </ChatMessages>

//         <ChatInputContainer>
//           <ChatInput
//             type="text"
//             placeholder="Type a message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <SendButton onClick={sendMessage}>Send</SendButton>
//         </ChatInputContainer>
//       </ChatSection>
//     </Container>
//   );
// };

// export default GetStreaming;

// // import React, { useEffect, useRef, useState } from 'react';
// // import { socket } from '../../constants/common';
// // import { useParams } from 'react-router-dom';

// // const LiveViewer = () => {
// //   const [isConnected, setIsConnected] = useState(false);
// //   const remoteVideoRef = useRef(null);
// //   const peerConnection = useRef(null);
// //   const { id } = useParams();
// //   const roomId =id

// //   const config = {
// //     iceServers: [{ urls: 'stun:stun.l.google.com:19302' },
// //     { urls: 'stun:stun1.l.google.com:19302' },
// //     { urls: 'stun:stun2.l.google.com:19302' },]
// //   };

// //   useEffect(() => {
// //     peerConnection.current = new RTCPeerConnection(config);
// //     console.log('peerConnection.current : ', peerConnection.current );

// //     peerConnection.current.onicecandidate = (event) => {
// //       console.log('event: ', event);
// //       if (event.candidate) {
// //         socket.emit('ice-candidate', event.candidate, roomId);
// //       }
// //     };

// //     // When the broadcaster's stream is received, attach it to the video element
// //     peerConnection.current.ontrack = (event) => {
// //       remoteVideoRef.current.srcObject = event.streams[0];
// //     };

// //     socket.on('offer', async (offer) => {
// //       // Set the offer as the remote description and create an answer
// //       await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

// //       const answer = await peerConnection.current.createAnswer();
// //       await peerConnection.current.setLocalDescription(answer);

// //       // Send the answer back to the server to send to the broadcaster
// //       socket.emit('answer', answer, roomId);
// //     });

// //     // Receive ICE candidates from the broadcaster
// //     socket.on('ice-candidate', async (candidate) => {
// //       await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
// //     });

// //     // Join the room
// //     socket.emit('join-room', roomId);

// //     return () => {
// //       // Cleanup socket listeners and peer connection
// //       socket.off('offer');
// //       socket.off('ice-candidate');
// //       peerConnection.current.close();
// //     };
// //   }, [roomId]);

// //   return (
// //     <div>
// //       <h2>Live Stream Viewer</h2>
// //       <video ref={remoteVideoRef} autoPlay playsInline controls style={{ width: '100%', height: 'auto' }} />
// //     </div>
// //   );
// // };

// // export default LiveViewer;


import React from 'react'

const GetStreaming = () => {
  return (
    <div>GetStreaming</div>
  )
}

export default GetStreaming