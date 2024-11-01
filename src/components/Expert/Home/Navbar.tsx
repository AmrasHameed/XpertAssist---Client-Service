import { useDispatch, useSelector } from 'react-redux';
import { expertLogout, expertOffline, expertOnline } from '../../../service/redux/slices/expertAuthSlice';
import '../../Admin/Home/navbar.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosExpert from '../../../service/axios/axiosExpert';

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const Navbar = () => {
  const dispatch = useDispatch();
  const expert = useSelector(
    (store: {
      expert: {
        expertId: string;
        image?: string;
        online?:boolean;
      };
    }) => store.expert
  );

  
  
  const handleToggle = async () => {
    if(expert.online) {
      try{
        const { data } = await axiosExpert().post(`/setOffline/${expert.expertId}`); 
        if(data.message === 'success') {
          toast.error('You are Offline')
          dispatch(expertOffline())
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    } else {
      try {
        const { data } = await axiosExpert().post(`/setOnline/${expert.expertId}`);
        if(data.message === 'success') {
          toast.success('Yayy!!! You are Online')
          dispatch(expertOnline());
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };
  
  return (
    <nav className="bg-white p-4 flex justify-between items-center shadow-2xl">
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
              checked={expert.online}
              onChange={handleToggle}
            />
            <div className="group peer ring-0 bg-red-500 rounded-full outline-none duration-300 after:duration-300 w-[79px] h-8 shadow-md peer-checked:bg-green-500 peer-focus:outline-none after:content-['❌'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none after:h-6 after:w-6 after:top-1 after:left-1 after:-rotate-180 after:flex after:justify-center after:items-center peer-checked:after:translate-x-12 peer-checked:after:content-['✔️'] peer-hover:after:scale-95 peer-checked:after:rotate-0"></div>
          </label>
          <p className="ml-4">{expert.online ? 'Online' : 'Offline'}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {expert && (
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => {
                toast.success('Logged out Successfully');
                dispatch(expertLogout());
              }}
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
              <Link to={'/expert/profile'}>
                <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-glow p-[4px] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black">
                    <img
                      className="object-cover w-full h-full"
                      src={
                        expert.image
                          ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${expert.image}`
                          : 'image'
                      }
                      alt="Expert"
                    />
                  </div>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
