import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosUser from '../../../service/axios/axiosUser';


type Option =
  | 'My Profile'
  | 'Service History'
  | 'Notification'
  | 'Change Password';

interface ProfileSideBarProps {
  onOptionSelect: (option: Option) => void;
}

const ProfileSideBar = ({ onOptionSelect }: ProfileSideBarProps) => {
  const user = useSelector((store: { user: { userId: string } }) => store.user);

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

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
        setName(data.name)
      } else {
        toast.error('No Users Found');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  const [selectedOption, setSelectedOption] = useState<Option>('My Profile');
  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onOptionSelect(option); // Pass the selected option to the parent
    console.log('Selected:', option); // You can perform actions based on the option here
  };

  return (
    <div className="sidebar p-4 w-1/4 bg-white rounded-lg shadow-glow">
      <div className="profile-card mb-8">
        <div className="flex items-center mb-4">
          <img
            src={image}
            alt="profile"
            className="w-14 h-14 rounded-full mr-4"
          />
          <div>
            <p className="font-bold">{name}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <ul>
            {/* My Profile */}
            <li
              className={`flex justify-between py-3 cursor-pointer ${
                selectedOption === 'My Profile'
                  ? 'bg-gray-200 rounded-lg p-2 m-2'
                  : ''
              }`}
              onClick={() => handleOptionClick('My Profile')}
            >
              <span className="flex items-center space-x-2">
                <span className="material-symbols-outlined">
                  account_circle
                </span>
                <span>My Profile</span>
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>

            {/* Service History */}
            <li
              className={`flex justify-between py-3 cursor-pointer ${
                selectedOption === 'Service History'
                  ? 'bg-gray-200 rounded-lg p-2 m-2'
                  : ''
              }`}
              onClick={() => handleOptionClick('Service History')}
            >
              <span className="flex items-center space-x-2">
                <span className="material-symbols-outlined">history</span>
                <span>Service History</span>
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>

            <li
              className={`flex justify-between py-3 cursor-pointer ${
                selectedOption === 'Change Password'
                  ? 'bg-gray-200 rounded-lg p-2 m-2'
                  : ''
              }`}
              onClick={() => handleOptionClick('Change Password')}
            >
              <span className="flex items-center space-x-2">
                <span className="material-symbols-outlined">key</span>
                <span>Change Password</span>
              </span>
              <i className="fas fa-chevron-right"></i>
            </li>

            {/* Notification */}
            <li className={`flex justify-between py-3 cursor-pointer`}>
              <span className="flex items-center space-x-2">
                <span className="material-symbols-outlined">notifications</span>
                <span>Notification</span>
              </span>
              <button className="text-cyan-500">Allow</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSideBar;
