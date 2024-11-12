import { Service } from '@/interfaces/interface';
import { axiosAdmin } from '@/service/axios/axiosAdmin';
import Loading from '@/utils/Loading';
import { useEffect, useState } from 'react';
import {
    FaCheckCircle,
  FaClipboard,
  FaExclamationCircle,
  FaMobile,
  FaRoute,
  FaRupeeSign,
  FaWrench,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface JobData {
  _id: string;
  service: string;
  expertId?: string;
  userId?: string;
  pin?: number;
  notes?: string;
  status: string;
  distance?: number;
  totalAmount?: number;
  userLocation?: { lat: number; lng: number };
  expertLocation?: { latitude: number; longitude: number };
  ratePerHour?: number;
  userDetails: UserData;
  expertDetails: ExpertData;
  serviceName?: string;
  payment?: string;
  serviceBasePrice?: number;
}
interface ExpertData {
  expertImage: string;
  name: string;
  email: string;
  mobile: string;
}
interface UserData {
  userImage: string;
  name: string;
  email: string;
  mobile: string;
}

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const JobsHistory = () => {
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );
  const [jobData, setJobData] = useState<JobData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 2;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosAdmin().get<{ jobs: JobData[] }>('/jobs');
        console.log(data.jobs);
        setJobData(data.jobs);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedJobs = jobData.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(jobData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className=" min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 ml-4">
      <div className="max-w-4xl mx-auto p-4 font-sans text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-4 text-indigo-600">
          Service History
        </h2>

        <div className="space-y-4">
          {selectedJobs.map((job) => {
            const serviceDetails = services.find(
              (service) => service._id === job.service
            );
            const serviceName = serviceDetails
              ? serviceDetails.name
              : 'Unknown Service';

            return (
              <div
                key={job._id}
                className="relative bg-gradient-to-br from-indigo-400 to-pink-300 rounded-xl shadow-lg border border-indigo-500 transition-all transform hover:scale-105 hover:shadow-xl p-3 group"
              >
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  {job?.status.charAt(0).toUpperCase() + job?.status.slice(1)}
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {/* User Details on the Left */}
                  <div className="mt-7 col-span-2 flex flex-col items-center p-3 bg-gradient-to-b from-white to-indigo-50 rounded-lg shadow-sm border border-indigo-200 transform transition-transform group-hover:translate-y-1">
                    <div className="text-lg font-semibold text-indigo-600">
                      User
                    </div>
                    <img
                      src={
                        job.userDetails.userImage
                          ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${job.userDetails.userImage}`
                          : '/default-avatar.png'
                      }
                      alt="User Avatar"
                      className="w-14 h-14 rounded-full border-2 border-indigo-400 shadow-sm mb-1"
                    />
                    <div className="text-center">
                      <div className="text-lg font-semibold text-indigo-600">
                        {job.userDetails.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {job.userDetails.email}
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-500 mt-1 space-x-1">
                        <FaMobile className="text-indigo-500" />
                        <span>{job.userDetails.mobile}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Details in the Center */}
                  <div className="col-span-3 p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <FaWrench className="text-indigo-500" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">
                          Service:
                        </span>
                        <span className="ml-1 text-white">{serviceName}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <FaClipboard className="text-indigo-500" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">
                          Description:
                        </span>
                        <span className="ml-1 text-white">{job.notes}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <FaRoute className="text-indigo-500" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">
                          Distance:
                        </span>
                        <span className="ml-1 text-white">
                          {job.distance} km
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <FaRupeeSign className="text-indigo-500" />
                      </div>
                      <div>
                        <span className="font-semibold text-white">
                          Total Amount:
                        </span>
                        <span className="ml-1 text-lg font-bold text-green-100">
                          ₹ {job.totalAmount}/-
                        </span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-gray-100">
                        {job.payment === 'success' ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaExclamationCircle className="text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-white">
                          Payment Status:
                        </span>
                        <span
                          className={`ml-1 text-lg font-bold ${
                            job.payment === 'success'
                              ? 'text-green-300'
                              : 'text-yellow-300'
                          }`}
                        >
                          {job?.payment.charAt(0).toUpperCase() +
                            job?.payment.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expert Details on the Right */}
                  <div className="mt-7 col-span-2 flex flex-col items-center p-3 bg-gradient-to-b from-white to-indigo-50 rounded-lg shadow-sm border border-indigo-200 transform transition-transform group-hover:translate-y-1">
                    <div className="text-lg font-semibold text-indigo-600">
                      Expert
                    </div>
                    <img
                      src={
                        job.expertDetails.expertImage
                          ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${job.expertDetails.expertImage}`
                          : '/default-avatar.png'
                      }
                      alt="Expert Avatar"
                      className="w-14 h-14 rounded-full border-2 border-indigo-400 shadow-sm mb-1"
                    />
                    <div className="text-center">
                      <div className="text-lg font-semibold text-indigo-600">
                        {job.expertDetails.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {job.expertDetails.email}
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-500 mt-1 space-x-1">
                        <FaMobile className="text-indigo-500" />
                        <span>{job.expertDetails.mobile}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                currentPage === index + 1
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsHistory;
