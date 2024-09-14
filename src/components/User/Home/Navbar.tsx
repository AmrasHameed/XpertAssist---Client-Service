import { Link } from 'react-router-dom';

const Navbar = () => {
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
        <div className="text-lg">
          <button className="border-2 border-white py-1 m-2 w-24 shadow-glow hover:shadow-md hover:text-shadow-glow">
            <Link to={'/login'}>Login</Link>
          </button>
          <button className="border-2 border-white py-1 m-2 w-24 shadow-glow hover:shadow-md hover:text-shadow-glow">
            <a href="#" className="hover:">
              Expert
            </a>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
