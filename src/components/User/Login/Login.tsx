import { Player } from '@lottiefiles/react-lottie-player';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-between  px-12">
      {/* Left side - Login Form */}
      <div className="w-1/2 space-y-6">
        <h1 className="text-3xl font-garamond">X P E R T A S S I S T</h1>
        <h2 className="text-3xl font-semibold">User Login</h2>
        <p className="text-gray-600">
          Please login to continue to your account.
        </p>

        <form className="mt-6">
          <div className="relative mb-6">
            <input
              type="email"
              id="email"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black"
            >
              Email
            </label>
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              id="password"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black"
            >
              Password
            </label>
          </div>
          <button className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800">
            Sign in
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center">
          <span className="text-gray-400">or</span>
        </div>

        <button className="w-full mt-3 flex items-center justify-center bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-100">
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to={'/signup'} className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Right side - Animation */}
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

export default Login;
