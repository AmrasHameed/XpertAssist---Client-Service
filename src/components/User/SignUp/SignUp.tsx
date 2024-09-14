import { Player } from '@lottiefiles/react-lottie-player';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-between px-10 ">
      {/* Left side - Signup Form */}
      <div className="w-1/2 space-y-1">
        <h1 className="text-3xl font-garamond">X P E R T A S S I S T</h1>
        <h2 className="text-xl font-semibold">User Sign Up</h2>
        <p className="text-gray-600 text-sm mb-4">Please fill in the details to create an account.</p>

        <form>
          {/* Name Field */}
          <div className="relative mb-4">
            <input
              type="text"
              id="name"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Name"
            />
            <label
              htmlFor="name"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Name
            </label>
          </div>

          {/* Email Field */}
          <div className="relative mb-4">
            <input
              type="email"
              id="email"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Email
            </label>
          </div>

          {/* Mobile Number Field */}
          <div className="relative mb-4">
            <input
              type="tel"
              id="mobile"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Mobile Number"
            />
            <label
              htmlFor="mobile"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Mobile Number
            </label>
          </div>

          {/* Profile Image Field */}
          <div className="relative mb-4">
            <input
              type="file"
              id="profile-image"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label
              htmlFor="profile-image"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Profile Image
            </label>
          </div>

          {/* Password Field */}
          <div className="relative mb-4">
            <input
              type="password"
              id="password"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Password
            </label>
          </div>

          {/* Confirm Password Field */}
          <div className="relative mb-3">
            <input
              type="password"
              id="confirm-password"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Confirm Password"
            />
            <label
              htmlFor="confirm-password"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Confirm Password
            </label>
          </div>

          <button className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800">
            Sign up
          </button>
        </form>

        <div className="-mt-10 flex items-center justify-center">
          <span className="text-gray-400">or</span>
        </div>

        <button className="w-full mt-1 flex items-center justify-center bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-100">
          <img src="https://www.google.com/favicon.ico" alt="Google logo" className="w-5 h-5 mr-2" />
          Sign up with Google
        </button>

        <p className=" text-center text-gray-600 text-md">
          Already have an account?{' '}
          <Link to={'/login'} className="text-blue-500 font-semibold">
            Log in
          </Link>
        </p>
      </div>

      <div className="w-1/2 flex justify-center items-center">
        <Player
          autoplay
          loop
          src={'/Animation - 1726125252610.json'}
          style={{ height: '90%', width: '90%', background: 'transparent' }}
        />
      </div>
    </div>
  );
};

export default SignUp;
