import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/user/HomePage';
import LoginPage from './pages/user/LoginPage';
import SignUpPage from './pages/user/SignUpPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
