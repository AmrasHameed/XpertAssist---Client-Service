import { Player } from '@lottiefiles/react-lottie-player';
import './ExpertSearching.css';

const ExpertSearching = () => {
  return (
    <div className="bg-gradient-to-b from-black via-black to-white h-full min-h-screen flex  justify-center">
      <div className="flex flex-col text-center">
        <Player
          autoplay
          loop
          src={'/Animation - rocket.json'}
          style={{ height: '80%', width: '80%', background: 'transparent' }}
        />

        {/* Waiting Message */}
        <p className="glow -mt-36">
          We're searching for an available Expert. Please wait...
        </p>
      </div>
    </div>
  );
};

export default ExpertSearching;
