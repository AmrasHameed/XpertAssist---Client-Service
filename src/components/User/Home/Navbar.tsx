import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLogout } from '../../../service/redux/slices/userAuthSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const user = useSelector((store: { user: { user: string } }) => store.user);
  const dispatch = useDispatch();

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
              <a href="#" className="hover:text-shadow-glow">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-shadow-glow">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-shadow-glow">
                Job Status
              </a>
            </li>
          </ul>
        </div>

        {/* Login */}
        <div className="text-lg flex items-center space-x-7">
          <button className="border-2 border-white py-1 px-4 m-2 w-24 shadow-glow hover:shadow-md hover:text-shadow-glow">
            {!user.user ? (
              <Link to="/login">Login</Link>
            ) : (
              <button
                onClick={() => {
                  toast.success('Logged out Successfully');
                  dispatch(userLogout());
                }}
              >
                Logout
              </button>
            )}
          </button>
          <button className="border-2 border-white py-1 px-4 m-2 w-24 shadow-glow hover:shadow-md hover:text-shadow-glow">
            <Link to="/expert">Expert</Link>
          </button>
          {user.image && (
            <div className="w-11 h-11 rounded-full overflow-hidden shadow-glow border-2 border-white">
              <img
                className="object-cover w-full h-full"
                src={user.image}
                alt="User"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
