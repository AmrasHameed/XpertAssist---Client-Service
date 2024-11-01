import React, { useEffect, useState, useRef } from 'react';
import { useWebRTC } from './Context/WebRtcContext';
import { useSocket } from './Context/SocketContext';

interface IncomingCallNotificationProps {
  callerId: string;
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({
  callerName,
  onAccept,
  onReject,
}) => {
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="p-6 bg-black bg-opacity-90 rounded-xl shadow-2xl text-white text-center w-full max-w-md">
        <h4 className="font-bold text-2xl mb-2">{callerName}</h4>
        <p className="text-sm mb-6">Incoming video call...</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onAccept}
            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all duration-150"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-150"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const GlobalIncomingCallHandler: React.FC = () => {
  const { acceptCall, rejectCall} = useWebRTC();
  const [incomingCall, setIncomingCall] = useState<{
    fromId: string;
    from: string;
    offer: RTCSessionDescriptionInit;
  } | null>(null);
  const userId = localStorage.getItem('userId-job')
  const expertId = localStorage.getItem('expertId-job')
  const socket = useSocket();
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    ringtoneRef.current = new Audio('/ringtone.mp3');
    ringtoneRef.current.loop = true;

    const handleIncomingCall = (data: {
      from: string;
      offer: RTCSessionDescriptionInit;
      fromId: string;
    }) => {
      setIncomingCall(data);
      ringtoneRef.current
        ?.play()
        .catch(error => console.warn('Ringtone playback failed:', error));
    };

    const handleEndCallSignal = () => {
      console.log('Call ended signal received');
      setIncomingCall(null);
      ringtoneRef.current?.pause();
  };

    socket?.on('incomingCall', handleIncomingCall);
    socket?.on('callEnded', handleEndCallSignal);

    return () => {
      socket?.off('incomingCall', handleIncomingCall);
      socket?.off('callEnded', handleEndCallSignal);
      ringtoneRef.current?.pause(); 
      ringtoneRef.current = null;
    };
  }, [socket]);

  const handleAccept = () => {
    if (incomingCall && userId && expertId) {
      if(incomingCall.fromId === expertId) {
        acceptCall(userId, incomingCall.fromId, incomingCall.offer);
      } else {
        acceptCall(expertId, incomingCall.fromId, incomingCall.offer);
      }
      setIncomingCall(null);
      ringtoneRef.current?.pause();
    }
  };

  const handleReject = () => {
    rejectCall(incomingCall?.fromId || '');
    setIncomingCall(null);
    ringtoneRef.current?.pause();
  };

  if (!incomingCall) return null;

  return (
    <>
      <IncomingCallNotification
        callerId={incomingCall.from}
        callerName={incomingCall.from}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </>
  );
};

export default GlobalIncomingCallHandler;
