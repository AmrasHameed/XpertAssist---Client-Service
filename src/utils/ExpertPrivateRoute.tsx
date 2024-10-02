import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import axiosExpert from '../service/axios/axiosExpert';
import { useEffect, useState } from 'react';

const ExpertPrivateRoute = () => {
  const { loggedIn, expertId } = useSelector(
    (store: { expert: { loggedIn: boolean; expertId: string } }) => store.expert
  );
  console.log('ethiiiiiii')
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn) {
        try {
          const { data } = await axiosExpert().get(`/isBlocked/${expertId}`);
          console.log(data,'bloopockkkc')
          setIsBlocked(data.message === 'Blocked');
        } catch (error) {
          console.error('Error fetching block status', error);
          setIsBlocked(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, [loggedIn, expertId]);
  if (loading) {
    return <div>Loading...</div>; 
  }
  if (!loggedIn || isBlocked) {
    return <Navigate to={'/expert/login'} replace />;
  }

  return <Outlet />;
};

export default ExpertPrivateRoute;
