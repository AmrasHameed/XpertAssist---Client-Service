import Dashboard from "../pages/Dashboard";
import Earnings from "../pages/Earnings";
import Help from "../pages/Help";
import PrevServices from "../pages/PrevServices";
import Profile from "../pages/Profile";



const Main = ({ selectedOption }: { selectedOption: string }) => {
  return (
    <div className="flex-grow p-6 bg-gray-100">
      {selectedOption === "Dashboard" && <Dashboard />}
      {selectedOption === "Previous Services" && <PrevServices />}
      {selectedOption === "Earnings" && <Earnings />}
      {selectedOption === "Profile" && <Profile />}
      {selectedOption === "Help" && <Help />}
    </div>
  );
};

export default Main;
