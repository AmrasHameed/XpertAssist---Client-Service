import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLogout } from '../../../service/redux/slices/userAuthSlice';
import { toast } from 'react-toastify';

type NavbarProps = {
  activePage: string;
};

const BUCKET =  import.meta.env.VITE_AWS_S3_BUCKET;
const REGION =  import.meta.env.VITE_AWS_S3_REGION;

const Navbar = ({ activePage }: NavbarProps) => {
  const dispatch = useDispatch();
  const {image, user} = useSelector((store: { user: {user: string, image: string, userId: string } }) => store.user);
  const isActive = (page: string) => activePage === page;
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

        {/* Login */}
        <div className="text-lg flex items-center space-x-7">
          <div className="border-2 border-white py-1 px-4 m-2 w-24 shadow-glow hover:shadow-md hover:text-shadow-glow">
            {!user ? (
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
                  src={image?`https://${BUCKET}.s3.${REGION}.amazonaws.com/${image}`:'image'}
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
