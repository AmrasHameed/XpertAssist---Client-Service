import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axiosUser from '../service/axios/axiosUser';
import { useEffect, useState } from "react";
import { userLogout } from "../service/redux/slices/userAuthSlice";
import Loading from "./Loading";

const UserPrivateRoute = () => {
  const { loggedIn, userId } = useSelector(
    (store: { user: { loggedIn: boolean; userId: string } }) => store.user
  );
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn) {
        try {
          const { data } = await axiosUser().get(`/isBlocked/${userId}`);
          if (data.message === 'Blocked') {
            dispatch(userLogout());
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
  }, [dispatch, loggedIn, userId]);

  if (loading) {
    return (
      <div className="flex flex-row justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (!loggedIn || isBlocked) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default UserPrivateRoute;
