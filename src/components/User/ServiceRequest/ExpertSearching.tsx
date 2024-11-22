import { Player } from '@lottiefiles/react-lottie-player';
import './ExpertSearching.css';

const ExpertSearching = () => {
  return (
    <div className="bg-gradient-to-b from-black via-black to-white min-h-screen flex justify-center items-center">
  <div className="flex flex-col items-center text-center w-full px-4 md:px-8 lg:max-w-full">
    <Player
      autoplay
      loop
      src={'/Animation - rocket.json'}
      style={{
        height: 'auto',
        width: '100%',
        maxWidth: '500px',
        background: 'transparent',
      }}
    />
    {/* Waiting Message */}
    <p className="glow mt-4 text-white text-lg sm:text-xl md:text-2xl">
      We're searching for an available Expert. Please wait...
    </p>
  </div>
</div>

  );
};

export default ExpertSearching;
