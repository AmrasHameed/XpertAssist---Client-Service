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
      <Navbar activePage='services'/>
      <section className="bg-gradient-to-b from-black via-black to-cyan-400 sm:py-16 lg:py-16">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-100 sm:text-3xl">
              Our Featured Services
            </h2>
            <p className="mt-4 text-base font-normal leading-7 text-gray-600">
              Connecting you with trusted service providers for every need.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-10 lg:grid-cols-3 lg:gap-8">
            {currentServices.map((service) => (
              <Link key={service._id} to={''} className="hover:scale-x-105 text-white shadow-glow rounded-lg">
                <div
                  key={service._id}
                  className="relative group border border-gray-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  style={{ height: '380px' }}
                >
                  <div className="overflow-hidden rounded-t-lg h-48">
                    <img
                      className="object-cover w-full h-full transition-all duration-300 group-hover:scale-110"
                      src={service.serviceImage?`https://${BUCKET}.s3.${REGION}.amazonaws.com/${service.serviceImage}`:'image'}
                      alt={service.name}
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between h-[calc(100%-192px)]">
                    <div>
                      <h3 className="text-lg font-bold">
                        <p title={service.name}>
                          {service.name}
                        </p>
                      </h3>
                      <p className="mt-2 text-sm line-clamp-2">
                        {' '}
                        {/* Limit text overflow */}
                        {service.description}
                      </p>
                    </div>
                    <div className="mt-4 text-right">
                      <span className="text-lg font-semibold text-shadow-glow">
                        ₹{service.price} / hr
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <nav className="inline-flex space-x-2">
              {[
                ...Array(Math.ceil(services.length / servicesPerPage)).keys(),
              ].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`px-4 py-2 border border-gray-300 rounded ${
                    currentPage === number + 1
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ServicesPage;
