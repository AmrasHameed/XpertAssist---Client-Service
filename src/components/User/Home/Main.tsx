import { Player } from '@lottiefiles/react-lottie-player';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="bg-gradient-to-b from-black via-black to-cyan-400 text-white py-10">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center">
        {/* Left Side: Text and Button */}
        <div className="w-full lg:w-1/2 space-y-4 px-4 text-center mt-10 lg:mt-0 lg:text-left">
          <h1 className="text-3xl lg:text-5xl font-bold">
            Looking for Experts?
          </h1>
          <p className="text-2xl lg:text-5xl font-semibold">
            Book trusted help <br className="hidden lg:block" /> for every task
          </p>
          <div className="flex justify-center lg:justify-start">
            <button
              onClick={() => navigate('/request-service')}
              className="relative overflow-hidden h-12 w-48 border shadow-glow text-gray-50 font-extrabold bg-white duration-300 hover:bg-cyan-300 group"
            >
              {/* Animated circles */}
              <div className="absolute w-16 h-16 bg-cyan-200 rounded-full top-12 right-12 group-hover:-top-1 group-hover:-right-2 group-hover:scale-150 duration-700 z-10"></div>
              <div className="absolute w-12 h-12 bg-cyan-500 rounded-full -top-6 right-20 group-hover:-top-1 group-hover:-right-2 group-hover:scale-150 duration-700 z-10"></div>
              <div className="absolute w-8 h-8 bg-cyan-700 rounded-full top-6 right-32 group-hover:-top-1 group-hover:-right-2 group-hover:scale-150 duration-700 z-10"></div>
              <div className="absolute w-4 h-4 bg-cyan-900 rounded-full top-12 right-2 group-hover:-top-1 group-hover:-right-2 group-hover:scale-150 duration-700 z-10"></div>

              {/* Button text */}
              <p className="absolute inset-0 flex items-center justify-center text-black z-20">
                Book Now
              </p>
            </button>
          </div>
        </div>

        {/* Right Side: Animation */}
        <div className="w-full lg:w-1/2 -mt-6 lg:mt-5">
          {isLoading && (
            <div className="flex items-center justify-center h-80">
              <div ><FaSpinner className="animate-spin"  /></div>
            </div>
          )}
          <Player
            autoplay
            loop
            src="/Animation - 1726033694885.json"
            style={{ height: '80%', width: '80%', background: 'transparent' }}
            onEvent={(event) => {
              if (event === 'load') {
                setIsLoading(false); 
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
