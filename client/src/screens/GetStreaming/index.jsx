
import React, { useEffect, useRef, useState } from 'react'
import { ChatHeader, ChatInput, ChatInputContainer, ChatMessages, ChatSection, Container, PlayPauseButton, SendButton, VideoPlayer, VideoSection } from '../../assets/css/live'
import { useSelector } from 'react-redux';
import { socket } from '../../constants/common';
import { useParams } from 'react-router-dom';

const GetStreaming = () => {
  const { currentUser } = useSelector(state => state.common);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { id } = useParams();

  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
    ]
  };

  useEffect(() => {
    // Viewer joins the room using roomId from the URL
    socket.emit('join-room', id)
    
    createPeerConnection();

    // Listen for chat messages
    socket.on('chat-message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    // Handle offer from the broadcaster
    socket.on('offer', async (offer) => {
      console.log('Received offer:', offer);
      // Set remote description and create answer
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', answer, id); // Include room ID when sending the answer
    });
    // Handle ICE candidate from the broadcaster
    socket.on('ice-candidate', (candidate) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(error => console.error('Error adding ICE candidate:', error));
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('chat-message');
      socket.off('offer');
      socket.off('ice-candidate');
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [id]);

  // Ensure the video is played when metadata is loaded
  useEffect(() => {
    const videoElement = remoteVideoRef.current;
    if (videoElement) {
      console.log('videoElement: ', videoElement);
      if (videoElement.readyState >= 1) {
        // If the metadata is already loaded
        console.log('Metadata already loaded');
        videoElement.play().catch(error => {
          console.error('Autoplay error:', error);
        });
      } else {
        // If the metadata is not loaded yet, add an event listener
        videoElement.addEventListener('loadedmetadata', () => {
          console.log('Metadata loaded. Attempting to play the video');
          videoElement.play().catch(error => {
            console.error('Autoplay error:', error);
          });
        });
      }
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('loadedmetadata', () => { });
      }
    };
  }, []);

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(config);

    console.log(' peerConnection.current.ontrack: ', peerConnection.current.ontrack);
    peerConnection.current.ontrack = (event) => {
      console.log('event: ', event);
      if (remoteVideoRef.current) {
        console.log('remoteVideoRef.current: ', remoteVideoRef.current);
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', event.candidate, id);// Pass roomId here
      }
    };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        username: currentUser?.name,
        message: message,
        roomId: id // Include room ID when sending messages
      };
      socket.emit('chat-message', messageData, id);// Ensure the roomId is included
      setMessage('');
    }
  };

  return (
    <Container>
      <VideoSection>
        <VideoPlayer>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%' }} />
        </VideoPlayer>
      </VideoSection>

      {/* Chat Section */}
      <ChatSection>
        <ChatHeader>Live Chat</ChatHeader>
        <ChatMessages>
          {messages?.map((msg, index) => (
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

export default GetStreaming;
