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
  const expert = useSelector(
    (store: {
      expert: {
        expertId: string;
        email: string;
        expert: string;
        image?: string;
        service?: string;
      };
    }) => store.expert
  );
  const [selectedOption, setSelectedOption] = useState<Option>('My Profile');
  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onOptionSelect(option);
    console.log('Selected:', option);
  };

  return (
    <div className="sidebar border-2 shadow-2xl p-4 w-[30%] bg-white rounded-lg">
      <div className="profile-card mb-8">
        <div className="flex items-center mb-4">
          <img
            src={expert.image?`https://${BUCKET}.s3.${REGION}.amazonaws.com/${expert.image}`:'image'}
            alt="profile"
            className="w-14 h-14 rounded-full mr-4 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            {' '}
            <p className="font-bold text-gray-900 truncate">{expert.expert}</p>
            <p className="text-gray-600 truncate">{expert.email}</p>
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

            <li className="flex justify-between py-3 cursor-pointer">
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
