import { useEffect, useState } from 'react';
import { axiosAdmin } from '../../../service/axios/axiosAdmin';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Service } from '../../../interfaces/interface';

interface Expert {
  accountStatus: string;
  _id: string;
  name: string;
  email: string;
  mobile: number;
  service: string;
  expertImage: string;
  isVerified: string;
  verificationDetails: VerificationDetails;
}
interface VerificationDetails {
  govIdType: string;
  govIdNumber: string;
  document: string;
}

const ExpertManage = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const expertsPerPage = 5;

  const totalPages = Math.ceil(experts.length / expertsPerPage);

  useEffect(() => {
    fetchExpertData();
  }, [currentPage]);

  const fetchExpertData = async () => {
    try {
      const { data } = await axiosAdmin().get('/getExperts');
      console.log(data);
      if (data) {
        setExperts(data);
      } else {
        toast.error('No Experts Found');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleBlockUnblock = async (expertId: string, currentStatus: 'Blocked' | 'UnBlocked') => {
    try {
      const newStatus = currentStatus === 'UnBlocked' ? 'Blocked' : 'UnBlocked';
      const {data} = await axiosAdmin().patch(`/experts/${expertId}/block-unblock`, { accountStatus: newStatus });
      if(data.message === 'success') {
        toast.success(`Expert has been ${newStatus.toLowerCase()} successfully!`);
        fetchExpertData();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  

  const indexOfLastExpert = currentPage * expertsPerPage;
  const indexOfFirstExpert = indexOfLastExpert - expertsPerPage;
  const currentExperts = experts.slice(indexOfFirstExpert, indexOfLastExpert);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      {experts.length === 0 ? (
        <div>
          <h1 className="flex justify-center items-center text-grey-800 text-3xl pt-3 mt-7">
            Experts List is Empty
          </h1>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col w-full">
          <h1 className="p-2 m-2 text-3xl font-medium">Expert Management</h1>
          <div className="relative overflow-x-auto shadow-xl sm:rounded-xl border-2 shadow-black mt-3 ">
            <table className=" text-md text-left rounded-lg rtl:text-right ">
              <thead className="text-sm text-center uppercase bg-gray-800 text-gray-100 rounded-lg">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    User Image
                  </th>
                  <th scope="col" className="px-4 py-3">
                    UserName
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Service
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Verification Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-center font-medium whitespace-nowrap text-white">
                {currentExperts.map((expert, index) => {
                  const serviceDetails = services.find(
                    (service) => service._id === expert.service
                  );
                  const serviceName = serviceDetails
                    ? serviceDetails.name
                    : 'Unknown Service';

                  return (
                    <tr
                      key={expert._id || index}
                      className="bg-gray-100 border-white text-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                      <td
                        scope="row"
                        className="px-4 py-3 flex items-center justify-center"
                      >
                        {expert.expertImage && (
                          <img
                            src={expert.expertImage}
                            alt="expert"
                            className="w-10 h-auto rounded-full border-2 border-black"
                          />
                        )}
                      </td>
                      <td scope="row" className="px-4 py-3">
                        {expert.name}
                      </td>
                      <td scope="row" className="px-4 py-3">
                        {expert.email}
                      </td>
                      <td scope="row" className="px-4 py-3">
                        {serviceName}
                      </td>
                      <td scope="row" className="px-4 py-3">
                        {expert.isVerified === 'pending' && (
                          <span className="text-orange-500">Pending</span>
                        )}
                        {expert.isVerified === 'true' && (
                          <span className="text-green-500">Verified</span>
                        )}
                        {expert.isVerified === 'rejected' && (
                          <span className="text-red-500">Rejected</span>
                        )}
                        {expert.isVerified === 'false' && (
                          <span className="text-gray-500">Not Requested</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() =>
                            handleBlockUnblock(expert._id, expert.accountStatus)
                          }
                          className={`w-20 p-1 rounded-md ${
                            expert.accountStatus === 'UnBlocked'
                              ? 'bg-red-600 hover:bg-red-800 text-white'
                              : 'bg-green-600 hover:bg-green-800 text-white'
                          }`}
                        >
                          {expert.accountStatus === 'UnBlocked'
                            ? 'Block'
                            : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 mx-2 ${
                currentPage === 1
                  ? 'bg-gray-400'
                  : 'bg-gray-700 hover:bg-gray-900'
              } text-white rounded-lg`}
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-2 text-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-24 px-4 py-2 mx-2 ${
                currentPage === totalPages
                  ? 'bg-gray-400'
                  : 'bg-gray-700 hover:bg-gray-900'
              } text-white rounded-lg`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertManage;
