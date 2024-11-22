import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLogout } from '../../../service/redux/slices/userAuthSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';

type NavbarProps = {
  activePage: string;
};

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const Navbar = ({ activePage }: NavbarProps) => {
  const dispatch = useDispatch();
  const { image, user } = useSelector(
    (store: { user: { user: string; image: string; userId: string } }) =>
      store.user
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (page: string) => activePage === page;

  const handleLogout = () => {
    toast.success('Logged out Successfully');
    dispatch(userLogout());
  };

  return (
    <nav className="bg-black text-white py-4">
      <div className="container px-2 mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl hover:text-shadow-glow font-garamond">
          X P E R T A S S I S T
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="block lg:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center text-xl font-thin">
          <ul className="flex space-x-20">
            <li>
              <Link
                to="/"
                className={`hover:text-shadow-glow ${
                  isActive('home') ? 'underline text-cyan-500' : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`hover:text-shadow-glow ${
                  isActive('services') ? 'underline text-cyan-500' : ''
                }`}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/job"
                className={`hover:text-shadow-glow ${
                  isActive('job-status') ? 'underline text-cyan-500' : ''
                }`}
              >
                Job Status
              </Link>
            </li>
          </ul>
        </div>

        {/* Login and Profile Section */}
        <div className="hidden lg:flex items-center space-x-7 text-lg">
          <div className="border-2 border-white py-1 px-4 shadow-glow hover:shadow-md hover:text-shadow-glow">
            {!user ? (
              <Link to="/login" className="block text-center">
                Login
              </Link>
            ) : (
              <button onClick={handleLogout} className="w-full">
                Logout
              </button>
            )}
          </div>
          <button className="border-2 border-white py-1 px-4 shadow-glow hover:shadow-md hover:text-shadow-glow">
            <Link to="/expert">Expert</Link>
          </button>
          {image && (
            <Link to="/profile">
              <div className="w-11 h-11 rounded-full overflow-hidden shadow-glow border-2 border-white">
                <img
                  className="object-cover w-full h-full"
                  src={`https://${BUCKET}.s3.${REGION}.amazonaws.com/${image}`}
                  alt="User"
                />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-black text-white py-4">
          <ul className="flex flex-col space-y-4 text-center">
            <li>
              <Link
                to="/"
                className={`hover:text-shadow-glow ${
                  isActive('home') ? 'underline text-cyan-500' : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`hover:text-shadow-glow ${
                  isActive('services') ? 'underline text-cyan-500' : ''
                }`}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/job"
                className={`hover:text-shadow-glow ${
                  isActive('job-status') ? 'underline text-cyan-500' : ''
                }`}
              >
                Job Status
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`hover:text-shadow-glow ${
                  isActive('profile') ? 'underline text-cyan-500' : ''
                }`}
              >
                Profile
              </Link>
            </li>
          </ul>
          <div className="mt-6 text-center space-y-4">
            <div className="border-2 border-white py-1 px-4 mx-auto w-1/2 shadow-glow hover:shadow-md hover:text-shadow-glow">
              {!user ? (
                <Link to="/login">Login</Link>
              ) : (
                <button onClick={handleLogout} className="w-full">
                  Logout
                </button>
              )}
            </div>
            <button className="border-2 border-white py-1 px-4 mx-auto w-1/2 shadow-glow hover:shadow-md hover:text-shadow-glow">
              <Link to="/expert">Expert</Link>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
