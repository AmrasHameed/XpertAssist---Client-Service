import { useWebRTC } from "./Context/WebRtcContext";
import VideoCallModal from "./VideoCallModal";

export const GlobalVideoCallHandler: React.FC = () => {
    const { localStream, remoteStream, inCall, endCall, peerConnection } = useWebRTC();
  
    if (!inCall || !localStream) return null;
  
    return (
      <VideoCallModal
        localStream={localStream} 
        remoteStream={remoteStream} 
        endCall={endCall} 
        peerConnection={peerConnection}
      />
    );
  };