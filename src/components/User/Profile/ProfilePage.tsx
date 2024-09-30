import { useEffect, useState } from 'react';
import axiosUser from '../../../service/axios/axiosUser';
import Navbar from '../Home/Navbar';
import { toast } from 'react-toastify';
import ProfileDetails from './ProfileDetails';
import ProfileSideBar from './ProfileSideBar';
import ServiceHistory from './ServiceHistory';
import ChangePassword from './ChangePassword';

interface ProfileValues {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

type Option =
  | 'My Profile'
  | 'Service History'
  | 'Notification'
  | 'Change Password';

const ProfilePage = () => {
  
  const [selectedOption, setSelectedOption] = useState<Option | ''>('My Profile');

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    console.log('Option selected in parent:', option);
  };


  return (
    <div>
      <Navbar activePage="" />
      <div className="profile-container bg-gradient-to-b from-black via-black to-white flex justify-center p-8">
        {/* Sidebar */}
        <ProfileSideBar onOptionSelect={handleOptionSelect}/>
        {selectedOption === 'My Profile' && <ProfileDetails />}
        {selectedOption === 'Service History' && <ServiceHistory />}
        {selectedOption === 'Change Password' && <ChangePassword />}
      </div>
    </div>
  );
};

export default ProfilePage;
