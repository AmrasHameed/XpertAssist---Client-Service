import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { axiosAdmin } from '../../../service/axios/axiosAdmin';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'animate.css';
import Loading from '@/utils/Loading';

type Service = {
  _id: string;
  name: string;
  price: number;
  serviceImage: string;
  description: string;
};

const BUCKET =  import.meta.env.VITE_AWS_S3_BUCKET;
const REGION =  import.meta.env.VITE_AWS_S3_REGION;


const ServiceManage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, SetIsLoading] = useState<boolean>(false)

  const servicesPerPage = 5;

  const totalPages = Math.ceil(services.length / servicesPerPage);

  useEffect(() => {
    SetIsLoading(true)
    fetchServiceData();
  }, [currentPage]);


  const fetchServiceData = async () => {
    try {
      const { data } = await axiosAdmin().get('/getServices');
      if (data) {
        SetIsLoading(false)
        setServices(data);
      } else {
        SetIsLoading(false)
        toast.error('No Services Found');
      }
    } catch (error) {
      SetIsLoading(false)
      toast.error((error as Error).message);
    }
  };

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this Service?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
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
      });

      if (result.isConfirmed) {
        const { data } = await axiosAdmin().delete(`/deleteService/${id}`);
        if (data.message === 'success') {
          window.location.reload(); 
          toast.success('User Deleted Successfully')
        }else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div>
      {services.length === 0 ? (
        isLoading?<Loading/>:
        <div>
          <h1 className="flex justify-center items-center text-grey-800 text-2xl pt-3 mt-7">
            Service List is Empty
          </h1>
          <div className="flex justify-center w-full px-4 mt-5">
            <Link to="/admin/add-service">
              <button className="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105">
                Add Service
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col w-full">
          {/* Add Service Button */}
          <div className="flex justify-around w-full px-4 mt-5">
            <Link to="/admin/add-service">
              <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 ">
                Add Service
              </button>
            </Link>
          </div>

          {/* Table */}
          <div className="relative overflow-x-auto shadow-xl sm:rounded-xl border-2 shadow-black mt-3 ">
            <table className=" text-md text-left rounded-lg rtl:text-right ">
              <thead className="text-sm text-center uppercase bg-gray-800 text-gray-100 rounded-lg">
                <tr>
                  <th scope="col" className="px-10 py-3">
                    Image
                  </th>
                  <th scope="col" className="px-10 py-3">
                    Service
                  </th>
                  <th scope="col" className="px-10 py-3">
                    Hourly Charge
                  </th>
                  <th scope="col" className="px-10 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-10 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-center font-medium whitespace-nowrap text-white">
                {currentServices.map((service, index) => (
                  <tr
                    key={service._id || index}
                    className="bg-gray-100 border-white text-gray-900 hover:bg-gray-900 hover:text-white"
                  >
                    <td scope="row" className="px-10 py-3">
                      <div className="w-11 h-11 bg-white overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            service.serviceImage ? 
                            `https://${BUCKET}.s3.${REGION}.amazonaws.com/${service.serviceImage}`:'service-image'
                          }
                          alt="Service"
                        />
                      </div>
                    </td>
                    <td scope="row" className="px-10 py-3">
                      {service.name}
                    </td>
                    <td className="px-10 py-3">₹ {service.price} / hr</td>
                    <td className="px-10 py-3">
                      {service.description.length > 20
                        ? `${service.description.substring(0, 20)}...`
                        : service.description}
                    </td>
                    <td className="px-16 py-4">
                      <Link to={`/admin/update/${service._id}`}>
                        <button className="font-medium dark:text-blue-500 hover:underline mx-1 px-1">
                          Update
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="font-medium dark:text-red-500 hover:underline mx-1 px-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
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

export default ServiceManage;
