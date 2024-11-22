import { useState } from 'react';
import Navbar from '../Home/Navbar';
import { Link } from 'react-router-dom';
import Footer from '../Home/Footer';
import { useSelector } from 'react-redux';
import { Service } from '../../../interfaces/interface';


const BUCKET =  import.meta.env.VITE_AWS_S3_BUCKET;
const REGION =  import.meta.env.VITE_AWS_S3_REGION;



const ServicesPage = () => {
  const services = useSelector((state: { services: { services: Service[] } }) => state.services.services);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
    <Navbar activePage="services" />
    <section className="bg-gradient-to-b from-black via-black to-cyan-400 sm:py-16 lg:py-16">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
            Our Featured Services
          </h2>
          <p className="mt-4 text-sm sm:text-base lg:text-lg font-normal leading-7 text-gray-400">
            Connecting you with trusted service providers for every need.
          </p>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 lg:gap-8">
          {currentServices.map((service) => (
            <Link
              key={service._id}
              to={`/request-service?serviceId=${service._id}`}
              className="transform hover:scale-105 text-white shadow-lg rounded-lg transition-transform duration-300"
            >
              <div
                className="relative group border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 h-[380px]"
              >
                <div className="overflow-hidden rounded-t-lg h-48">
                  <img
                    className="object-cover w-full h-full transition-all duration-300 group-hover:scale-110"
                    src={
                      service.serviceImage
                        ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${service.serviceImage}`
                        : 'image'
                    }
                    alt={service.name}
                  />
                </div>
                <div className="p-4 flex flex-col justify-between h-[calc(100%-192px)]">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold truncate">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-4 text-right">
                    <span className="text-sm sm:text-lg font-semibold text-cyan-400">
                      ₹{service.price} / hr
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
  
        <div className="flex justify-center mt-8">
          <nav className="inline-flex flex-wrap space-x-2">
            {[...Array(Math.ceil(services.length / servicesPerPage)).keys()].map(
              (number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-3 sm:px-4 py-2 border border-gray-300 rounded text-sm sm:text-base ${
                    currentPage === number + 1
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  {number + 1}
                </button>
              )
            )}
          </nav>
        </div>
      </div>
    </section>
    <Footer />
  </div>
  
  );
};

export default ServicesPage;
