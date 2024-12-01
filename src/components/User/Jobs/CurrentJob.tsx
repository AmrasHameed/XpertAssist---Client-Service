import { useEffect, useState } from 'react';
import axiosUser from '../../../service/axios/axiosUser';
import Footer from '../Home/Footer';
import Navbar from '../Home/Navbar';
import { toast } from 'react-toastify';
import { Service } from '../../../interfaces/interface';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../Context/SocketContext';
import ChatWithExpert from './ChatWithExpert';
import Loading from '../../../utils/Loading';
import { addMessage } from '../../../service/redux/slices/messageSlice';
import { useWebRTC } from '../../../Context/WebRtcContext';
import JobTimer from '../../../utils/JobTimer';
import { useNavigate } from 'react-router-dom';

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

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
}

interface ExpertData {
  expertImage: string;
  name: string;
  email: string;
  mobile: string;
  isVerified: boolean;
}

const CurrentJob: React.FC = () => {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [expertData, setExpertData] = useState<ExpertData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');
  const [isJobActive, setIsJobActive] = useState<boolean>(
    () => localStorage.getItem('isJobActive') === 'true'
  );
  const navigate = useNavigate();
  const { startCall } = useWebRTC();

  const socket = useSocket();
  const dispatch = useDispatch();

  const userId = useSelector(
    (state: { user: { userId: string } }) => state.user.userId
  );
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const handleUserMessage = (data) => {
      console.log(data);
      dispatch(addMessage(data.message));
    };
    const jobId = localStorage.getItem('currentJob-user');
    if (socket) {
      socket.on('newTokens', (data) => {
        const { token, refreshToken } = data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('refreshToken', refreshToken);
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      socket.on('start-job', (expertId, userId) => {
        setIsJobActive(true);
        localStorage.setItem('isJobActive', 'true');
        if (jobData && userId === jobData.userId) {
          setJobData((prevJobData) => {
            if (!prevJobData) return prevJobData;
            return {
              ...prevJobData,
              status: 'started',
            };
          });
        }
      });
      socket.emit('join_chat', jobId);
      socket.emit('join_call', userId);
      socket.on('receive-user-message', handleUserMessage);
      socket.on('jobCompleted', () => {
        setIsJobActive(false);
        localStorage.setItem('isJobActive', 'false');
        localStorage.setItem('jobStopTime', Date.now().toString());
        navigate('/payment');
      });
    }
    return () => {
      socket?.off('newTokens');
      socket?.off('start-job');
      socket?.off('jobCompleted');
      socket?.off('receive-user-message', handleUserMessage);
    };
  }, [dispatch, jobData, navigate, socket, userId]);

  useEffect(() => {
    const jobId = localStorage.getItem('currentJob-user');
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
          localStorage.setItem('userId-job', data?.userId);
          setJobData({ ...data, serviceName });

          if (data.expertId) {
            localStorage.setItem('expertId-job', data?.expertId);
            const expertResponse = await axiosUser().get<ExpertData>(
              `/getexpert/${data.expertId}`
            );
            setExpertData(expertResponse.data);
          }
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
  }, [services]);

  const startVideoCall = () => {
    const participantToCall = 'expert';
    if (participantToCall) {
      startCall(participantToCall);
    } else {
      console.error('No participants available to call');
    }
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
      {jobData && expertData ? (
        <div className="flex flex-col items-center relative z-30 h-full p-4">
          <div className="w-full max-w-3xl bg-white p-6 border-gray-200 m-2">
            <h3 className="text-2xl font-bold mb-6 text-center text-indigo-600 p-2 m-2">
              Congratulations! You’ve Been Assigned an Expert
            </h3>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
              <div className="flex items-start space-x-4 md:space-x-8">
                <img
                  src={`https://${BUCKET}.s3.${REGION}.amazonaws.com/${expertData?.expertImage}`}
                  alt="Expert"
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-indigo-500"
                />
                <div className="space-y-2">
                  <p className="text-gray-800 text-lg font-semibold flex items-center truncate">
                    Name: {expertData?.name}
                    {expertData?.isVerified && (
                      <span className="material-symbols-outlined font-extrabold p-1 text-green-500 ml-1">
                        check_circle
                      </span>
                    )}
                  </p>
                  <p className="text-gray-700 truncate">
                    Email: {expertData?.email}
                  </p>
                  <p className="text-gray-700 truncate">
                    Mobile: {expertData?.mobile}
                  </p>
                </div>
              </div>
              <div className="mt-2 md:mt-0">
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
              <div className="flex justify-center items-center p-4 w-full">
                <div className="flex flex-col items-center justify-center bg-indigo-100 p-4 rounded-lg w-full max-w-md">
                  {/* Adjusted JobTimer Wrapper */}
                  <div className="flex justify-center items-center w-full">
                    <JobTimer isJobActive={isJobActive} />
                  </div>
                </div>
              </div>
            )}

            {jobData.status === 'pending' && (
              <div className="flex flex-col items-center p-4 rounded-lg bg-indigo-100">
                <div className="flex flex-row">
                  <p className="text-gray-800 font-semibold mt-2 mr-2">Pin:</p>
                  <div className="flex space-x-2">
                    {jobData?.pin
                      ?.toString()
                      .split('')
                      .map((digit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-center w-10 h-10 border border-gray-400 rounded-lg bg-white text-xl font-bold text-gray-800"
                        >
                          {digit}
                        </div>
                      ))}
                  </div>
                </div>
                <p className="text-gray-400 mt-2 text-sm">
                  *Share this pin with the expert when they arrive.
                </p>
              </div>
            )}

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

            {activeTab === 'chat' && socket ? (
              <ChatWithExpert socket={socket} />
            ) : (
              <div className="space-y-2 mb-4 p-4 bg-indigo-100 rounded-lg">
                <p className="text-gray-800">Service: {jobData.serviceName}</p>
                <p className="text-gray-800 break-words">
                  Description: {jobData.notes}
                </p>
                <p className="text-gray-800">
                  Status:
                  <span
                    className={`${
                      jobData.status === 'started'
                        ? 'text-green-600'
                        : jobData.status === 'pending'
                        ? 'text-orange-600'
                        : jobData.status === 'completed'
                        ? 'text-blue-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {' '}
                    {jobData.status}
                  </span>
                </p>
                <p className="text-gray-800">
                  Distance: {jobData.distance?.toFixed(4)} km
                </p>
                <div className="text-4xl font-bold text-gray-800">
                  ₹{jobData.totalAmount?.toFixed(2)}
                </div>
                <p className="text-sm text-gray-500">
                  *Additional amount for time taken will be calculated upon
                  completion. Rate: ₹{jobData.ratePerHour}/hr.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[500px]">
          <div className="w-full max-w-md bg-white p-6 border-gray-200 m-2">
            <h1 className="text-2xl font-bold text-center text-black">
              No current job details available.
            </h1>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CurrentJob;
