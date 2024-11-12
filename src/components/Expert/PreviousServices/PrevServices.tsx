import {
  FaRoute,
  FaClipboard,
  FaWrench,
  FaRupeeSign,
  FaMobile,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import axiosExpert from '../../../service/axios/axiosExpert';
import { useSelector } from 'react-redux';
import { RootState } from '@/service/redux/store';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Service } from '@/interfaces/interface';

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
  serviceName?: string;
  serviceBasePrice?: number;
}

interface UserData {
  userImage: string;
  name: string;
  email: string;
  mobile: string;
}

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const PrevServices = () => {
  const expertId = useSelector((store: RootState) => store.expert.expertId);
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );
  const [jobData, setJobData] = useState<JobData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosExpert().get<{ jobs: JobData[] }>(
          `/previousJobs/${expertId}`
        );
        console.log(data.jobs)
        setJobData(data.jobs);
      } catch (error) {
        toast.error((error as Error).message);
      }
    };
    fetchData();
  }, [expertId]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedJobs = jobData.slice(startIndex, startIndex + itemsPerPage);

  // Calculate total pages
  const totalPages = Math.ceil(jobData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        Previous Services
      </h2>

      <div className="space-y-6">
        {selectedJobs.map((job) => {
          const serviceDetails = services.find(
            (service) => service._id === job.service
          );
          const serviceName = serviceDetails ? serviceDetails.name : 'Unknown Service';

          return (
            <div
              key={job._id}
              className="relative bg-gradient-to-br from-indigo-100 via-white to-indigo-200 rounded-2xl shadow-lg border border-indigo-300 transition-all transform hover:scale-105 hover:shadow-2xl p-4 group"
            >
              <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full shadow animate-pulse">
                {job?.status.charAt(0).toUpperCase() + job?.status.slice(1)}
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2 flex flex-col items-center p-4 bg-gradient-to-b from-white to-indigo-50 rounded-xl shadow-md border border-indigo-200 transform transition-transform group-hover:translate-y-1">
                <div className="text-lg font-semibold text-indigo-700">
                  User
                  </div>
                  <img
                    src={
                      job.userDetails.userImage
                        ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${job.userDetails.userImage}`
                        : '/default-avatar.png'
                    }
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full border-2 border-indigo-400 shadow-md mb-2"
                  />
                  <div className="text-center">
                    <div className="text-lg font-semibold text-indigo-700">
                      {job.userDetails.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {job.userDetails.email}
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-500 mt-1 space-x-1">
                      <FaMobile className="text-indigo-500" />{' '}
                      <span>{job.userDetails.mobile}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-3 p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <FaWrench className="text-indigo-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Service:</span>
                      <span className="ml-1 text-gray-600">{serviceName}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <FaClipboard className="text-indigo-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Description:</span>
                      <span className="ml-1 text-gray-600">{job.notes}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <FaRoute className="text-indigo-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Distance:</span>
                      <span className="ml-1 text-gray-600">{job.distance} km</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <FaRupeeSign className="text-indigo-500" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Total Amount:</span>
                      <span className="ml-1 text-lg font-bold text-green-700">
                        ₹ {job.totalAmount}/-
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-gray-100">
                        {job.payment === 'success' ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaExclamationCircle className="text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">
                          Payment Status:
                        </span>
                        <span
                          className={`ml-1 text-lg font-bold ${
                            job.payment === 'success'
                              ? 'text-green-500'
                              : 'text-yellow-500'
                          }`}
                        >
                          {job?.payment.charAt(0).toUpperCase() +
                            job?.payment.slice(1)}
                        </span>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-2">
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
  );
};

export default PrevServices;
