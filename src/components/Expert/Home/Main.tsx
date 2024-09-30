import Dashboard from "./Dashboard";
import Earnings from "../Earnings/Earnings";
import Help from "../Help/Help";
import PrevServices from "../PreviousServices/PrevServices";
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
