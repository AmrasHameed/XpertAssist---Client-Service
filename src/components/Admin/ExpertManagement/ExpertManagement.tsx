import { useState } from "react";
import Sidebar from "../Home/SideBar";

import NavBar from "../Home/NavBar";
import ExpertManage from "./ExpertManage";


const ExpertManagement = () => {
    const [selectedOption, setSelectedOption] = useState("Expert Management");
    return (
      <div className="flex">
        <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        <div className="flex-1 flex flex-col">
          <NavBar />
          <ExpertManage />
        </div>
      </div>
    )
}

export default ExpertManagement