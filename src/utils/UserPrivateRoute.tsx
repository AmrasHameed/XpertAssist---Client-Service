import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axiosUser from '../service/axios/axiosUser'
import { useEffect, useState } from "react";

const UserPrivateRoute = () => {
  const { loggedIn, userId } = useSelector((store: { user: { loggedIn: boolean ; userId: string} }) => store.user);
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null); 
  useEffect(()=>{
    fetchData()
  },[])
  const fetchData = async () => {
    const { data } = await axiosUser().get(`/isBlocked/${userId}`)
    if(data.message === 'Blocked') {
      setIsBlocked(true)
    } else if(data.message === 'UnBlocked') {
      setIsBlocked(false)
    }
  }

  if (!loggedIn) {
    return <Navigate to={'/login'} replace />;
  }

  if (isBlocked) {
    return <Navigate to={'/login'} replace />;
  }

  return <Outlet />;
};

export default UserPrivateRoute;
