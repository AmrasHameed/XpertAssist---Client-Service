import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { LoginFormValues } from '../../../interfaces/interface';
import {axiosAdmin} from '../../../service/axios/axiosAdmin';
import { adminLogin } from '../../../service/redux/slices/adminAuthSlice';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
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
    },
  });

  const formHandleSubmit = async (values: LoginFormValues) => {
    try {
      const { data } = await axiosAdmin().post('/adminLogin', values);
      if (data.message === 'Success') {
        console.log(data, 'logindata');
        localStorage.setItem('adminToken', data.token);
        dispatch(adminLogin({ name: data.name, loggedIn: true }));
        toast.success('Admin Logged in Successfully');
        navigate('/admin/dashboard');
      } else if (data.message === 'Invalid Credentials') {
        toast.error('Invalid Credentials');
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-between px-12">
      <div className="w-1/2 space-y-8">
        <h1 className="text-3xl font-garamond">X P E R T A S S I S T</h1>
        <h2 className="text-3xl font-semibold">Admin Login</h2>
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
              className="absolute left-2 top-[-0.75rem] text-sm text-gray-600 bg-white px-1"
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
              className="absolute left-2 top-[-0.75rem] text-sm text-gray-600 bg-white px-1"
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
