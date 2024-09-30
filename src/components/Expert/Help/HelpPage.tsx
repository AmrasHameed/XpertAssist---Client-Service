import { useState } from "react";
import Navbar from "../Home/Navbar"
import Sidebar from "../Home/Sidebar"
import Help from "./Help"

const HelpPage = () => {
  const [selectedOption, setSelectedOption] = useState('Help');

  return (
    <div className="flex min-h-screen">
      <Sidebar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div className="flex-grow flex flex-col">
        <Navbar/>
        <div className="flex-grow p-6 bg-gray-100">
          <Help />
        </div>
      </div>
    </div>
  )
}

export default HelpPage