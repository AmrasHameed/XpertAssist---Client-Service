import { useState } from "react";
import Sidebar from "../Home/SideBar";
import NavBar from "../Home/NavBar";
import UserManage from "./UserManage";

const UserManagement = () => {
    const [selectedOption, setSelectedOption] = useState("User Management");
    return (
      <div className="flex">
        <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        <div className="flex-1 flex flex-col">
          <NavBar />
          <UserManage />
        </div>
      </div>
    )
}

export default UserManagement