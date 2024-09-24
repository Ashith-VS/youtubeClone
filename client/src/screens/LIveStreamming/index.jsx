import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
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
import { storage } from '../../services/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { isEmpty } from 'lodash';

const LiveStreaming = () => {
  const { currentUser } = useSelector(state => state.common)
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const localVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: ''
  });
  const mediaRecorder = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    // stop recording when fordata.videourl gets
    if(!isEmpty(formData.videoUrl)){
      const videoUrl = formData.videoUrl;
      // Close the peer connection
      peerConnection.current?.close();
      peerConnection.current = null;

      // Clear video elements
      localVideoRef.current.srcObject = null;
      const url = UrlEndPoint.liveEnd;
      const streamId = localStorage.getItem('streamId');

      networkRequest({ url, method: 'post', data: { streamId, videoUrl } }).then((res) => {
        if (res?.status === 'ok') {
          localStorage.removeItem('streamId');
          // Stop the local video and audio tracks
          localStream.current?.getTracks().forEach((track) => track.stop());
        }
        setIsStreaming(false);
        setFormData({ title: '', description: '', videoUrl: '' });
      })
    }
  }, [formData.videoUrl])
  

  const config = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' }
    ]
  };

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

  const uploadVideo = async (file) => {
    const filename = `${file?.name}_${uuid()}`// Generate a unique name using UUID
    const storageRef = ref(storage, `youtubeClone/${filename}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload progress: ', Math.round(progress));
      },
      (error) => {
        console.error('Upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("Video uploaded successfully:", downloadURL);
          setFormData((prev) => ({ ...prev, videoUrl: downloadURL }));
        });
      }
    )
  }

  const startRecording = async (stream) => {
    // Reset the chunks at the start of a new recording session
    chunksRef.current = [];
    mediaRecorder.current = new MediaRecorder(stream);
    // When data is available, push it into the chunks array
    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
        console.log('Chunk added:', event.data.size);
        console.log('Total chunks so far:', chunksRef.current.length);
      }
    };
    // Start recording
    mediaRecorder.current.start();
    console.log('Recording started...');
  };


  const stopRecording = () => {
    return new Promise((resolve) => {
      if (mediaRecorder.current) {
        mediaRecorder.current.onstop = async () => {
          console.log('Recording stopped, processing chunks:', chunksRef.current.length);
          if (chunksRef.current.length > 0) {
            const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
            const videoFile = new File([videoBlob], `live_stream_${Date.now()}.webm`, {
              type: "video/webm",
            });
            console.log('Uploading video file:', videoFile);
            // Upload the recorded file to Firebase Storage
            await uploadVideo(videoFile);
          } else {
            console.error('No chunks available to create video.');
          }
          resolve(); // Resolve the promise once upload is complete
        };
      }
      mediaRecorder.current.stop();// Stop recording
    })
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

      createPeerConnection();
      stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', offer);

      // Start recording when streaming starts
      startRecording(stream);

      // Save video metadata to the database
      const url = UrlEndPoint.liveStart
      const res = await networkRequest({ url, method: "post", data: formData })
      if (res) {
        localStorage.setItem('streamId', res._id)
      }
      
      setIsStreaming(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopStreaming = async () => {
      // Stop recording and wait for it to complete
      await stopRecording()
  };
  

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const messageData = {
        username: currentUser?.name,
        message: message
      };
      socket.emit('chat-message', messageData);
      setMessage('');
    }
  };


  useEffect(() => {
    socket.on('chat-message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('answer', handleReceiveAnswer);
    socket.on('ice-candidate', handleNewICECandidate);

    return () => {
      localStream.current?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
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
