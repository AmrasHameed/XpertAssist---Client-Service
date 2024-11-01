import { useEffect } from 'react';
import { setServices } from '../../../service/redux/slices/serviceSlice';
import { useDispatch } from 'react-redux';
import axiosExpert from '../../../service/axios/axiosExpert';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const { data } = await axiosExpert().get('/getServices');
      if (data) {
        dispatch(setServices(data));
      } else {
        toast.error('No Services Found');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return <div>Dashboard</div>;
};

export default Dashboard;
