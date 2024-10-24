import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-gradient-to-b from-black via-black to-cyan-400 text-white py-30">
      <div className="container mx-auto flex items-center">
        {/* Left Side: Text and Button */}
        <div className="w-1/2 space-y-6 mx-6">
          <h1 className="text-5xl font-bold">Looking for Experts?</h1>
          <p className="text-5xl font-semibold">
            Book trusted help <br /> for every task
          </p>
          <button onClick={()=>{
            navigate('/request-service')
          }} className="border shadow-glow text-gray-50  duration-300 relative group cursor-pointer   overflow-hidden h-12 w-48  bg-white p-2  font-extrabold hover:bg-cyan-300">
            <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-16 h-16 rounded-full group-hover:scale-150  duration-700 right-12 top-12 bg-cyan-200"></div>
            <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-12 h-12 rounded-full group-hover:scale-150  duration-700 right-20 -top-6 bg-cyan-500"></div>
            <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-8 h-8   rounded-full group-hover:scale-150  duration-700 right-32 top-6 bg-cyan-700"></div>
            <div className="absolute group-hover:-top-1 group-hover:-right-2 z-10 w-4 h-4   rounded-full group-hover:scale-150  duration-700 right-2 top-12 bg-cyan-900"></div>
            <p className="z-10 absolute bottom-2 left-2 text-black ">Book Now</p>
          </button>
        </div>

        {/* Right Side: Image */}
        <div className="w-1/2 mt-5">
          <Player
            autoplay
            loop
            src={'/Animation - 1726033694885.json'}
            style={{ height: '80%', width: '80%', background: 'transparent' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
