import { useEffect, useState } from 'react';
import { setServices } from '../../../service/redux/slices/serviceSlice';
import { useDispatch, useSelector } from 'react-redux';
import axiosExpert from '../../../service/axios/axiosExpert';
import { toast } from 'react-toastify';
import { RadialChart } from './RadialChart';
import { RootState } from '@/service/redux/store';
import { BarChartMonthly } from './BarChart';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [totalEarning, setTotalEarning] = useState(0);
  const [jobCompletionRate, setJobCompletionRate] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [dailyEarnings, setDailyEarnings] = useState([]);
  const [totalEarningsGrowth, setTotalEarningsGrowth] = useState<number | null>(
    null
  );
  const [totalJobsGrowth, setTotalJobsGrowth] = useState<number | null>(null);
  const [totalCompletedJobsGrowth, setTotalCompletedJobsGrowth] = useState<
    number | null
  >(null);
  const [totalDistanceGrowth, setTotalDistanceGrowth] = useState<number | null>(
    null
  );

  const expert = useSelector((store: RootState) => store.expert);
  const expertId = expert.expertId;
  useEffect(() => {
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
    const fetchExpertData = async () => {
      try {
        const { data } = await axiosExpert().get(
          `/getExpertDashboard/${expertId}`
        );
        setTotalDistance(data.totalDistance);
        setTotalJobs(data?.totalJobs);
        setTotalEarning(data?.totalEarnings);
        setJobCompletionRate(data?.totalCompletedJobs);
        setTotalCompletedJobsGrowth(data?.totalCompletedJobsGrowth);
        setTotalDistanceGrowth(data?.totalDistanceGrowth);
        setTotalEarningsGrowth(data?.totalEarningsGrowth);
        setTotalJobsGrowth(data?.totalJobsGrowth);
        setDailyEarnings(data?.dailyEarningsCurrentMonth);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    fetchExpertData();
    fetchServiceData();
  }, [dispatch, expertId]);

  if (expert.isVerified === 'false') {
    return (
      <div className="flex flex-col items-center">
        <div className="text-center text-xl text-red-500 font-bold">
          Get Verified to Recieve Service Requests
        </div>
        <Link to={'/expert/profile'}>
          <button className="bg-gray-800 text-white py-1 px-3 rounded hover:bg-black">
            {' '}
            Verify{' '}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row p-3 m-2 -mx-1 justify-between space-x-1">
        <RadialChart
          color={'1'}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          value={totalEarning.toFixed(2)}
          type={'Earning'}
          growth={totalEarningsGrowth}
        />
        <RadialChart
          color={'2'}
          value={jobCompletionRate}
          type={'Jobs Completed'}
          growth={totalCompletedJobsGrowth}
        />
        <RadialChart
          color={'3'}
          value={totalJobs}
          type={'Total Jobs'}
          growth={totalJobsGrowth}
        />
        <RadialChart
          color={'4'}
          value={totalDistance}
          type={'Total Distance'}
          growth={totalDistanceGrowth}
        />
      </div>

      <div className="p-2">
        <BarChartMonthly dailyEarnings={dailyEarnings} />
      </div>
    </div>
  );
};

export default Dashboard;
