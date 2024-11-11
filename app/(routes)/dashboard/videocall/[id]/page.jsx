"use client"
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Peer from 'simple-peer';
import { db } from '../../../../../Config/FirbaseConfig'; // Firebase config file
import { collection, onSnapshot, addDoc, query, where } from 'firebase/firestore';

const MeetingRoom = () => {
  const { id } = useParams(); // Get meeting ID from URL
  const [peers, setPeers] = useState([]); // Store all peers in state
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null); // Reference for local video element
  const peersRef = useRef([]); // Store all peer connections
  const videoContainerRef = useRef(null); // Reference for video container to dynamically add video elements

  useEffect(() => {
    if (!id) return;

    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        // Create a new peer when this user joins
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: stream, // Pass local video stream
        });

        peersRef.current.push(peer);
        setPeers([...peersRef.current]);

        // Listen to changes in Firestore for signaling
        const meetingRef = collection(db, 'meetings');
        const q = query(meetingRef, where('meetingId', '==', id));

        onSnapshot(q, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            if (data.signal) {
              peer.signal(data.signal); // Pass signaling data to WebRTC peer
            }
          });
        });

        // Handle when this peer generates a signal to send to others
        peer.on('signal', async (signal) => {
          await addDoc(meetingRef, { meetingId: id, signal }); // Add signal data to Firestore
        });

        // Handle incoming streams from other peers
        peer.on('stream', (stream) => {
          const newVideo = document.createElement('video');
          newVideo.srcObject = stream;
          newVideo.autoplay = true;
          newVideo.playsInline = true;
          videoContainerRef.current.appendChild(newVideo); // Add video to DOM
        });

      } catch (error) {
        console.error('Error starting local video stream:', error);
      }
    };

    startLocalStream();

    return () => {
      // Cleanup: Stop all media tracks
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [id]);

  return (
    <div>
      <h1>Meeting Room: {id}</h1>
      <div>
        {/* Local Video */}
        <video id="local-video" ref={localVideoRef} autoPlay muted playsInline />
      </div>
      <div ref={videoContainerRef}>
        {/* Remote video elements will be dynamically added here */}
      </div>
    </div>
  );
};

export default MeetingRoom;
