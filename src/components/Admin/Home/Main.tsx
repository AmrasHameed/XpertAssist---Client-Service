import Dashboard from "../pages/Dashboard";
import ExpertManage from "../pages/ExpertManage";
import ServiceManage from "../pages/ServiceManage";
import UserManage from "../pages/UserManage";
import ExpertApproval from "../pages/ExpertApproval";


const Main = ({ selectedOption }: { selectedOption: string }) => {
  return (
    <div className="flex-grow p-6 bg-gray-100">
      {selectedOption === "Dashboard" && <Dashboard />}
      {selectedOption === "User Management" && <UserManage />}
      {selectedOption === "Expert Management" && <ExpertManage />}
      {selectedOption === "Service Management" && <ServiceManage />}
      {selectedOption === "Expert Approval" && <ExpertApproval />}
    </div>
  );
};

export default Main