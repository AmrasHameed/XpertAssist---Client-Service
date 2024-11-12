import { useEffect, useState } from 'react';
import axiosExpert from '../../../service/axios/axiosExpert';
import Navbar from '../Home/Navbar';
import { toast } from 'react-toastify';
import { Service } from '../../../interfaces/interface';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../Home/Sidebar';
import JobDetails from './JobDetails';
import ChatWithUser from './ChatWithUser';
import { useSocket } from '../../../Context/SocketContext';
import {
  addMessage,
  removeMessage,
} from '../../../service/redux/slices/messageSlice';
import Loading from '../../../utils/Loading';
import { useWebRTC } from '../../../Context/WebRtcContext';
import JobTimer from '../../../utils/JobTimer';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';

const BUCKET: string | undefined = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION: string | undefined = import.meta.env.VITE_AWS_S3_REGION;

interface JobData {
  service: string;
  expertId?: string;
  userId?: string;
  pin?: number;
  notes?: string;
  status?: string;
  distance?: number;
  totalAmount?: number;
  userLocation?: { lat: number; lng: number };
  expertLocation?: { latitude: number; longitude: number };
  ratePerHour?: number;
  serviceName?: string;
  serviceBasePrice?: number;
}

interface UserData {
  userImage?: string;
  name?: string;
  email?: string;
  mobile?: string;
  isVerified?: boolean;
}

const CurrentJobExpert = () => {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('Job Status');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pinInput, setPinInput] = useState<string[]>(['', '', '', '']);
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [loading, setLoading] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isJobActive, setIsJobActive] = useState<boolean>(
    () => localStorage.getItem('isJobActive') === 'true'
  );
  const jobId = localStorage.getItem('currentJob-expert')
  const [hourlyRate, setHourlyRate] = useState<number>();
  const [isWaitingForPayment, setIsWaitingForPayment] = useState<boolean>(
    () => {
      return localStorage.getItem('isWaitingForPayment') === 'false'
        ? false
        : true;
    }
  );
  const [isCashRecieved, setIsCashRecieved] = useState<boolean>(() => {
    return localStorage.getItem('isCashRecieved') === 'true' ? true : false;
  });
  const [cashAmount, setCashAmount] = useState(() => {
    const savedAmount = localStorage.getItem('cashAmount');
    return savedAmount ? JSON.parse(savedAmount) : null;
  });
  const socket = useSocket();
  const { startCall } = useWebRTC();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const expertId = useSelector(
    (state: { expert: { expertId: string } }) => state.expert.expertId
  );
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );

  useEffect(() => {
    localStorage.setItem('isWaitingForPayment', isWaitingForPayment.toString());
  }, [isWaitingForPayment]);
  useEffect(() => {
    localStorage.setItem('isCashRecieved', isCashRecieved.toString());
  }, [isCashRecieved]);

  useEffect(() => {
    const persistedIsCompleted = localStorage.getItem('isCompleted') === 'true';
    const persistedHourlyRate = localStorage.getItem('hourlyRate')
      ? Number(localStorage.getItem('hourlyRate'))
      : undefined;
    if (persistedIsCompleted) setIsCompleted(persistedIsCompleted);
    if (persistedHourlyRate) setHourlyRate(persistedHourlyRate);
  }, []);

  useEffect(() => {
    const jobId = localStorage.getItem('currentJob-expert');
    socket?.on('newTokens', (data) => {
      const { token, refreshToken } = data;
      localStorage.setItem('expertToken', token);
      localStorage.setItem('expertRefreshToken', refreshToken);
    });
    socket?.on('start-job', (expertId, userId) => {
      setIsJobActive(true);
      localStorage.setItem('isJobActive', 'true');
      if (jobData && expertId === jobData.expertId) {
        setJobData((prevJobData) => {
          if (!prevJobData) return prevJobData;
          return {
            ...prevJobData,
            status: 'started',
          };
        });
      }
    });
    socket?.emit('join_chat', jobId);
    socket?.emit('join_call', expertId);
    socket?.on('receive-expert-message', (data) => {
      console.log(data, 'message');
      dispatch(addMessage(data.message));
    });
    socket?.on('jobCompleted', () => {
      setIsCompleted(true);
      setIsJobActive(false);
      localStorage.setItem('isJobActive', 'false');
      localStorage.setItem('jobStopTime', Date.now().toString());
      localStorage.setItem('isCompleted', 'true');
      const startTimeString = localStorage.getItem('jobStartTime');
      const endTimeString = localStorage.getItem('jobStopTime');
      const startTime = startTimeString ? parseInt(startTimeString, 10) : 0;
      const endTime = endTimeString ? parseInt(endTimeString, 10) : 0;
      const time = endTime - startTime;
      if (jobData && jobData.ratePerHour && jobData.totalAmount) {
        const hourlyRate = Number(
          (Number(calculateCharge(time, jobData?.ratePerHour)) * 0.9).toFixed(2)
        );
        const totalEarning = jobData?.totalAmount * 0.9 + hourlyRate;
        console.log(totalEarning);
        socket.emit('storeEarning', { expertId, jobId, totalEarning });
        localStorage.setItem('hourlyRate', hourlyRate.toString());
        setHourlyRate(hourlyRate);
      }
      localStorage.removeItem('expertId-job');
      localStorage.removeItem('isJobActive');
      localStorage.removeItem('userId-job');
      dispatch(removeMessage());
    });
    socket?.on('cashOnDelivery', ({ amount }) => {
      setIsCashRecieved(true);
      setCashAmount(amount);
      localStorage.setItem('cashAmount', JSON.stringify(amount));
    });
    socket?.on('paymentConfirmed', () => {
      setIsWaitingForPayment(false);
      localStorage.setItem('isWaitingForPayment','false')
      setTimeout(()=>{
        navigate('/expert')
        localStorage.removeItem('cashAmount')
        localStorage.removeItem('currentJob-expert')
        localStorage.removeItem('expertId-job')
        localStorage.removeItem('hourlyRate')
        localStorage.removeItem('isCashRecieved')
        localStorage.removeItem('isCompleted')
        localStorage.removeItem('isWaitingForPayment')
        localStorage.removeItem('jobStopTime')
        localStorage.removeItem('userId-job')
        dispatch(removeMessage())
      },5000)
    });
    return () => {
      socket?.off('newTokens');
      socket?.off('start-job');
      socket?.off('receive-expert-message');
      socket?.off('jobCompleted');
      socket?.off('paymentConfirmed');
    };
  }, [socket, jobData, dispatch, expertId, navigate]);

  const calculateCharge = (time: number, hourlyRate: number) => {
    const hoursElapsed = time / (1000 * 60 * 60);
    const totalCharge = hoursElapsed * hourlyRate;
    return totalCharge.toFixed(2);
  };

  useEffect(() => {
    const jobId = localStorage.getItem('currentJob-expert');
    if (!jobId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const jobPromise = axiosExpert().get(`/jobdata/${jobId}`);
        const userPromise = jobData?.userId
          ? axiosExpert().get(`/getUser/${jobData.userId}`)
          : Promise.resolve({ data: null });

        const [jobResponse, userResponse] = await Promise.all([
          jobPromise,
          userPromise,
        ]);
        const data = jobResponse.data;
        localStorage.setItem('userId-job', data?.userId);
        localStorage.setItem('expertId-job', data?.expertId);
        const serviceDetails = services.find(
          (service) => service._id === data.service
        );
        const serviceName = serviceDetails
          ? serviceDetails.name
          : 'Unknown Service';
        const serviceBasePrice = serviceDetails ? serviceDetails.price : 0;
        setJobData({ ...data, serviceName, serviceBasePrice });
        setUserData(userResponse.data);
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
  }, [jobData?.userId, services]);

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newPinInput = [...pinInput];
      newPinInput[index] = value;
      setPinInput(newPinInput);

      if (value && index < 3) {
        document.getElementById(`pin-input-${index + 1}`)?.focus();
      }
    }
  };

  const handlePinSubmit = () => {
    const enteredPin = pinInput.join('');
    if (Number(enteredPin) === jobData?.pin) {
      const jobId = localStorage.getItem('currentJob-expert');
      socket?.emit('otp-verified', {
        jobId,
        expertId: jobData?.expertId,
        userId: jobData?.userId,
      });
      toast.success('PIN is correct!');
    } else {
      setPinInput(['', '', '', '']);
      toast.error('Incorrect PIN. Please try again.');
    }
  };

  const startVideoCall = () => {
    const participantToCall = 'user';
    if (participantToCall) {
      startCall(participantToCall);
    } else {
      console.error('No participants available to call');
    }
  };

  const handleCompletion = () => {
    socket?.emit('job-complete', {
      userId: jobData?.userId,
      expertId: jobData?.expertId,
    });
  };

  const handleConfirmReceipt = (confirmed:boolean) => {
    if (confirmed) {
      setIsWaitingForPayment(false)
      localStorage.setItem('isWaitingForPayment','false')
      socket?.emit('cashRecieved',{userId:jobData?.userId, amount: cashAmount, expertId, jobId})
      setTimeout(()=>{
        navigate('/expert')
        localStorage.removeItem('cashAmount')
        localStorage.removeItem('currentJob-expert')
        localStorage.removeItem('expertId-job')
        localStorage.removeItem('hourlyRate')
        localStorage.removeItem('isCashRecieved')
        localStorage.removeItem('isCompleted')
        localStorage.removeItem('isWaitingForPayment')
        localStorage.removeItem('jobStopTime')
        localStorage.removeItem('userId-job')
        dispatch(removeMessage())
      },5000)
    } else {
      socket?.emit('cashNotRecieved',{userId:jobData?.userId})
    }
    setIsCashRecieved(false); 
  };
  

  if (loading)
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <Sidebar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div className="flex-grow flex flex-col">
        <Navbar />
        {isCashRecieved && (
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
                Have you received ₹{cashAmount} from the user in cash?
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Please wait a moment...
              </p>

              {/* Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleConfirmReceipt(true)}
                  className="bg-green-500 border-2 hover:text-green-500 hover:bg-white hover:border-2 hover:border-green-600 text-white font-semibold py-2 px-4 rounded-lg flex"
                >
                  <span className='material-symbols-outlined font-extrabold pt-1'>done_outline</span>
                </button>
                <button
                  onClick={() => handleConfirmReceipt(false)}
                  className="bg-red-500 border-2 hover:text-red-500 hover:bg-white text-white hover:border-2 hover:border-red-600 font-semibold py-2 px-4 rounded-lg"
                >
                  <span className='material-symbols-outlined font-extrabold pt-1'>close</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow p-6 bg-gray-100">
          {isCompleted && jobData && hourlyRate && (
            <div className="flex justify-center items-center">
              <div className="flex flex-col items-center text-center space-y-6 bg-white w-[800px] p-6 m-4 border-2 border-green-500 shadow-2xl rounded-lg">
                {/* Conditionally Render Based on Payment Confirmation */}
                {isWaitingForPayment ? (
                  <>
                    <Player
                      autoplay
                      loop
                      src={'/Animation - PaymentPending.json'}
                      style={{
                        height: '65%',
                        width: '65%',
                        marginBottom: '-100px',
                        background: 'transparent',
                      }}
                    />
                    <p className="text-gray-600 font-extrabold text-4xl mt-4 mb-6">
                      Waiting for payment confirmation from the user...
                    </p>
                  </>
                ) : (
                  <>
                    <Player
                      autoplay
                      loop
                      src={'/Animation - success.json'}
                      style={{
                        height: '35%',
                        width: '35%',
                        marginBottom: '-40px',
                        background: 'transparent',
                      }}
                    />
                    <p className="glow text-green-600 font-extrabold text-4xl mt-4 mb-6">
                      {cashAmount ? (`Fantastic job! The amount ${cashAmount} will be deducted from your wallet since the user has paid in cash.`):(`Fantastic job! You've successfully earned ₹${(
                        (jobData.totalAmount || 0) -
                        (jobData.totalAmount || 0) * 0.1 +
                        hourlyRate
                      ).toFixed(2)}! Added to your wallet.`)}
                    </p>
                  </>
                )}

                {/* Earnings Breakdown Section */}
                <div className="bg-gray-50 p-6 rounded-lg w-full shadow-lg">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2 border-gray-300">
                    Earnings Breakdown
                  </h2>
                  <div className="text-left text-gray-700 space-y-4 divide-gray-300">
                    <div className="py-1 flex justify-between items-center hover:bg-gray-200 px-4 rounded-lg">
                      <span className="font-medium text-lg">
                        Base Price + Travel :
                      </span>
                      <span className="font-semibold text-gray-800">
                        ₹{' '}
                        {(jobData.totalAmount || 0) -
                          (jobData.totalAmount || 0) * 0.1}
                      </span>
                    </div>
                    <div className="py-1 flex justify-between items-center hover:bg-gray-200 px-4 rounded-lg">
                      <span className="font-medium text-lg">
                        Hourly Charge :
                      </span>
                      <span className="font-semibold text-gray-800">
                        ₹{hourlyRate}
                      </span>
                    </div>
                    <div className="py-1 flex justify-between items-center hover:bg-gray-200 px-4 rounded-lg font-bold text-gray-900">
                      <span className="text-lg">Total Amount :</span>
                      <span className="text-xl">
                        ₹
                        {(
                          (jobData.totalAmount || 0) -
                          (jobData.totalAmount || 0) * 0.1 +
                          hourlyRate
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {jobData && userData ? (
            <>
              {/* Modal */}
              <div className="flex justify-center items-center relative z-30 h-full">
                <div className="w-full max-w-3xl bg-white p-6 border-gray-200 m-2">
                  <h3 className="text-2xl font-bold mb-6 text-center text-indigo-600">
                    User and Service Details
                  </h3>

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col items-start space-x-32">
                      <div className="flex items-center">
                        <img
                          src={`https://${BUCKET}.s3.${REGION}.amazonaws.com/${userData?.userImage}`}
                          alt="Expert"
                          className="w-28 h-28 rounded-full object-cover mr-4 border-2 border-indigo-500"
                        />
                        <div className="space-y-1">
                          <p className="text-gray-800 text-lg font-semibold flex items-center">
                            Name: {userData?.name}
                            {userData?.isVerified && (
                              <span className="material-symbols-outlined font-extrabold p-1 text-green-500 ml-1">
                                check_circle
                              </span>
                            )}
                          </p>
                          <p className="text-gray-700">
                            Email: {userData?.email}
                          </p>
                          <p className="text-gray-700">
                            Mobile: {userData?.mobile}
                          </p>
                        </div>
                      </div>
                      <div className="-mt-1">
                        <button
                          onClick={startVideoCall}
                          className="text-white bg-indigo-500 hover:border-2 hover:border-indigo-500 hover:bg-white hover:text-indigo-500 px-4 py-2 rounded-lg flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined mr-2">
                            video_call
                          </span>
                          Video Call
                        </button>
                      </div>
                    </div>

                    {jobData.status === 'started' && (
                      <div className="flex flex-col items-center justify-center ">
                        <div className="p-3">
                          <JobTimer isJobActive={isJobActive} />
                        </div>
                        <button
                          onClick={handleCompletion}
                          className="text-white bg-indigo-500 hover:border-2 hover:border-indigo-500 hover:bg-white hover:text-indigo-500 px-4 py-2 rounded-lg mb-3 ml-[-100px] mt-[-50px]"
                        >
                          Completed
                        </button>
                      </div>
                    )}

                    {/* Pin Section */}
                    {jobData.status === 'pending' && (
                      <div className="flex flex-col items-center p-2 rounded-lg">
                        <p className="text-gray-800 font-semibold mb-2">
                          Enter PIN:
                        </p>
                        <div className="flex space-x-2">
                          {pinInput.map((digit, index) => (
                            <input
                              key={index}
                              id={`pin-input-${index}`}
                              type="text"
                              value={digit}
                              onChange={(e) =>
                                handleChange(e.target.value, index)
                              }
                              className="w-12 h-12 border border-gray-400 rounded-lg text-center text-2xl font-bold"
                              maxLength={1}
                            />
                          ))}
                        </div>
                        <button
                          onClick={handlePinSubmit}
                          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg"
                        >
                          Submit PIN
                        </button>
                        <p className="text-gray-400 mt-2 text-sm">
                          *Enter the 4-digit PIN shared by the User.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-around mb-4">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`px-4 py-2 font-semibold ${
                        activeTab === 'details'
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-500'
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`px-4 py-2 font-semibold ${
                        activeTab === 'chat'
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-500'
                      }`}
                    >
                      Chat
                    </button>
                  </div>

                  {/* Job Info Section */}
                  {activeTab === 'chat' && socket ? (
                    <ChatWithUser socket={socket} />
                  ) : (
                    <JobDetails jobData={jobData} />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              No Current Job details available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CurrentJobExpert;
