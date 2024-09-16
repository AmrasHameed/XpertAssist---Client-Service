import { Player } from '@lottiefiles/react-lottie-player';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosUser from '../../../service/axios/axiosUser';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { SignupData, UserData } from '../../../interfaces/interface';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../../service/redux/slices/userAuthSlice';



const SignUp = () => {
  const [userData, setUserData] = useState<UserData>({
    user: '',
    userId: '',
    image: '',
    loggedIn: false,
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    setImageUrl: React.Dispatch<React.SetStateAction<string | null>>,
    formik: any
  ) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue(fieldName, file);

      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    } else {
      setImageUrl(null);
      formik.setFieldValue(fieldName, null);
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
      .required('Mobile number is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
    image: Yup.mixed()
      .required('Profile image is required')
      .test(
        'fileSize',
        'File too large',
        (value) => value && value.size <= 5 * 1024 * 1024
      ) // 2MB limit
      .test(
        'fileType',
        'Unsupported File Format',
        (value) =>
          value &&
          [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/avif',
            'image/webp',
          ].includes(value.type)
      ),
  });

  const formik = useFormik<SignupData>({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values: SignupData) => {
      const formData = new FormData();
      console.log(values.image, 'image');
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('mobile', values.mobile);
      formData.append('password', values.password);
      formData.append('confirmPassword', values.confirmPassword);
      if (values.image) {
        formData.append('image', values.image);
      }

      try {
        const { data } = await axiosUser().post('/registerUser', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (data.message === 'Success') {
          console.log(data,"signup data")
          setUserData({
            user: data.name,
            userId: data._id,
            image: data.image,
            loggedIn: true,
          });
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          dispatch(userLogin({user: data.name,userId: data._id,image: data.image,loggedIn:true}));
          toast.success('User registered successfully');
          navigate('/');
        } else if (data.message === 'UserExist') {
          toast.error('User Already Exists');
        } else {
          toast.error('User is not Registered, Please Sign Up!');
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occurred during registration');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-between px-10">
      {/* Left side - Signup Form */}
      <div className="w-1/2 space-y-1">
        <h1 className="text-3xl font-garamond">X P E R T A S S I S T</h1>
        <h2 className="text-xl font-semibold">User Sign Up</h2>

        <form onSubmit={formik.handleSubmit}>
          {/* Name Field */}
          <div className="relative mb-4 mt-3">
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Name"
            />
            <label
              htmlFor="name"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Name
            </label>
            {formik.errors.name && formik.touched.name ? (
              <div className="text-red-600 text-sm">{formik.errors.name}</div>
            ) : null}
          </div>

          {/* Email Field */}
          <div className="relative mb-4">
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Email"
            />
            <label
              htmlFor="email"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Email
            </label>
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-600 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>

          {/* Mobile Number Field */}
          <div className="relative mb-4">
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Mobile Number"
            />
            <label
              htmlFor="mobile"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Mobile Number
            </label>
            {formik.errors.mobile && formik.touched.mobile ? (
              <div className="text-red-600 text-sm">{formik.errors.mobile}</div>
            ) : null}
          </div>

          {/* Profile Image Field */}
          <div className="relative mb-4">
            <input
              type="file"
              id="image"
              name="image"
              onChange={(e) =>
                handleFileChange(e, 'image', setImageUrl, formik)
              }
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <label
              htmlFor="image"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Profile Image
            </label>
            {formik.errors.image && formik.touched.image ? (
              <div className="text-red-600 text-sm">{formik.errors.image}</div>
            ) : null}
          </div>

          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover"
              />
            </div>
          )}

          {/* Password Field */}
          <div className="relative mb-4">
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Password
            </label>
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-600 text-sm">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          {/* Confirm Password Field */}
          <div className="relative mb-4">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
              placeholder="Confirm Password"
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-600"
            >
              Confirm Password
            </label>
            {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
              <div className="text-red-600 text-sm">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Sign Up
          </button>
        </form>
        <div className="-mt-10 flex items-center justify-center">
          <span className="text-gray-400">or</span>
        </div>

        <button className="w-full mt-1 flex items-center justify-center bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-100">
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          Sign up with Google
        </button>

        <p className=" text-center text-gray-600 text-md">
          Already have an account?{' '}
          <Link to={'/login'} className="text-blue-500 font-semibold">
            Log in
          </Link>
        </p>
      </div>

      {/* Right side - Lottie Animation */}
      <div className="w-1/2 flex justify-center items-center">
        <Player
          autoplay
          loop
          src="/Animation - 1726125252610.json"
          style={{ height: '300px', width: '300px' }}
        />
      </div>
    </div>
  );
};

export default SignUp;
