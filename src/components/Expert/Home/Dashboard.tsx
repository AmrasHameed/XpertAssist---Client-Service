import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosExpert from '../../../service/axios/axiosExpert';
import { toast } from "react-toastify";
import { setServices } from "../../../service/redux/slices/serviceSlice";


const Dashboard = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const { data } = await axiosExpert().get('/getServices');
      if (data) {
        dispatch(setServices(data))
      } else {
        toast.error('No Services Found');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">You have a new job request</h2>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p><strong>Service: </strong>Plumbing (Small Est. 1 hr)</p>
            <p><strong>Location: </strong>Chalad, Kannur, Kerala</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">Accept</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">Decline</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-200 p-4 rounded-lg">
            <p>Company Account</p>
            <p className="text-xl font-bold">1,344</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <p>Debtors</p>
            <p className="text-xl font-bold">13,443</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <p>All Agents</p>
            <p className="text-xl font-bold">1,443</p>
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <p>Active Agents</p>
            <p className="text-xl font-bold">13,443</p>
          </div>
        </div>
        {/* Add your charts and other components here */}
      </div>
    </div>
  )
}

export default Dashboard