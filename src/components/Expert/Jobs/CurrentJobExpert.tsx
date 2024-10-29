import { useEffect, useState } from 'react';
import axiosExpert from '../../../service/axios/axiosExpert';
import Navbar from '../Home/Navbar';
import { toast } from 'react-toastify';
import { Service } from '../../../interfaces/interface';
import { useSelector } from 'react-redux';
import Sidebar from '../Home/Sidebar';
import { getSocket } from '../../../socketUtils';
import JobDetails from './JobDetails';
import ChatWithUser from './ChatWithUser';
import { useSocket } from '../../../SocketContext';

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
  const [selectedOption, setSelectedOption] = useState<string>('Dashboard');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pinInput, setPinInput] = useState<string[]>(['', '', '', '']);
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const socket = useSocket();

  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );

  useEffect(() => {
    socket?.on('newTokens', (data) => {
      const { token, refreshToken } = data;
      localStorage.setItem('userToken', token);
      localStorage.setItem('refreshToken', refreshToken);
    });
    socket?.on('start-job', (expertId, userId) => {
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
    return () => {
      socket?.off('newTokens');
      socket?.off('start-job');
    };
  }, [socket, jobData]);

  useEffect(() => {
    const jobId = localStorage.getItem('currentJob-user');
    const fetchData = async () => {
      try {
        const jobPromise = axiosExpert().get(`/jobdata/${jobId}`);
        const userPromise = jobData?.userId
          ? axiosExpert().get(`/getUser/${jobData.userId}`)
          : Promise.resolve({ data: null });

        const [jobResponse, userResponse] = await Promise.all([
          jobPromise,
          userPromise,
        ]);
        const data = jobResponse.data;

        const serviceDetails = services.find(
          (service) => service._id === data.service
        );
        const serviceName = serviceDetails
          ? serviceDetails.name
          : 'Unknown Service';

        setJobData({ ...data, serviceName });
        setUserData(userResponse.data);
      } catch (error) {
        console.log(error);
        toast.error((error as Error).message);
      }
    };

    fetchData();
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
      const jobId = localStorage.getItem('currentJob-user');
      socket?.emit('otp-verified', jobId, jobData.expertId, jobData.userId);
      toast.success('PIN is correct!');
    } else {
      setPinInput(['', '', '', '']);
      toast.error('Incorrect PIN. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div className="flex-grow flex flex-col">
        <Navbar />
        <div className="flex-grow p-6 bg-gray-100">
          {jobData ? (
            <>
              {/* Modal */}
              <div className="flex justify-center items-center relative z-30 h-full">
                <div className="w-full max-w-3xl bg-white p-6 border-gray-200 m-2">
                  <h3 className="text-2xl font-bold mb-6 text-center text-indigo-600">
                    User and Service Details
                  </h3>

                  <div className="flex justify-between items-start mb-4">
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
              No current expert details available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CurrentJobExpert;
