import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLogout } from '../../../service/redux/slices/userAuthSlice';
import { toast } from 'react-toastify';
import axiosUser from '../../../service/axios/axiosUser';
import { useEffect, useState } from 'react';

type NavbarProps = {
  activePage: string;
};

const Navbar = ({ activePage }: NavbarProps) => {
  const user = useSelector((store: { user: { user: string } }) => store.user);
  const dispatch = useDispatch();
  const isActive = (page: string) => activePage === page;
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.userId) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async (): Promise<void> => {
    try {
      const { data } = await axiosUser().get(`/getUser/${user?.userId}`);
      if (data.message === 'success') {
        setImage(data.userImage);
      } else {
        toast.error('No Users Found');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return (
    <nav className="bg-black text-white py-6 ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl hover:text-shadow-glow font-garamond">
          X P E R T A S S I S T
        </div>

        {/* Centered Navigation Links */}
        <div className="flex-1 text-xl font-thin">
          <ul className="flex justify-center space-x-20">
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
                to="/job-status"
                className={`hover:text-shadow-glow ${
                  isActive('job-status') ? 'underline text-cyan-500' : ''
                }`}
              >
                Job Status
              </Link>
            </li>
          </ul>
        </div>

        {/* Login */}
        <div className="text-lg flex items-center space-x-7">
          <div className="border-2 border-white py-1 px-4 m-2 w-24 shadow-glow hover:shadow-md hover:text-shadow-glow">
            {!user.user ? (
              <Link to="/login" className="block text-center">
                {' '}
                {/* Make Link behave like a button */}
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  toast.success('Logged out Successfully');
                  dispatch(userLogout());
                }}
                className="w-full" 
              >
                Logout
              </button>
            )}
          </div>
          <button className="border-2 border-white py-1 px-4 m-2 w-24 shadow-glow hover:shadow-md hover:text-shadow-glow">
            <Link to="/expert">Expert</Link>
          </button>
          {image && (
            <Link to={'/profile'}>
              <div className="w-11 h-11 rounded-full overflow-hidden shadow-glow border-2 border-white">
                <img
                  className="object-cover w-full h-full"
                  src={image}
                  alt="User"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
