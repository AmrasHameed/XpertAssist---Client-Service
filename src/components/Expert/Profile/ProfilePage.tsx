import { useState } from 'react';
import Navbar from '../Home/Navbar';
import ProfileDetails from './ProfileDetails';
import ProfileSideBar from './ProfileSideBar';
import ServiceHistory from './ServiceHistory';
import ChangePassword from './ChangePassword';
import Sidebar from '../Home/Sidebar';

type Option =
  | 'My Profile'
  | 'Service History'
  | 'Notification'
  | 'Change Password';

const ProfilePage = () => {
  const [selectedProfile, setSelectedProfile] = useState<Option | ''>(
    'My Profile'
  );

  const [selectedOption, setSelectedOption] = useState('Profile');

  const handleOptionSelect = (option: Option) => {
    setSelectedProfile(option);
    console.log('Option selected in parent:', option);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div className="flex-grow flex flex-col">
        <Navbar />
        <div className="profile-container flex justify-center p-8">
          {/* Sidebar */}
          <ProfileSideBar onOptionSelect={handleOptionSelect} />
          {selectedProfile === 'My Profile' && <ProfileDetails />}
          {selectedProfile === 'Service History' && <ServiceHistory />}
          {selectedProfile === 'Change Password' && <ChangePassword />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
