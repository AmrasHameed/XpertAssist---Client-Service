import { Player } from "@lottiefiles/react-lottie-player";

const Main = () => {
  return (
    <div className="bg-gradient-to-b from-black via-black to-cyan-400 text-white py-30">
      <div className="container mx-auto flex items-center">
        {/* Left Side: Text and Button */}
        <div className="w-1/2 space-y-6 mx-6">
          <h1 className="text-5xl font-bold">Looking for Experts?</h1>
          <p className="text-5xl font-semibold">
            Book trusted help <br /> for every task
          </p>
          <button className=" border-2 border-white py-3 m-2 w-40 shadow-glow hover:shadow-md hover:text-shadow-glow text-2xl">
            Book Now
          </button>
        </div>

        {/* Right Side: Image */}
        <div className="w-1/2 mt-5">
          <Player autoplay loop src={"/Animation - 1726033694885.json"} style={{ height: '80%', width: '80%',background:"transparent" }} />
        </div>
      </div>
    </div>
  );
};

export default Main;
