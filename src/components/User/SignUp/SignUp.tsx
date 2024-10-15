import { Player } from '@lottiefiles/react-lottie-player';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosUser from '../../../service/axios/axiosUser';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { SignupData } from '../../../interfaces/interface';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../../service/redux/slices/userAuthSlice';

const SignUp = () => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));
  const [otpPage, setOtpPage] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [, setIsResendVisible] = useState<boolean>(false);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (otpPage && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevCounter) => prevCounter - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, otpPage]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleResend = async() => {
    setOtp(new Array(4).fill(''));
    setTimeLeft(30);
    setIsResendVisible(false);
    try {
      const { data } = await axiosUser().post('/resendOtp', { email:formik.values.email, name: formik.values.name });
      if (data.message === 'OTP sent') {
        toast.success('OTP sent Successfully');
        setOtpPage(true);
      } else {
        toast.error('Failed to send OTP.');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
    console.log('Resending OTP...');
  };

  const handleVerify = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      event.preventDefault();
      const otpCode = otp.join('');
      const formData = new FormData();
      formData.append('name', formik.values.name);
      formData.append('email', formik.values.email);
      formData.append('mobile', formik.values.mobile);
      formData.append('password', formik.values.password);
      formData.append('otp', otpCode.toString());
      if (formik.values.image) {
        formData.append('image', formik.values.image);
      }
      const { data } = await axiosUser().post('/registerUser', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.message === 'Success') {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        dispatch(
          userLogin({
            user: data.name,
            userId: data._id,
            image: data.image,
            email: data.email,
            mobile: data.mobile,
            loggedIn: true,
          })
        );
        toast.success('User registered successfully');
        navigate('/');
      } else if (data.message === 'UserExist') {
        toast.error('User Already Exists');
      } else if (data.message === 'OTP does not match or is not found.') {
        toast.error('OTP does not match or is not found.');
      } else {
        toast.error('User is not Registered, Please Sign Up!');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const dispatch = useDispatch();
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
      try {
        await signupOtp(values.email, values.name);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log('An unknown error occurred');
        }
      }
    },
  });

  const signupOtp = async (email: string, name: string): Promise<void> => {
    try {
      const { data } = await axiosUser().post('/signupOtp', { email, name });
      if (data.message === 'UserExist') {
        toast.error('User Already Exists');
      } else if(data.message === 'Failed to send OTP.') {
        toast.error('Failed to send OTP.');
      } else {
        toast.success('OTP sent Successfully');
        setOtpPage(true);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
      {otpPage ? (
        <div className="min-h-screen flex items-center justify-between px-10">
          {/* Left side - Signup Form */}
          <div className="w-1/2 space-y-1">
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-md">
                <h1 className="text-2xl font-semibold text-center">
                  Verify OTP
                </h1>

                {/* OTP Input Fields */}
                <div className="flex justify-center space-x-2">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="w-12 h-12 text-center border rounded text-lg focus:outline-none focus:ring-2 focus:ring-black"
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                    />
                  ))}
                </div>

                {/* Timer or Resend OTP */}
                <div className="text-center mt-4">
                  {timeLeft > 0 ? (
                    <p className="text-gray-600">
                      Resend OTP in {timeLeft} seconds
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="text-blue-500 font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  className="w-full py-2 mt-4 bg-black text-white rounded hover:bg-gray-800"
                >
                  Verify
                </button>
              </div>
            </div>
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
      ) : (
        //  Left side - Signup Form

        <div className="min-h-screen flex items-center justify-between px-10">
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
                  <div className="text-red-600 text-sm">
                    {formik.errors.name}
                  </div>
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
                  <div className="text-red-600 text-sm">
                    {formik.errors.email}
                  </div>
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
                  <div className="text-red-600 text-sm">
                    {formik.errors.mobile}
                  </div>
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
                  <div className="text-red-600 text-sm">
                    {formik.errors.image}
                  </div>
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
                {formik.errors.confirmPassword &&
                formik.touched.confirmPassword ? (
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

            <p className=" text-center text-gray-600 text-md mt-6">
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
              style={{ height: '400px', width: '400px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
