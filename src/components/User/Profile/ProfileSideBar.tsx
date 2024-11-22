import { useState } from 'react';
import { useSelector } from 'react-redux';

type Option =
  | 'My Profile'
  | 'Service History'
  | 'Notification'
  | 'Change Password';

interface ProfileSideBarProps {
  onOptionSelect: (option: Option) => void;
}

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const ProfileSideBar = ({ onOptionSelect }: ProfileSideBarProps) => {
  const { user, email, image } = useSelector(
    (store: { user: { user: string; email: string; image: string } }) =>
      store.user
  );

  const [selectedOption, setSelectedOption] = useState<Option>('My Profile');
  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onOptionSelect(option);
    console.log('Selected:', option);
  };

  return (
    <div className="sidebar w-full sm:w-1/3 md:w-1/4 bg-white p-4 rounded-lg shadow-glow mb-4 sm:mb-0">
      <div className="profile-card mb-0">
        {/* Profile Information */}
        <div className="hidden lg:flex sm:flex md:hidden items-center mb-6 justify-center">
          <img
            src={
              image
                ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${image}`
                : 'image'
            }
            alt="profile"
            className="w-16 h-16 sm:w-14 sm:h-14 rounded-full mr-4"
          />
          <div className="hidden sm:block">
            <p className="font-bold text-lg">{user}</p>
            <p className="font-normal text-gray-500 text-sm">{email}</p>
          </div>
        </div>

        {/* Sidebar Options */}
        <div className="border-t border-gray-200 pt-4">
          {/* Horizontal Layout for Small Screens */}
          <ul className="flex flex-row sm:flex-col justify-between sm:space-y-2 space-x-2 sm:space-x-0">
            <li
              className={`flex items-center justify-center sm:justify-between py-2 px-3 cursor-pointer rounded-lg ${
                selectedOption === 'My Profile'
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleOptionClick('My Profile')}
            >
              <span className="flex items-center space-x-2">
                <span className="material-symbols-outlined">
                  account_circle
                </span>
                <span className="hidden sm:inline">My Profile</span>
              </span>
            </li>

            <li
              className={`flex items-center justify-center sm:justify-between py-2 px-3 cursor-pointer rounded-lg ${
                selectedOption === 'Service History'
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleOptionClick('Service History')}
            >
              <span className="flex items-center space-x-2">
                <span className="material-symbols-outlined">history</span>
                <span className="hidden sm:inline">Service History</span>
              </span>
            </li>

            <li
              className={`flex items-center justify-center sm:justify-between py-2 px-3 cursor-pointer rounded-lg ${
                selectedOption === 'Change Password'
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleOptionClick('Change Password')}
            >
              <span className="flex items-center space-x-2">
                <span className="material-symbols-outlined">key</span>
                <span className="hidden sm:inline">Change Password</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSideBar;
