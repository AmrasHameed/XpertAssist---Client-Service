import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import axiosExpert from '../../../service/axios/axiosExpert';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ExpertNewPass from './ExpertNewPass';
import * as Yup from 'yup'; 


const ExpertForgotPassword = () => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(''));
  const [otpPage, setOtpPage] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false); 

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

  const handleVerify = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      event.preventDefault();
      const otpCode = otp.join('');
      const formData = new FormData();
      formData.append('email', formik.values.email);
      formData.append('otp', otpCode.toString());
      const { data } = await axiosExpert().post('/otpVerify', formData);
      if (data.message === 'success') {
        toast.success('OTP matched Successfully');
        setShowNewPassword(true); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleResend = async () => {
    setOtp(new Array(4).fill(''));
    setTimeLeft(30);
    try {
      const { data } = await axiosExpert().post('/resendOtp', {
        email: formik.values.email,
        name: 'User'
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
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });


  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await forgotOtp(values.email);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log('An unknown error occurred');
        }
      }
    },
  });

  const forgotOtp = async (email: string): Promise<void> => {
    try {
      const { data } = await axiosExpert().post('/forgotPassOtp', { email });
      if (data.message === 'OTP sent') {
        toast.success('OTP sent Successfully');
        setOtpPage(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
  {showNewPassword ? (
    <ExpertNewPass email={formik.values.email} />
  ) : otpPage ? (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-10">
      <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-md">
            <h1 className="text-2xl font-semibold text-center">Verify OTP</h1>
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
            <button
              onClick={handleVerify}
              className="w-full py-2 mt-4 bg-black text-white rounded hover:bg-gray-800"
            >
              Verify
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-full md:w-1/2 justify-center items-center mt-8 md:mt-0">
        <Player
          autoplay
          loop
          src="/Animation - 1726125252610.json"
          style={{ height: '300px', width: '300px' }}
        />
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
      <div className="w-full md:w-1/2 space-y-6">
        <h1 className="text-3xl font-garamond">X P E R T A S S I S T</h1>
        <h2 className="text-3xl font-semibold">Forgot Password</h2>
        <p className="text-gray-600">
          Enter your email address and we will send you a link to reset your password.
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

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800"
          >
            Send OTP
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Remember your password?{' '}
          <Link to={'/expert'} className="text-blue-600">
            Sign In
          </Link>
        </p>
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center mt-4 md:mt-0">
        <Player
          autoplay
          loop
          src={'/Animation - 1726125252610.json'}
          style={{ height: '90%', width: '90%', background: 'transparent' }}
        />
      </div>
    </div>
  )}
</div>

  );
};

export default ExpertForgotPassword;
