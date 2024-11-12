import { useState } from "react";
import Sidebar from "../Home/SideBar";
import NavBar from "../Home/NavBar";
import JobsHistory from "./JobsHistory";

const Jobs = () => {
  const [selectedOption, setSelectedOption] = useState("Jobs");

  return (
    <div className="flex">
      <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <JobsHistory />
      </div>
    </div>
  )
}

export default Jobs