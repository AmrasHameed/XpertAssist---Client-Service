import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import axiosExpert from '../service/axios/axiosExpert';
import { useEffect, useState } from 'react';
import Loading from './Loading';
import { expertLogout } from '../service/redux/slices/expertAuthSlice';

const ExpertPrivateRoute = () => {
  const { loggedIn, expertId } = useSelector(
    (store: { expert: { loggedIn: boolean; expertId: string } }) => store.expert
  );
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn) {
        try {
          const { data } = await axiosExpert().get(`/isBlocked/${expertId}`);
          if (data.message === 'Blocked') {
            dispatch(expertLogout());
            setIsBlocked(true);
          } else {
            setIsBlocked(false);
          }
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
    return (
      <div className="flex flex-row justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (!loggedIn || isBlocked) {
    return <Navigate to={'/expert'} replace />;
  }
  
  return <Outlet />;
};

export default ExpertPrivateRoute;
