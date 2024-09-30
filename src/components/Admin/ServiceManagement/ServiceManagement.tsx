import { useState } from "react";
import Sidebar from "../Home/SideBar";
import NavBar from "../Home/NavBar";
import ServiceManage from "./ServiceManage";


const ServiceManagement = () => {
  const [selectedOption, setSelectedOption] = useState("Service Management");
  return (
    <div className="flex">
      <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <ServiceManage />
      </div>
    </div>
  )
}

export default ServiceManagement