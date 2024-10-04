// import React, { useEffect, useRef, useState } from 'react';
// import { v4 as uuid } from 'uuid';
// import {
//   Container,
//   VideoSection,
//   VideoPlayer,
//   ChatSection,
//   ChatHeader,
//   ChatMessages,
//   ChatInputContainer,
//   ChatInput,
//   SendButton,
//   PlayPauseButton,
//   StreamInfoSection,
//   Input,
//   Textarea,
//   ErrorMessage,
// } from '../../assets/css/live';
// import networkRequest from '../../http/api';
// import { UrlEndPoint } from '../../http/apiConfig';
// import { useSelector } from 'react-redux';
// import { socket } from '../../constants/common';
// import { storage } from '../../services/firebase';
// import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
// import { isEmpty } from 'lodash';


// const LiveStreaming = () => {
//   const { currentUser } = useSelector(state => state.common)
//   const [errorMessage, setErrorMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [isStreaming, setIsStreaming] = useState(false);
//   const localVideoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const localStream = useRef(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     videoUrl: '',
//     thumbnail: '',
//   });
//   const mediaRecorder = useRef(null);
//   const chunksRef = useRef([]);

//   useEffect(() => {
//     // stop recording when fordata.videourl gets
//     if (!isEmpty(formData.videoUrl)) {
//       const videoUrl = formData.videoUrl;
//       const url = UrlEndPoint.liveEnd;
//       const streamId = localStorage.getItem('streamId');
//       networkRequest({ url, method: 'post', data: { streamId, videoUrl } }).then((res) => {
//         if (res?.status === 'ok') {
//           localStorage.removeItem('streamId');
//         }
//       })
//     }
//   }, [formData.videoUrl])

//   const uploadVideo = async (file) => {
//     const filename = `${file?.name}_${uuid()}`// Generate a unique name using UUID
//     const storageRef = ref(storage, `youtubeClone/${filename}`)
//     const uploadTask = uploadBytesResumable(storageRef, file)
//     uploadTask.on('state_changed',
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log('Upload progress: ', Math.round(progress));
//       },
//       (error) => {
//         console.error('Upload failed:', error);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           console.log("Video uploaded successfully:", downloadURL);
//           setFormData((prev) => ({ ...prev, videoUrl: downloadURL }));
//         });
//       }
//     )
//   }

//   const config = {
//     iceServers: [
//       { urls: 'stun:stun.l.google.com:19302' },
//     ]
//   };

//   const createPeerConnection = () => {
//     peerConnection.current = new RTCPeerConnection(config);
//     peerConnection.current.onicecandidate = (event) => {
//       console.log('event: ', event);
//       if (event.candidate) {
//         const roomId = localStorage.getItem('streamId'); // Get the stored roomId
//         console.log('roomId: ', roomId);
//         socket.emit('ice-candidate', event.candidate, roomId);
//       }
//     };
//   };

//   const handleReceiveAnswer = async (answer) => {
//     await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
//   };

//   const handleNewICECandidate = async (candidate) => {
//     await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
//   };


//   useEffect(() => {
//     socket.on('chat-message', (msg) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     socket.on('answer', handleReceiveAnswer,);
//     socket.on('ice-candidate', handleNewICECandidate);

//     return () => {
//       socket.off('chat-message');
//       socket.off('answer');
//       socket.off('ice-candidate');
//       localStream.current?.getTracks().forEach(track => track.stop());
//       peerConnection.current?.close();
//     };
//   }, []);

//   const startRecording = async (stream) => {
//     // Reset the chunks at the start of a new recording session
//     chunksRef.current = [];
//     mediaRecorder.current = new MediaRecorder(stream);
//     // When data is available, push it into the chunks array
//     mediaRecorder.current.ondataavailable = (event) => {
//       if (event.data && event.data.size > 0) {
//         chunksRef.current.push(event.data);
//       }
//     };
//     // Start recording
//     mediaRecorder.current.start();
//     console.log('Recording started...');
//   };


//   const startStreaming = async () => {
//     if (!formData.title || !formData.description) {
//       setErrorMessage('Title and Description are required to start streaming');
//       return;
//     }
//     setErrorMessage('');
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localVideoRef.current.srcObject = stream;

//       localStream.current = stream;

//       // Use the stream's ID as the room ID
//       const roomId = stream.id;
//       localStorage.setItem('streamId', roomId);// Store the streamId in localStorage
//       socket.emit('join-room', roomId); // Broadcaster joins the room
//       console.log(`Joined room: ${roomId}`);

//       createPeerConnection();
//       stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
//       // stream.getTracks().forEach((track) => {
//       //   peerConnection.current.addTrack(track, stream);
//       //   console.log('Adding track:', track);
//       // });


//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer);
//       socket.emit('offer', offer, roomId); // Include roomId when sending the offer

//       // Start recording when streaming starts
//       startRecording(stream);

//       // Capture thumbnail
//       if (isEmpty(formData.thumbnail)) {
//         const thumbnailUrl = await captureThumbnail(stream);
//         console.log('Capture thumbnail: ', thumbnailUrl);
//         setFormData((prev) => ({ ...prev, thumbnail: thumbnailUrl }));
//       }


//       // Save video metadata to the database
//       const url = UrlEndPoint.liveStart
//       const Data = { ...formData, streamId: roomId }

//       const res = await networkRequest({ url, method: "post", data: Data })
//       // console.log('res: ', res);
//       setIsStreaming(true);
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };
//   const captureThumbnail = async (stream) => {
//     return new Promise((resolve) => {
//       const videoElement = document.createElement('video');
//       videoElement.srcObject = stream;

//       videoElement.addEventListener('loadedmetadata', () => {
//         videoElement.currentTime = 1; // Capture at 1 second
//       });

//       videoElement.addEventListener('timeupdate', async () => {
//         if (videoElement.currentTime >= 1) {
//           const canvas = document.createElement('canvas');
//           canvas.width = videoElement.videoWidth;
//           canvas.height = videoElement.videoHeight;
//           const context = canvas.getContext('2d');
//           context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

//           // Convert canvas to Blob and upload
//           canvas.toBlob(async (blob) => {
//             const file = new File([blob], `thumbnail_${Date.now()}.png`, { type: 'image/png' });
//             const thumbnailUrl = await uploadThumbnail(file);
//             resolve(thumbnailUrl);
//           }, 'image/png');

//           videoElement.pause(); // Stop capturing after getting the frame
//         }
//       });

//       videoElement.play();
//     });
//   };

//   const uploadThumbnail = async (file) => {
//     const filename = `${file.name}_${uuid()}`;
//     const storageRef = ref(storage, `thumbnails/${filename}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     return new Promise((resolve) => {
//       uploadTask.on('state_changed',
//         (snapshot) => {
//           // Handle progress if needed
//         },
//         (error) => {
//           console.error('Thumbnail upload failed:', error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             console.log('uploadThumbnaildownloadURL: ', downloadURL);
//             resolve(downloadURL); // Return the download URL
//           });
//         }
//       );
//     });
//   };

//   const stopRecording = () => {
//     return new Promise((resolve) => {
//       if (mediaRecorder.current) {
//         mediaRecorder.current.onstop = async () => {
//           console.log('Recording stopped, processing chunks:', chunksRef.current.length);
//           if (chunksRef.current.length > 0) {
//             const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
//             const videoFile = new File([videoBlob], `live_stream_${Date.now()}.webm`, {
//               type: "video/webm",
//             });
//             console.log('Uploading video file:', videoFile);
//             // Upload the recorded file to Firebase Storage
//             await uploadVideo(videoFile);
//           } else {
//             console.error('No chunks available to create video.');
//           }
//           resolve(); // Resolve the promise once upload is complete
//         };
//       }
//       mediaRecorder.current.stop();// Stop recording
//     })
//   };



//   const stopStreaming = async () => {
//     // Stop recording and wait for it to complete
//     await stopRecording()
//     // Close the peer connection
//     if (peerConnection.current) {
//       peerConnection.current.close();
//       peerConnection.current = null;
//     }

//     // Clear video elements
//     localVideoRef.current.srcObject = null;
//     // Stop the local video and audio tracks
//     if (localStream.current) {
//       localStream.current.getTracks().forEach(track => track.stop());
//       localStream.current = null;
//     }

//     // Clear chat messages
//     setMessages([]);
//     setIsStreaming(false);
//     setFormData({ title: '', description: '', videoUrl: '' });
//   };


//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       const messageData = {
//         username: currentUser?.name,
//         message: message,
//         roomId: localStorage.getItem('streamId'), // Add room ID here  
//       };
//       socket.emit('chat-message', messageData, localStorage.getItem('streamId'));
//       setMessage('');
//     }
//   };

//   return (
//     <Container>
//       <StreamInfoSection>
//         <Input
//           type="text"
//           placeholder="Stream Title"
//           value={formData.title}
//           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//         />
//         <Textarea
//           rows={4}
//           cols={40}
//           placeholder="Stream Description"
//           value={formData.description}
//           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//         />
//         {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
//         <Input
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             const file = e.target.files[0];
//             uploadThumbnail(file).then((resuploadThumbnail) => {
//               setFormData({ ...formData, thumbnail: resuploadThumbnail });
//             })
//           }}
//         />
//       </StreamInfoSection>

//       <VideoSection>
//         <VideoPlayer>
//           <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%' }} />
//           <PlayPauseButton onClick={isStreaming ? stopStreaming : startStreaming}>
//             {isStreaming ? 'Stop Streaming' : 'Start Streaming'}
//           </PlayPauseButton>
//         </VideoPlayer>
//       </VideoSection>

//       {/* Chat Section */}
//       <ChatSection>
//         <ChatHeader>Live Chat</ChatHeader>
//         <ChatMessages>
//           {messages.map((msg, index) => (
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

// export default LiveStreaming;

import { useState } from "react";
import SpeakerScreenContainer from "./SpeakerScreenContainer";
import ViewerScreenContainer from "./ViewerScreenContainer";
import WelcomeScreenContainer from "./WelcomeScreenContainer";

const LiveStreaming = () => {
  const [appData, setAppData] = useState({ meetingId: null, mode: null });
  console.log('setAppData: ', setAppData);

  return (
    appData.meetingId ? (
      appData.mode === "CONFERENCE" ? (
        <SpeakerScreenContainer meetingId={appData.meetingId} />
      ) : (
        <ViewerScreenContainer meetingId={appData.meetingId} />
      )
    ) : (
      <WelcomeScreenContainer setAppData={setAppData} />
    )
  )
}

export default LiveStreaming