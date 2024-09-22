import { adminLogout } from '../../../service/redux/slices/adminAuthSlice';
import { useDispatch } from 'react-redux';
import './navbar.css';

const NavBar = () => {
  const dispatch = useDispatch();
  return (
    <nav className="bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)] p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
      </div>

      <div className="flex items-center space-x-4 ml-auto">
          <button type="button" onClick={() => dispatch(adminLogout())} className="btn">
            <strong>LOGOUT</strong>
            <div id="container-stars">
              <div id="stars"></div>
            </div>

            <div id="glow">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </button>
        </div>
    </nav>
  );
};

export default NavBar;
