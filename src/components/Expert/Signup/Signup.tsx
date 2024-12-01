/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tooltip } from 'react-tooltip';
import { Player } from '@lottiefiles/react-lottie-player';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosExpert from '../../../service/axios/axiosExpert';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Service, SignupData } from '../../../interfaces/interface';
import { useDispatch, useSelector } from 'react-redux';
import { expertLogin } from '../../../service/redux/slices/expertAuthSlice';
import { FaSpinner } from 'react-icons/fa';

const SignUp = () => {
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));
  const [otpPage, setOtpPage] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [, setIsResendVisible] = useState<boolean>(false);
  const [isLoading, SetIsLoading] = useState<boolean>(false);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleSelect = (service) => {
    formik.setFieldValue('service', service._id);
    setIsOpen(false);
  };

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

  const handleResend = async () => {
    setOtp(new Array(4).fill(''));
    setTimeLeft(30);
    setIsResendVisible(false);
    try {
      const { data } = await axiosExpert().post('/expertResendOtp', {
        email: formik.values.email,
        name: formik.values.name,
      });
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
    service: Yup.string().required('Please select a service'),
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (value) => value && value.size <= 5 * 1024 * 1024
      )
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
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
      service: '',
    },
    validationSchema,
    onSubmit: async (values: SignupData) => {
      try {
        SetIsLoading(true);
        await signupOtp(values.email, values.name);
      } catch (err: unknown) {
        SetIsLoading(false);
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log('An unknown error occurred');
        }
      }
    },
  });

  const handleVerify = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      event.preventDefault();
      SetIsLoading(true);
      const otpCode = otp.join('');
      const formData = new FormData();
      formData.append('name', formik.values.name);
      formData.append('email', formik.values.email);
      formData.append('mobile', formik.values.mobile);
      formData.append('service', formik.values.service);
      formData.append('password', formik.values.password);
      formData.append('otp', otpCode.toString());
      if (formik.values.image) {
        formData.append('image', formik.values.image);
      }

      try {
        const { data } = await axiosExpert().post('/registerExpert', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (data.message === 'Success') {
          localStorage.setItem('expertToken', data.token);
          localStorage.setItem('expertRefreshToken', data.refreshToken);
          dispatch(
            expertLogin({
              expert: data.name,
              expertId: data._id,
              email: data.email,
              service: data.service,
              mobile: data.mobile,
              image: data.image,
              isVerified: data.isVerified,
              loggedIn: true,
            })
          );
          toast.success('Expert registered successfully');
          SetIsLoading(false);
          navigate('/expert');
        } else if (data.message === 'UserExist') {
          SetIsLoading(false);
          toast.error('User Already Exists');
        } else if (data.message === 'OTP does not match or is not found.') {
          SetIsLoading(false);
          toast.error('OTP does not match or is not found.');
        } else {
          SetIsLoading(false);
          toast.error('User is not Registered, Please Sign Up!');
        }
      } catch (error) {
        SetIsLoading(false);
        console.error(error);
        toast.error('An error occurred during registration');
      }
    } catch (error) {
      SetIsLoading(false);
      toast.error((error as Error).message);
    }
  };

  const signupOtp = async (email: string, name: string): Promise<void> => {
    try {
      const { data } = await axiosExpert().post('/expertSignupOtp', {
        email,
        name,
      });
      if (data.message === 'UserExist') {
        SetIsLoading(false);
        toast.error('User Already Exists');
      } else {
        SetIsLoading(false);
        toast.success('OTP sent Successfully');
        setOtpPage(true);
      }
    } catch (error) {
      SetIsLoading(false);
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
      {otpPage ? (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-10">
          {/* Left side - OTP Form */}
          <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
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
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
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
                  className="w-full py-2 mt-4 bg-black text-white rounded hover:bg-gray-800 flex items-center justify-center"
                >
                  {isLoading && <FaSpinner className="animate-spin mr-2" />}{' '}
                  Verify
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Lottie Animation */}
          <div className="hidden md:flex w-full md:w-1/2 justify-center items-center mt-0 md:mt-0">
            <Player
              autoplay
              loop
              src="/Animation - 1726125252610.json"
              style={{ height: '300px', width: '300px' }}
            />
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-10">
          {/* Left side - Signup Form */}
          <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
            <h1 className="text-3xl font-garamond text-center md:text-left">
              X P E R T A S S I S T
            </h1>
            <h2 className="text-2xl font-semibold text-center md:text-left">
              Expert Sign Up
            </h2>

            <form onSubmit={formik.handleSubmit}>
              {/* Name Field */}
              <div className="relative mb-4">
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
                {formik.errors.name && formik.touched.name && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.name}
                  </div>
                )}
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
                {formik.errors.email && formik.touched.email && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.email}
                  </div>
                )}
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
                {formik.errors.mobile && formik.touched.mobile && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.mobile}
                  </div>
                )}
              </div>

              {/* Service Selection Field */}
              <div className="relative mb-4">
                <div
                  className="peer w-full p-2 border bg-gray-200 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black cursor-pointer flex items-center justify-between"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="flex-2">
                    {formik.values.service
                      ? services.find(
                          (service) => service._id === formik.values.service
                        )?.name
                      : 'Select a service you want to provide'}
                  </span>
                  <span className="flex-shrink-2">
                    <span
                      className={`material-symbols-outlined w-6 h-6 transition-transform ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    >
                      arrow_drop_down
                    </span>
                  </span>
                </div>
                {isOpen && (
                  <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 z-10">
                    {services.map((service) => (
                      <li
                        key={service._id}
                        className="p-2 hover:bg-gray-200 relative"
                        onClick={() => handleSelect(service)}
                        data-tooltip-id={`tooltip-${service._id}`}
                      >
                        {service.name}
                        <Tooltip
                          id={`tooltip-${service._id}`}
                          className="bg-gray-700 text-white"
                        >
                          {service.description}
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                )}
                {formik.errors.service && formik.touched.service && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.service}
                  </div>
                )}
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
                {formik.errors.image && formik.touched.image && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.image}
                  </div>
                )}
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
                {formik.errors.password && formik.touched.password && (
                  <div className="text-red-600 text-sm">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative mb-6">
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
                  formik.touched.confirmPassword && (
                    <div className="text-red-600 text-sm">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </div>

              <p className=" text-center text-gray-600 text-md">
                Already have an account?{' '}
                <Link to={'/expert'} className="text-blue-500 font-semibold">
                  Log in
                </Link>
              </p>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-black text-white rounded hover:bg-gray-800 flex items-center justify-center"
              >
                {isLoading && <FaSpinner className="animate-spin mr-2" />} Sign
                Up
              </button>
            </form>
          </div>

          {/* Right side - Lottie Animation */}
          <div className="w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
            <Player
              autoplay
              loop
              src="/Animation - 1726125252610.json"
              style={{ height: '300px', width: '300px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
