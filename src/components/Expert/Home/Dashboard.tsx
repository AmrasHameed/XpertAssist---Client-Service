import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../../service/redux/store';
import { Service } from '../../../interfaces/interface';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../../SocketContext';

interface Location {
  lat: number;
  lng: number;
}

interface UserData {
  name: string;
  email: string;
  mobile: string;
  userImage: string;
}

interface ServiceRequest {
  location: Location;
  service: string;
  notes: string;
  userData: UserData;
  distance: number;
  expertId: string;
  totalAmount: number;
  serviceName: string;
  ratePerHour: number;
}

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const Dashboard = () => {
  const socket = useSocket();
  const { expertId } = useSelector((state: RootState) => state.expert);
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(
    null
  );
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on('newTokens', (data) => {
        const { token, refreshToken } = data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('refreshToken', refreshToken);
      });
      socket.on('get-nearby-experts', async (arrayOfExpertIds) => {
        if (arrayOfExpertIds.includes(expertId)) {
          try {
            const { latitude, longitude } = await getCurrentLocation();
            socket.emit('expertLocation', latitude, longitude, expertId);
          } catch (error) {
            console.error('Error getting current location:', error);
          }
        }
      });
      socket.on('new-service-request', (data) => {
        if (data.expertId === expertId) {
          const serviceDetails = services.find(
            (services) => services._id === data.service
          );
          const serviceName = serviceDetails
            ? serviceDetails.name
            : 'Unknown Service';
          const basePrice = serviceDetails ? serviceDetails.price : NaN;
          const ratePerHour = basePrice * 0.4;
          const totalAmount = calculateAmount(
            Number(basePrice),
            Number(data.distance)
          );
          setServiceRequest({ ...data, totalAmount, serviceName, ratePerHour });
          setCountdown(10);
        }
      });
      socket.on('expert-confirmation', (data) => {
        if (expertId === data.expertId) {
          localStorage.setItem('currentJob-expert', data.jobId);
          navigate('/expert/job');
          socket.emit('user-confirmation', data.jobId);
        }
      });
      return () => {
        socket.off('newTokens');
        socket.off('get-nearby-experts');
        socket.off('new-service-request');
        socket.off('expert-confirmation');
      };
    }
  }, [expertId, navigate, services, socket]);

  useEffect(() => {
    if (serviceRequest && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (countdown === 0) {
      setServiceRequest(null);
    }
  }, [serviceRequest, countdown]);

  const calculateAmount = (basePrice: number, distance: number): number => {
    const distanceCharge = distance * 40;
    const totalAmount = basePrice + distanceCharge;
    return Math.round(totalAmount);
  };

  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            toast.error('Error getting location');
            console.error('Error getting location', error);
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  };
  const handleAccept = () => {
    console.log('Request Accepted');
    socket?.emit('accept-service', serviceRequest);
    setServiceRequest(null);
  };

  const handleReject = () => {
    console.log('Request Rejected');
    setServiceRequest(null);
  };

  const { serviceName, notes, userData, distance, totalAmount, ratePerHour } =
    serviceRequest || {};

  return (
    <div>
      {serviceRequest ? (
        <>
          <div className="absolute inset-0 bg-black bg-opacity-50 z-20" />

          {/* Modal */}
          <div className="flex justify-center items-center relative z-30 h-full">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h3 className="text-2xl font-bold mb-6 text-center text-indigo-600">
                New Service Request (Auto-dismiss in {countdown}s)
              </h3>

              <div className="flex justify-between items-start mb-4">
                {/* User Info Section */}
                <div className="flex items-center">
                  <img
                    src={`https://${BUCKET}.s3.${REGION}.amazonaws.com/${userData?.userImage}`}
                    alt="User"
                    className="w-28 h-28 rounded-full object-cover mr-4 border-2 border-indigo-500"
                  />
                  <div className="space-y-1">
                    <p className="text-gray-800 text-lg font-semibold">
                      Name: {userData?.name}
                    </p>
                    <p className="text-gray-700">Email: {userData?.email}</p>
                    <p className="text-gray-700">Mobile: {userData?.mobile}</p>
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="flex flex-col items-end mt-4">
                  <button
                    onClick={handleAccept}
                    className="bg-green-600 text-white w-32 px-4 py-2 rounded-lg hover:bg-green-700 transition mb-2 shadow"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-600 text-white px-4 w-32 py-2 rounded-lg hover:bg-red-700 transition shadow"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Ride Info Section */}
              <div className="space-y-2 mb-4 p-4 bg-indigo-100 rounded-lg flex justify-between items-center">
                <div className="flex-1 font-semibold">
                  <p className="text-gray-800 p-1">Service: {serviceName}</p>
                  <p className="text-gray-800 p-1">Description: {notes}</p>
                  <p className="text-gray-800 p-1">
                    Distance: {distance?.toFixed(4)} km
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex flex-col items-end">
                  <div className="text-4xl font-bold text-gray-800 pr-5">
                    ₹{totalAmount?.toFixed(2)}
                  </div>
                  <p className="text-[0.775rem] text-black text-center mt-2">
                    *Additional amount for <br />
                    time taken will be <br />
                    calculated upon completion.
                    <br />
                    Rate: ₹{ratePerHour}/hr.
                  </p>
                </div>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-red-500">
                  *Refreshing the page will clear the current request and it
                  cannot be recovered.{' '}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          No service requests at the moment.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
