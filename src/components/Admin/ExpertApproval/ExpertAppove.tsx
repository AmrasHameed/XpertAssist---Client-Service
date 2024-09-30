import  { useState } from 'react'
import Sidebar from '../Home/SideBar';
import NavBar from '../Home/NavBar';
import ExpertApproval from './ExpertApproval';

const ExpertAppove = () => {
    const [selectedOption, setSelectedOption] = useState("Expert Approval");
    return (
      <div className="flex">
        <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        <div className="flex-1 flex flex-col">
          <NavBar />
          <ExpertApproval />
        </div>
      </div>
    )
}

export default ExpertAppove