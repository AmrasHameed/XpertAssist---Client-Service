import '../../Admin/Home/navbar.css'
import { Link } from "react-router-dom";

interface SidebarProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
}

const Sidebar= ({ selectedOption, setSelectedOption }:SidebarProps) => {
  const options = [
    { name: "Dashboard", icon: "dashboard", path:'/expert'},
    { name: "Previous Services", icon: "undo", path:'/expert/previous-services' },
    { name: "Earnings", icon: "paid", path:'/expert/earnings' },
    { name: "Profile", icon: "account_circle", path:'/expert/profile' },
    { name: "Help", icon: "help", path:'/expert/help' },
  ];

  return (
    <div className="bg-white p-2 text-black w-64 min-h-screen flex flex-col border-r-2">
      <div className="text-center text-2xl font-garamond">
        X P E R T A S S I S T
      </div>
      <div className="txt text-center text-2xl font-bold text-shadow-lg font-garamond">
        E &nbsp;&nbsp;X &nbsp;&nbsp;P &nbsp;&nbsp;E &nbsp;&nbsp;R &nbsp;&nbsp;T
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


