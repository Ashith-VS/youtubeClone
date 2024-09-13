import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Container, VideoSection, VideoPlayer, ChatSection, ChatHeader, ChatMessages, ChatInputContainer, ChatInput, SendButton } from '../../assets/css/live';

const LiveStreaming = () => {
  const videoRef = useRef(null);
  console.log('videoRef: ', videoRef);
  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      console.log('hls: ', hls);
      hls.loadSource('http://localhost:8000/live/stream.m3u8'); // Replace with your stream URL
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
      return () => {
        hls.destroy();
      };
    }
  }, []);
  return (
    <Container>
      {/* Video Player Section */}
      <VideoSection>
        <VideoPlayer>
        <video ref={videoRef} controls  style={{ width: '100%', height: '100%' }} />
        </VideoPlayer>
      </VideoSection>

      {/* Chat Section */}
      <ChatSection>
        <ChatHeader>Live Chat</ChatHeader>
        <ChatMessages>
          {/* Example chat messages */}
          <p><strong>User1:</strong> Hello, everyone!</p>
          <p><strong>User2:</strong> Excited for this stream!</p>
          {/* More messages will appear here */}
        </ChatMessages>

        {/* Chat Input for Sending Messages */}
        <ChatInputContainer>
          <ChatInput type="text" placeholder="Type a message..." />
          <SendButton>Send</SendButton>
        </ChatInputContainer>
      </ChatSection>
    </Container>
  );
};

export default LiveStreaming;
