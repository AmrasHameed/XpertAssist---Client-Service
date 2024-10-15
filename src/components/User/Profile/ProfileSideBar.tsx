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

const BUCKET =  import.meta.env.VITE_AWS_S3_BUCKET;
const REGION =  import.meta.env.VITE_AWS_S3_REGION;

const ProfileSideBar = ({ onOptionSelect }: ProfileSideBarProps) => {
  const {user, email, image} = useSelector((store: { user: { user: string , email: string, image: string} }) => store.user);


  const [selectedOption, setSelectedOption] = useState<Option>('My Profile');
  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onOptionSelect(option); 
    console.log('Selected:', option); 
  };

  return (
    <div className="sidebar p-4 w-1/4 bg-white rounded-lg shadow-glow">
      <div className="profile-card mb-8">
        <div className="flex items-center mb-4">
          <img
            src={image?`https://${BUCKET}.s3.${REGION}.amazonaws.com/${image}`:'image'}
            alt="profile"
            className="w-14 h-14 rounded-full mr-4"
          />
          <div>
            <p className="font-bold">{user}</p>
            <p className="font-normal">{email}</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <ul>
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
