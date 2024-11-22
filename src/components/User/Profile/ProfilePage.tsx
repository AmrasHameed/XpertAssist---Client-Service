import { useState } from 'react';
import Navbar from '../Home/Navbar';
import ProfileDetails from './ProfileDetails';
import ProfileSideBar from './ProfileSideBar';
import ServiceHistory from './ServiceHistory';
import ChangePassword from './ChangePassword';
import Footer from '../Home/Footer';



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
      <Navbar activePage="profile" />
      <div className="profile-container bg-gradient-to-b from-black via-black to-white flex flex-col sm:flex-row justify-center p-11">
        {/* Sidebar */}
        <ProfileSideBar onOptionSelect={handleOptionSelect}/>
        {selectedOption === 'My Profile' && <ProfileDetails />}
        {selectedOption === 'Service History' && <ServiceHistory />}
        {selectedOption === 'Change Password' && <ChangePassword />}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
