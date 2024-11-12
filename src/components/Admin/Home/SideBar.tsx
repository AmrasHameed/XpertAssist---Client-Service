import React from "react";
import { Link } from "react-router-dom";
import './navbar.css';

interface SidebarProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const Sidebar = ({ selectedOption, setSelectedOption }: SidebarProps) => {
  const options = [
    { name: "Dashboard", icon: "dashboard", path: "/admin/dashboard" },
    { name: "Jobs", icon: "construction", path: "/admin/jobs" },
    { name: "User Management", icon: "manage_accounts", path: "/admin/user-management" },
    { name: "Expert Management", icon: "supervisor_account", path: "/admin/expert-management" },
    { name: "Service Management", icon: "home_repair_service", path: "/admin/service-management" },
    { name: "Expert Approval", icon: "new_releases", path: "/admin/expert-approval" },
  ];

  return (
    <div className="bg-white p-2 text-black w-64 min-h-screen flex flex-col">
      <div className="text-center text-2xl font-garamond">
        X P E R T A S S I S T
      </div>
      <div className="txt text-center text-2xl font-bold text-shadow-xl text-black font-garamond">
        A &nbsp;&nbsp;&nbsp;D &nbsp;&nbsp;&nbsp;M&nbsp;&nbsp;
        &nbsp;I&nbsp;&nbsp;&nbsp;N
      </div>
      <div className="flex flex-col items-start space-y-4 mt-8">
        {options.map((option) => (
          <Link
            to={option.path}
            key={option.name}
            onClick={() => setSelectedOption(option.name)}
            className={`flex items-center space-x-4 text-lg px-4 py-2 w-full ${
              selectedOption === option.name
                ? "bg-slate-600 text-white border-l-4 border-black"
                : "hover:bg-slate-600 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-5xl">
              {option.icon}
            </span>
            <span>{option.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
