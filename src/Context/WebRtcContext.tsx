import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useSocket } from './SocketContext';
import { toast } from 'react-toastify';

interface WebRTCContextProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  inCall: boolean;
  startCall: (userId: string) => void;
  acceptCall: (
    userId: string,
    from: string,
    offer: RTCSessionDescriptionInit
  ) => void;
  endCall: () => void;
  rejectCall: (id:string) => void;
  peerConnection: RTCPeerConnection | null;
}

const WebRTCContext = createContext<WebRTCContextProps | undefined>(undefined);

export const WebRTCProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useSocket();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [inCall, setInCall] = useState(false);
  const [beforeCall, setBeforeCall] = useState(false);
  const [guestId, setGuestId] = useState('');
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const userId = localStorage.getItem('userId-job')
  const expertId = localStorage.getItem('expertId-job')

  const startCall = async (user: string) => {
    if(user === 'expert' && expertId) {
      setGuestId(expertId);
    } 
    if(user === 'user' && userId){
      console.log(userId)
      setGuestId(userId)
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setLocalStream(stream);

    if (!peerConnection.current) {
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:global.stun.twilio.com:3478',
            ],
          },
        ],
      });

      peerConnection.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit('signal', {
            guestId,
            type: 'candidate',
            candidate: event.candidate,
            context: 'webRTC',
          });
        }
      };

      for (const track of stream.getTracks()) {
        peerConnection.current.addTrack(track, stream);
      }
    }

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socket?.emit('callUser', {
      userToCall: user === 'expert'?expertId:userId,
      from: user === 'expert'?'User':'Expert',
      offer,
      fromId: user === 'expert'?userId:expertId,
    });
    setInCall(true);
  };

  const acceptCall = async (
    userId: string,
    fromId: string,
    offer: RTCSessionDescriptionInit
  ) => {
    setGuestId(userId);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);

    if (!peerConnection.current) {
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:global.stun.twilio.com:3478',
            ],
          },
        ],
      });

      peerConnection.current.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit('signal', {
            userId: fromId,
            type: 'candidate',
            candidate: event.candidate,
            context: 'webRTC',
          });
        }
      };

      for (const track of stream.getTracks()) {
        peerConnection.current.addTrack(track, stream);
      }
    }

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socket?.emit('callAccepted', { userId: fromId, answer, context: 'webRTC' });
    setInCall(true);
  };

  const rejectCall = useCallback((id:string) => {
    if(beforeCall){
      socket?.emit('callReject',id)
    }
  },[beforeCall, socket])

  const endCall = useCallback(() => {
    if (!inCall) return; 
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    setInCall(false);
    socket?.emit('callEnded', userId, expertId);
  }, [inCall, localStream, remoteStream, socket, userId, expertId]);
  

  useEffect(() => {
    socket?.on('incomingCall',(data)=>{
      setBeforeCall(true)
    });

    socket?.on('signal', async (data) => {
      const { type, candidate, answer, offer, from } = data;
      if (peerConnection.current) {
        if (type === 'candidate') {
          try {
            if (candidate) {
              await peerConnection.current.addIceCandidate(
                new RTCIceCandidate(candidate)
              );
            }
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        } else if (type === 'answer') {
          try {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          } catch (error) {
            console.error('Error setting remote description:', error);
          }
        } else if (type === 'offer') {
          try {
            if (peerConnection.current) {
              await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(offer)
              );
              const answer = await peerConnection.current.createAnswer();
              await peerConnection.current.setLocalDescription(answer);
              socket?.emit('signal', { type: 'answer', answer, to: from });
            }
          } catch (error) {
            console.error('Error handling offer:', error);
          }
        }
      }
    });

    socket?.on('callAcceptedSignal', async (data) => {
      const { answer } = data;
      if (peerConnection.current) {
        try {
          if (peerConnection.current.signalingState === 'have-local-offer') {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          }
        } catch (error) {
          console.error('Error handling callAcceptedSignal:', error);
        }
      }
    });

    socket?.on('callEndedSignal', () => {
      console.log('came to end call');
      endCall();
    });

    return () => {
      socket?.off('signal');
      socket?.off('callEndedSignal');
      socket?.off('callAcceptedSignal');
    };
  }, [endCall, socket]);

  const contextValue: WebRTCContextProps = {
    localStream,
    remoteStream,
    inCall,
    startCall,
    acceptCall,
    endCall,
    rejectCall,
    peerConnection: peerConnection.current,
  };

  return (
    <WebRTCContext.Provider value={contextValue}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = (): WebRTCContextProps => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};
