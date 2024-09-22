import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { expertLogout } from '../../../service/redux/slices/expertAuthSlice';
import '../../Admin/Home/navbar.css';

const Navbar = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };
  const expert = useSelector(
    (store: { expert: { expert: string; image?: string } }) => store.expert
  );
  const dispatch = useDispatch();

  return (
    <nav className="bg-white p-4 flex justify-between items-center">
      <div className="flex w-56 h-12 justify-center rounded-full relative overflow-hidden bg-black text-white p-1 items-center">
        {/* Gradient border */}
        <div className="absolute inset-0 rounded-full p-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient">
          <div className="flex w-full h-full bg-black rounded-full"></div>
        </div>
        <div className="flex z-10 w-full items-center justify-center">
          <p>Status</p>
          <label className="relative inline-flex items-center cursor-pointer ml-2">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isChecked}
              onChange={handleToggle}
            />
            <div className="group peer ring-0 bg-red-500 rounded-full outline-none duration-300 after:duration-300 w-[79px] h-8 shadow-md peer-checked:bg-green-500 peer-focus:outline-none after:content-['❌'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:-rotate-180 after:flex after:justify-center after:items-center peer-checked:after:translate-x-12 peer-checked:after:content-['✔️'] peer-hover:after:scale-95 peer-checked:after:rotate-0"></div>
          </label>
          <p className="ml-4">{isChecked ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {expert.expert && (
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => dispatch(expertLogout())}
              className="btn"
            >
              <strong>LOGOUT</strong>
              <div id="container-stars">
                <div id="stars"></div>
              </div>

              <div id="glow">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            </button>
            {expert.image && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-glow p-[4px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                <img
                  className="object-cover w-full h-full"
                  src={expert.image}
                  alt="Expert"
                />
              </div>
            </div>
            )}
          </div>
        ) }
      </div>
    </nav>
  );
};

export default Navbar;
