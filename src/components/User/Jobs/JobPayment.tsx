/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import Footer from '../Home/Footer';
import Navbar from '../Home/Navbar';
import axiosUser from '../../../service/axios/axiosUser';
import { useDispatch, useSelector } from 'react-redux';
import { Service } from '../../../interfaces/interface';
import { toast } from 'react-toastify';
import Loading from '../../../utils/Loading';
import { RootState } from '../../../service/redux/store';
import { useNavigate } from 'react-router-dom';
import { removeMessage } from '../../../service/redux/slices/messageSlice';
import { useSocket } from '../../../Context/SocketContext';
import { Player } from '@lottiefiles/react-lottie-player';

interface JobData {
  pin: string;
  service: string;
  notes: string;
  status: string;
  distance: number;
  totalAmount: number;
  ratePerHour: number;
  expertId?: string;
  userId: string;
  serviceName: string;
  serviceBasePrice: number;
}

const JobPayment = () => {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const jobId = localStorage.getItem('currentJob-user');
  const [loading, setLoading] = useState<boolean>(true);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isWaitingCash, setIsWaitingCash] = useState<boolean>();
  const [redirect, setRedirect] = useState<boolean>(false);
  const socket = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );
  const [countdown, setCountdown] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (localStorage.getItem('redirectAfterCashReceived') === 'true') {
      setCountdown(5);
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(intervalRef.current!);
            navigate('/request-service');
            localStorage.removeItem('redirectAfterCashReceived');
            localStorage.removeItem('isWaitingCash');
            return null;
          }
          return prevCountdown !== null ? prevCountdown - 1 : null;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [navigate, setCountdown, redirect]);

  useEffect(() => {
    const storedValue = localStorage.getItem('isWaitingCash');
    if (storedValue !== null) {
      setIsWaitingCash(JSON.parse(storedValue));
    }
  }, []);

  useEffect(() => {
    socket?.on('newTokens', (data) => {
      const { token, refreshToken } = data;
      localStorage.setItem('expertToken', token);
      localStorage.setItem('expertRefreshToken', refreshToken);
    });
    socket?.emit('join_call', user.userId);
    socket?.on('cashRecieved', async () => {
      setIsWaitingCash(false);
      const data = {
        amount: total,
        paymentType: 'cashOnHand',
      };
      await axiosUser().post(`/paymentSuccess/${jobId}`, data);
      localStorage.setItem('isWaitingCash', 'false');
      localStorage.setItem('redirectAfterCashReceived', 'true');
      toast.success('Payment Recieved Successfully');
      localStorage.removeItem('currentJob-user');
      localStorage.removeItem('expertId-job');
      localStorage.removeItem('isJobActive');
      localStorage.removeItem('jobStartTime');
      localStorage.removeItem('jobStopTime');
      localStorage.removeItem('userId-job');
      dispatch(removeMessage());
      setRedirect(true);
    });

    socket?.on('cashNotRecieved', () => {
      setIsWaitingCash(undefined);
      localStorage.removeItem('isWaitingCash');
      toast.error('Payment Not Recieved By Expert. Try Again');
    });

    return () => {
      socket?.off('newTokens');
      socket?.off('cashRecieved');
      socket?.off('cashNotRecieved');
    };
  }, [dispatch, jobId, navigate, socket, total, user.userId]);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const { data } = await axiosUser().get<JobData>(`/jobdata/${jobId}`);
        if (data) {
          const serviceDetails = services.find(
            (service) => service._id === data.service
          );
          const serviceName = serviceDetails ? serviceDetails.name : '';
          const serviceBasePrice = serviceDetails ? serviceDetails.price : NaN;
          setJobData({ ...data, serviceName, serviceBasePrice });
        }
      } catch (error) {
        console.log(error);
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    if (jobId) {
      fetchData();
    }
  }, [jobId, services]);
  useEffect(() => {
    const calculateCharge = (time: number, hourlyRate: number) => {
      const hoursElapsed = time / (1000 * 60 * 60);
      const totalCharge = hoursElapsed * hourlyRate;
      return totalCharge.toFixed(2);
    };
    const startTimeString = localStorage.getItem('jobStartTime');
    const endTimeString = localStorage.getItem('jobStopTime');
    const startTime = startTimeString ? parseInt(startTimeString, 10) : 0;
    const endTime = endTimeString ? parseInt(endTimeString, 10) : 0;
    const time = endTime - startTime;
    if (time && jobData) {
      const hourlyCharge = Number(
        Number(calculateCharge(time, jobData.ratePerHour)).toFixed(2)
      );
      const calculatedTotal = jobData.totalAmount + hourlyCharge;
      setHourlyRate(hourlyCharge);
      setTotal(calculatedTotal);
    }
  }, [jobData]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const handleOnlinePayment = async () => {
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }
    const result = await axiosUser().post(`/payment/${jobId}`, {
      amount: total * 100,
    });
    if (!result) {
      toast.error('Server error. Are you online?');
      return;
    }
    const { amount, id: order_id, currency } = result.data;
    const options = {
      key: 'rzp_test_IjovpkTeb85bN5',
      amount: amount.toString(),
      currency: currency,
      name: 'XpertAssist',
      description: 'Test Transaction',
      image: './vite.png',
      order_id: order_id,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      handler: async function (response) {
        const data = {
          amount: total,
          paymentType: 'onlinePayment',
        };
        console.log(data);
        const result = await axiosUser().post(`/paymentSuccess/${jobId}`, data);
        if (result.data.message === 'success') {
          socket?.emit('paymentDone', { expertId: jobData?.expertId });
          toast.success('Payment Recieved Successfully');
          localStorage.removeItem('currentJob-user');
          localStorage.removeItem('expertId-job');
          localStorage.removeItem('isJobActive');
          localStorage.removeItem('jobStartTime');
          localStorage.removeItem('jobStopTime');
          localStorage.removeItem('userId-job');
          dispatch(removeMessage());
          navigate('/request-service');
        } else {
          toast.error(result.data.message);
        }
      },
      prefill: {
        name: user.user,
        email: user.email,
        contact: user.mobile,
      },
      notes: {
        address: 'Soumya Dey Corporate Office',
      },
      theme: {
        color: '#61dafb',
      },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleCashOnDelivery = async () => {
    setIsWaitingCash(true);
    localStorage.setItem('isWaitingCash', 'true');
    socket?.emit('cashOnDelivery', {
      expertId: jobData?.expertId,
      amount: total,
    });
  };

  if (loading)
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div>
      <Navbar activePage="job-status" />
      {isWaitingCash === true && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <Player
              autoplay
              loop
              src={'/Animation - PaymentPending.json'}
              style={{
                height: '85%',
                width: '85%',
                marginTop: '-70px',
                marginBottom: '-70px',
                background: 'transparent',
              }}
            />
            <p className="text-gray-700 font-extrabold text-2xl mb-4">
              Waiting for the expert to confirm cash received...
            </p>
            <p className="text-gray-500 text-sm">Please wait a moment...</p>
          </div>
        </div>
      )}
      {isWaitingCash === false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <Player
              autoplay
              loop
              src={'/Animation - success.json'}
              style={{
                height: '85%',
                width: '85%',
                marginTop: '-70px',
                marginBottom: '-70px',
                background: 'transparent',
              }}
            />
            <p className="text-gray-700 font-extrabold text-2xl mb-4">
              The expert has confirmed cash received. The transaction is
              complete.
            </p>
            {countdown !== null && (
              <p className="text-gray-700 font-bold text-lg mt-4">
                Redirecting in {countdown} seconds...
              </p>
            )}
          </div>
        </div>
      )}
      <div className="flex justify-center items-center bg-gray-50">
  <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-10 border border-gray-200 mx-4 my-8 flex flex-col md:flex-row">
    
    {/* Left Column - Job Details */}
    <div className="w-full md:w-1/2 pr-6 mb-6 md:mb-0">
      <h3 className="text-3xl font-bold mb-8 text-center md:text-left text-indigo-700">
        Payment Window
      </h3>

      <div className="bg-indigo-50 p-6 rounded-lg shadow-inner">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">Job Details</h4>
        <p className="text-gray-700 mb-3">
          <span className="font-semibold">Service:</span>{' '}
          {jobData?.serviceName}
        </p>
        <p className="text-gray-700 mb-3">
          <span className="font-semibold">Description:</span>{' '}
          <span className="break-words">{jobData?.notes}</span>
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Distance:</span>{' '}
          {jobData?.distance?.toFixed(2)} km
        </p>
      </div>
    </div>

    {/* Right Column - Amount Details */}
    <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-300 pt-6 md:pt-0 md:pl-6">
      <div className="mb-8">
        <h4 className="text-3xl font-bold mb-8 text-center md:text-left text-indigo-700">
          Amount Details
        </h4>
        <p className="text-gray-700 mb-3 p-1 flex justify-between border-b-2">
          <span className="font-semibold">Base Price:</span>
          <span>₹ {jobData?.serviceBasePrice}</span>
        </p>

        <p className="text-gray-700 mb-3 p-1 flex justify-between border-b-2">
          <span className="font-semibold">Distance Charge:</span> ₹{' '}
          {jobData &&
            (jobData?.totalAmount - jobData?.serviceBasePrice)?.toFixed(2)}
        </p>
        <p className="text-gray-700 mb-3 p-1 flex justify-between border-b-2">
          <span className="font-semibold">Hourly Charge:</span> ₹{' '}
          {hourlyRate.toFixed(2)}
        </p>
        <p className="text-indigo-700 font-bold text-2xl mt-6 flex justify-between">
          <span>Total:</span> ₹{total.toFixed(2)}
        </p>
      </div>

      {/* Payment Options */}
      <div>
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Select Payment Method
        </h4>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleOnlinePayment}
            className="flex justify-center text-white bg-indigo-500 border-2 hover:border-2 hover:border-indigo-500 hover:bg-white hover:text-indigo-500 px-5 py-3 rounded-lg transition duration-300 ease-in-out shadow"
          >
            <span className="material-symbols-outlined px-2">credit_card</span>
            Online Payment
          </button>
          <button
            onClick={handleCashOnDelivery}
            className="flex justify-center text-white bg-indigo-500 border-2 hover:border-2 hover:border-indigo-500 hover:bg-white hover:text-indigo-500 px-5 py-3 rounded-lg mb-3 transition duration-300 ease-in-out shadow"
          >
            <span className="material-symbols-outlined px-2">payments</span>
            Cash on Delivery
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

      <Footer />
    </div>
  );
};

export default JobPayment;
