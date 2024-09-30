import Sidebar from "./SideBar"
import { useState } from "react";
import Dashboard from "./Dashboard";
import NavBar from "./NavBar";


const Home = () => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");
  return (
    <div className="flex">
      <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <Dashboard />
      </div>
    </div>
  )
}

export default Home