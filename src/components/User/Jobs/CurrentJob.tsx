import { useEffect, useState } from 'react';
import axiosUser from '../../../service/axios/axiosUser';
import Footer from '../Home/Footer';
import Navbar from '../Home/Navbar';
import { toast } from 'react-toastify';
import { Service } from '../../../interfaces/interface';
import { useSelector } from 'react-redux';
import { useSocket } from '../../../SocketContext';
import ChatWithExpert from './ChatWithExpert';

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
  const socket = useSocket();

  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );

  useEffect(() => {
    if (socket) {
      socket.on('newTokens', (data) => {
        const { token, refreshToken } = data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('refreshToken', refreshToken);
      });
      socket.on('start-job', (expertId, userId) => {
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
    }
    return () => {
      socket?.off('newTokens');
      socket?.off('start-job');
    };
  }, [jobData, socket]);

  useEffect(() => {
    const jobId = localStorage.getItem('currentJob-user');
    const fetchData = async () => {
      try {
        const { data } = await axiosUser().get<JobData>(`/jobdata/${jobId}`);
        console.log(data);
        if (data) {
          const serviceDetails = services.find(
            (service) => service._id === data.service
          );
          const serviceName = serviceDetails ? serviceDetails.name : '';
          setJobData({ ...data, serviceName });

          if (data.expertId) {
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

    fetchData();
  }, [services]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Navbar activePage="job-status" />
      {jobData && expertData ? (
        <div>
          <div className="flex justify-center items-center relative z-30 h-full">
            <div className="w-full max-w-3xl bg-white p-6 border-gray-200 m-2">
              <h3 className="text-2xl font-bold mb-6 text-center text-indigo-600 p-2 m-2">
                Congratulations! You’ve Been Assigned an Expert
              </h3>

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <img
                    src={`https://${BUCKET}.s3.${REGION}.amazonaws.com/${expertData?.expertImage}`}
                    alt="Expert"
                    className="w-28 h-28 rounded-full object-cover mr-4 border-2 border-indigo-500"
                  />
                  <div className="space-y-1">
                    <p className="text-gray-800 text-lg font-semibold flex items-center">
                      Name: {expertData?.name}
                      {expertData?.isVerified && (
                        <span className="material-symbols-outlined font-extrabold p-1 text-green-500 ml-1">
                          check_circle
                        </span>
                      )}
                    </p>
                    <p className="text-gray-700">Email: {expertData?.email}</p>
                    <p className="text-gray-700">
                      Mobile: {expertData?.mobile}
                    </p>
                  </div>
                </div>

                {jobData.status === 'pending' && (
                  <div className="flex flex-col items-center p-2 rounded-lg">
                    <div className="flex items-center">
                      <p className="text-gray-800 font-semibold mr-2">Pin:</p>
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

              {/* {service details} */}

              {activeTab === 'chat' && socket ? (
                <ChatWithExpert socket={socket} />
              ) : (
                <div className="space-y-2 mb-4 p-4 bg-indigo-100 rounded-lg flex justify-between items-center">
                  <div className="flex-1 font-semibold">
                    <p className="text-gray-800 p-1">
                      Service: {jobData.serviceName}
                    </p>
                    <p className="text-gray-800 p-1">
                      Description: {jobData.notes}
                    </p>
                    <p className="text-gray-800 p-1">
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
                    <p className="text-gray-800 p-1">
                      Distance: {jobData.distance?.toFixed(4)} km
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="flex flex-col items-end">
                    <div className="text-4xl font-bold text-gray-800 pr-5">
                      ₹{jobData.totalAmount?.toFixed(2)}
                    </div>
                    <p className="text-[0.775rem] text-black text-center mt-2">
                      *Additional amount for <br />
                      time taken will be <br />
                      calculated upon completion.
                      <br />
                      Rate: ₹{jobData.ratePerHour}/hr.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center relative z-30 h-[500px]">
          <div className="w-[500px] max-w-3xl bg-white p-6 border-gray-200 m-2">
            <h1 className="text-2xl font-bold mb-6 text-center text-black p-2 m-2">
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
