import Dashboard from "./Dashboard";
import Wallet from "../Wallet/Wallet";
import Help from "../Help/Help";
import PrevServices from "../PreviousServices/PrevServices";
import ProfilePage from "../Profile/ProfilePage";
import CurrentJobExpert from "../Jobs/CurrentJobExpert";



const Main = ({ selectedOption }: { selectedOption: string }) => {
  return (
    <div className="flex-grow p-6 bg-gray-100">
      {selectedOption === "Dashboard" && <Dashboard />}
      {selectedOption === "Job Status" && <CurrentJobExpert />}
      {selectedOption === "Previous Services" && <PrevServices />}
      {selectedOption === "Wallet" && <Wallet />}
      {selectedOption === "Profile" && <ProfilePage />}
      {selectedOption === "Help" && <Help />}
    </div>
  );
};

export default Main;
