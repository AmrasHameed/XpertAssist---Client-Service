import { useEffect, useState } from 'react';
import Sidebar from '../Home/SideBar';
import NavBar from '../Home/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosAdmin } from '../../../service/axios/axiosAdmin';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import 'animate.css';

type Service = {
  _id: string;
  name: string;
  price: number;
  serviceImage: string;
  description: string;
};

interface VerificationDetails {
  govIdType: string;
  govIdNumber: string;
  document: string;
}

interface Expert {
  _id: string;
  name: string;
  email: string;
  mobile: number;
  service: string;
  expertImage: string;
  isVerified: string;
  verificationDetails: VerificationDetails;
}

const BUCKET =  import.meta.env.VITE_AWS_S3_BUCKET;
const REGION =  import.meta.env.VITE_AWS_S3_REGION;

const ExpertDetails = () => {
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );
  const [selectedOption, setSelectedOption] = useState('Expert Approval');
  const [expert, setExpert] = useState<Expert | null>(null);
  const { id } = useParams();
  const navigate = useNavigate()

  useEffect(() => {
    fetchExpert();
  }, [id]);

  const fetchExpert = async () => {
    try {
      const { data } = await axiosAdmin().get(`/getExpert/${id}`);
      console.log(data, 'expert');
      setExpert(data);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const serviceDetails = services.find(
    (service) => service._id === expert?.service
  );
  const serviceName = serviceDetails ? serviceDetails.name : 'Unknown Service';

  const handleVerificationAction = async (action: 'accepted' | 'rejected') => {
    let reason = '';

    if (action === 'rejected') {
      const { value: rejectionReason } = await Swal.fire({
        title: 'Provide Rejection Reason',
        input: 'textarea',
        inputPlaceholder: 'Enter reason for rejection...',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        background: '#1e1e1e',
        color: '#ffffff',
        iconColor: '#ff0000',
        buttonsStyling: true,
        showClass: {
          popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
        },
        hideClass: {
          popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
        },
        inputValidator: (value) => {
          if (!value) {
            return 'Rejection reason is required!';
          }
          return null;
        },
      });

      if (!rejectionReason) {
        toast.error('Rejection reason is required!');
        return;
      }

      reason = rejectionReason;
    }

    try {
      const { data } = await axiosAdmin().post(`/expert/${id}/verification`, {
        action,
        reason,
      });
      if (data.message === 'verified') {
        toast.success(`Expert Verified successfully!`);
        navigate('/admin/expert-approval')
      } else if (data.message === 'rejected') {
        toast.success('Expert Verification Rejected successfully');
        navigate('/admin/expert-approval')
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="flex">
      <Sidebar
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div className="flex-1 flex flex-col">
        <NavBar />
        <div className="p-6">
          {/* Expert Details */}
          {expert && (
            <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
              {/* Header with Expert Image and Name */}
              <div className="flex items-center mb-6 p-4 bg-white shadow-md rounded-lg">
                {expert.expertImage && (
                  <div className="flex-shrink-0">
                    <img
                      src={expert?.expertImage?`https://${BUCKET}.s3.${REGION}.amazonaws.com/${expert.expertImage}`:'image'}
                      alt={expert.name}
                      className="rounded-full w-24 h-24 object-cover shadow-lg border-2 border-gray-200"
                    />
                  </div>
                )}
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {expert.name}
                  </h2>
                  <p className="text-gray-500">{expert.email}</p>
                  <p className="text-gray-500">Mobile: {expert.mobile}</p>
                  <p className="text-gray-500">Service: {serviceName}</p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="bg-gray-100 p-4 rounded-lg border shadow-lg">
                <h2 className="text-lg font-semibold mb-4">
                  Verification Status
                </h2>
                <div className="mb-3">
                  <p className="text-lg font-semibold">
                    Current Status:
                    <span className="text-black font-semibold text-base">
                      {expert.isVerified === 'true' && ' Verified'}
                      {expert.isVerified === 'pending' &&
                        ' Verification Pending'}
                      {expert.isVerified === 'false' && ' Not Requested'}
                      {expert.isVerified === 'rejected' &&
                        ' Verification Rejected'}
                    </span>
                  </p>
                </div>

                {/* Verification Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold">Gov ID Type</h2>
                    <p className="text-gray-700">
                      {expert.verificationDetails.govIdType}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">Gov ID Number</h2>
                    <p className="text-gray-700">
                      {expert.verificationDetails.govIdNumber}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <h2 className="text-lg font-semibold">Document</h2>
                    {expert.verificationDetails.document && (
                      <img
                        className="w-full h-auto"
                        src={expert?.verificationDetails?.document?`https://${BUCKET}.s3.${REGION}.amazonaws.com/${expert.verificationDetails.document}`:'image'}
                      />
                    )}
                  </div>
                </div>
              </div>

              {expert.isVerified === 'pending' && (
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    className="border-2 border-green-600 text-green-600 px-6 py-2 rounded-lg shadow-md hover:bg-green-600 hover:text-white"
                    onClick={() => handleVerificationAction('accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="border-2 border-red-500 text-red-500 px-6 py-2 rounded-lg shadow-md hover:bg-red-600 hover:text-white"
                    onClick={() => handleVerificationAction('rejected')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDetails;
