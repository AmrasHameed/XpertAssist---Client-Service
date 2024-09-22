import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/user/HomePage';
import LoginPage from './pages/user/LoginPage';
import SignUpPage from './pages/user/SignUpPage';
import { useSelector } from 'react-redux';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminHomePage from './pages/admin/AdminHomePage';
import ExpertHomePage from './pages/expert/ExpertHomePage';
import ExpertLogin from './pages/expert/ExpertLogin';
import ExpertSignup from './pages/expert/ExpertSignup';

function App() {
  const  user  = useSelector((store:{ user: { loggedIn: boolean } })=>store.user.loggedIn);
  const admin = useSelector((store:{admin:{loggedIn:boolean}}) => store.admin.loggedIn)
  const expert = useSelector((store:{expert:{loggedIn:boolean}}) => store.expert.loggedIn)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={user ? <Navigate to={'/'}/>:<LoginPage/>} />
          <Route path="/signup" element={user ? <Navigate to={'/'}/>:<SignUpPage/>} />

          <Route path="/expert" element={expert?<ExpertHomePage />:<ExpertLogin/>} />
          <Route path="/expert/login" element={expert? <Navigate to={'/expert'}/>:<ExpertLogin />} />
          <Route path="/expert/signup" element={expert? <Navigate to={'/expert'}/>:<ExpertSignup />} />


          <Route path='/admin' element={admin? <Navigate to={'/admin/dashboard'}/> :<AdminLoginPage/>}/>
          <Route path='/admin/dashboard' element={admin? <AdminHomePage/> : <Navigate to={'/admin'}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
