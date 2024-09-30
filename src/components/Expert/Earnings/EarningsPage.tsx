import { useState } from 'react';
import Navbar from '../Home/Navbar';
import Sidebar from '../Home/Sidebar';
import Earnings from './Earnings';

const EarningsPage = () => {
  const [selectedOption, setSelectedOption] = useState('Earnings');

  return (
    <div className="flex min-h-screen">
      <Sidebar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div className="flex-grow flex flex-col">
        <Navbar />
        <div className="flex-grow p-6 bg-gray-100">
          <Earnings />
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
