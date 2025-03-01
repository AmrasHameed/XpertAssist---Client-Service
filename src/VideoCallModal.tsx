import React, { useEffect, useState } from 'react';
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from 'react-icons/fi';

interface VideoCallModalProps {
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    endCall: () => void;
    peerConnection: RTCPeerConnection | null;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ localStream, remoteStream, endCall, peerConnection }) => {
    const localVideoRef = React.useRef<HTMLVideoElement>(null);
    const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isMicOff, setIsMicOff] = useState(false);

    console.log(peerConnection)

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);
    
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const toggleCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsCameraOff(!track.enabled);
            });
        }
    };

    const toggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsMicOff(!track.enabled);
            });
        }
    };

    const endCalling = () => {
        endCall()
    }

    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm z-50">
            <div className="relative w-full h-full flex items-center justify-center bg-black">
                <video ref={remoteVideoRef} autoPlay playsInline className="object-cover h-full w-full" />
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ transform: 'scaleX(-1)' }}
                    className="absolute bottom-4 right-4 w-36 h-28 bg-gray-900 border-2 border-white rounded-lg shadow-lg"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <button
                        onClick={toggleCamera}
                        className="p-2 bg-gray-800 text-white rounded-full focus:outline-none transition-transform transform hover:scale-110"
                    >
                        {isCameraOff ? <FiVideoOff size={24} /> : <FiVideo size={24} />}
                    </button>
                    <button
                        onClick={toggleMic}
                        className="p-2 bg-gray-800 text-white rounded-full focus:outline-none transition-transform transform hover:scale-110"
                    >
                        {isMicOff ? <FiMicOff size={24} /> : <FiMic size={24} />}
                    </button>
                    <button
                        onClick={endCalling}
                        className="p-2 text-white bg-red-600 rounded-full focus:outline-none transition-transform transform hover:scale-110"
                    >
                        End Call
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCallModal;
