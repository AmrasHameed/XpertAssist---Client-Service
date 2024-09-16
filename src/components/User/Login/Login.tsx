import { Player } from '@lottiefiles/react-lottie-player';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axiosUser from '../../../service/axios/axiosUser';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../../service/redux/slices/userAuthSlice';
import { LoginFormValues, UserData } from '../../../interfaces/interface';



const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const [userData, setUserData] = useState<UserData>({
    user: '',
    userId: '',
    image: '',
    loggedIn: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await formHandleSubmit(values);
      } catch (err) {
        console.log(err);
      }
      console.log('Login values:', values);
    },
  });

  const formHandleSubmit = async (values: LoginFormValues) => {
    try {
      const { data } = await axiosUser().post('/loginUser', values);
      if (data.message === 'Success') {
        console.log(data, 'logindata');
        setUserData({
          user: data.name,
          userId: data._id,
          image: data.image,
          loggedIn: true,
        });
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        dispatch(userLogin({user: data.name,userId: data._id,image: data.image,loggedIn:true}));
        toast.success('User Logged in Successfully');
        navigate('/');
      } else if (data.message === 'UserNotFound') {
        toast.error('User Not Found');
      } else if (data.message === 'passwordNotMatched') {
        toast.error('Entered password is wrong');
      } else if (data.message === 'blocked') {
        toast.info('Your Account is Blocked');
      } else {
        toast.error('User is not Registered, Please Sign Up!');
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-between px-12">
      <div className="w-1/2 space-y-6">
        <h1 className="text-3xl font-garamond">X P E R T A S S I S T</h1>
        <h2 className="text-3xl font-semibold">User Login</h2>
        <p className="text-gray-600">
          Please login to continue to your account.
        </p>

        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="relative mb-6">
            <input
              type="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="email"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black"
            >
              Email
            </label>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              id="password"
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <label
              htmlFor="password"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black"
            >
              Password
            </label>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800"
          >
            Sign in
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center">
          <span className="text-gray-400">or</span>
        </div>

        <button className="w-full mt-3 flex items-center justify-center bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-100">
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to={'/signup'} className="text-blue-600">
            Sign Up
          </Link>
        </p>
      </div>

      <div className="w-1/2 flex justify-center items-center">
        <Player
          autoplay
          loop
          src={'/Animation - 1726125252610.json'}
          style={{ height: '90%', width: '90%', background: 'transparent' }}
        />
      </div>
    </div>
  );
};

export default Login;
