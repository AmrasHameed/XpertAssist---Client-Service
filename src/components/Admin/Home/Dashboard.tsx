import { RadialChart } from '@/components/Expert/Home/RadialChart';
import { axiosAdmin } from '@/service/axios/axiosAdmin';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PieChart, PieCharts } from './PieChart';
import { RadarCharts } from './RadarChart';

interface Expert {
  expertId: string;
  name: string;
  email: string;
  totalEarning: number;
}

interface Service {
  serviceId: string;
  bookingCount: number;
  name: string;
}


const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [userGrowthRate, setUserGrowthRate] = useState<number>(0);

  const [totalExperts, setTotalExperts] = useState<number>(0);
  const [expertGrowthRate, setExpertGrowthRate] = useState<number>(0);
  const [top5Experts, setTop5Experts] = useState<Expert[]>([]);

  const [totalServices, setTotalServices] = useState<number>(0);
  const [serviceGrowthRate, setServiceGrowthRate] = useState<number>(0);
  const [totalJobsCompleted, setTotalJobsCompleted] = useState<number>(0);
  const [jobCompletionGrowthRate, setJobCompletionGrowthRate] = useState<number>(0);
  const [top5BookedServices, setTop5BookedServices] = useState<Service[]>([]);
  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const { data } = await axiosAdmin().get(`/getDashboardData`);
        console.log(data);
        setTotalUsers(Number(data.userData.totalUsers));
        setUserGrowthRate(data.userData.userGrowthRate);
        setTotalExperts(Number(data.expertData.totalExperts));
        setExpertGrowthRate(data.expertData.expertGrowthRate);
        setTop5Experts(data.expertData.top5Experts);
        setTotalServices(data.serviceData.totalServices);
        setServiceGrowthRate(data.serviceData.serviceGrowthRate);
        setTotalJobsCompleted(data.serviceData.totalJobsCompleted);
        setJobCompletionGrowthRate(data.serviceData.jobCompletionGrowthRate);
        setTop5BookedServices(data.serviceData.top5BookedServices);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    fetchAdminDashboard();
  }, []);
  return (
    <div>
      <div className="flex flex-row p-3 m-2 -mx-1 justify-between space-x-1">
        <RadialChart
          color={'1'}
          value={totalUsers}
          type={'Users'}
          growth={userGrowthRate}
        />
        <RadialChart
          color={'2'}
          value={totalExperts}
          type={'Experts'}
          growth={expertGrowthRate}
        />
        <RadialChart
          color={'3'}
          value={totalServices}
          type={'Services'}
          growth={serviceGrowthRate}
        />
        <RadialChart
          color={'4'}
          value={totalJobsCompleted}
          type={'Jobs Completed'}
          growth={jobCompletionGrowthRate}
        />
      </div>
      <div className='flex flex-row p-3 m-2 -mx-1 justify-between space-x-1'>
        <PieCharts top5Experts={top5Experts}/>
        <RadarCharts top5BookedServices={top5BookedServices}/>
      </div>
    </div>
  );
};

export default Dashboard;
