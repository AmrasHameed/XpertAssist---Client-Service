import { useState } from 'react';
import Navbar from '../Home/Navbar';
import Sidebar from '../Home/Sidebar';
import PrevServices from './PrevServices';

const PreviousServices = () => {
  const [selectedOption, setSelectedOption] = useState('Previous Services');
  return (
    <div className="flex min-h-screen">
      <Sidebar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div className="flex-grow flex flex-col">
        <Navbar />
        <div className="flex-grow p-6 bg-gray-100">
          <PrevServices />
        </div>
      </div>
    </div>
  );
};

export default PreviousServices;
