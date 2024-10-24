import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import axiosUser from '../../../service/axios/axiosUser';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setServices } from '../../../service/redux/slices/serviceSlice';
import { Service } from '../../../interfaces/interface';


const BUCKET =  import.meta.env.VITE_AWS_S3_BUCKET;
const REGION =  import.meta.env.VITE_AWS_S3_REGION;

const Services = () => {
  const services = useSelector((state: { services: { services: Service[] } }) => state.services.services);
  const dispatch = useDispatch()

  useEffect(() => {
    fetchServiceData();
  }, []);

  const fetchServiceData = async () => {
    try {
      const { data } = await axiosUser().get('/getServices');
      if (data) {
        dispatch(setServices(data))
      } else {
        toast.error('No Services Found');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };


  return (
    <div className="bg-gradient-to-b from-cyan-400 via-cyan-300 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-black font-semibold tracking-wide uppercase">
            Our Services
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Services We Provide
          </p>
          <p className="mt-4 max-w-2xl text-xl text-black lg:mx-auto mb-4">
            We offer a range of services to help you in urgent situations.
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={40}
          slidesPerView={3}
          autoplay={{ delay: 3000 }}
          loop={true}
          navigation={{
            nextEl: '.custom-next-button', // Custom buttons
            prevEl: '.custom-prev-button',
          }}
          className="mySwiper"
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border-2 transition-shadow duration-200 ease-in hover:scale-95 hover:shadow-none h-[400px]">
                <img
                  className="w-full h-[200px] object-cover"
                  src={service.serviceImage?`https://${BUCKET}.s3.${REGION}.amazonaws.com/${service.serviceImage}`:'image'}
                  alt={service.name}
                />
                <div className="flex-1 p-6 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-gray-600 flex-1">{service.description}</p>
                  <div className="mt-auto">
                    <button className="w-full px-3 py-2 border-2 border-cyan-300 text-sky-300 font-semibold rounded hover:bg-cyan-300 hover:text-black transition-colors">
                      Book now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons - Placed Below the Swiper */}
        <div className="flex justify-center mt-6 space-x-4">
          <FontAwesomeIcon icon={faArrowLeft} size='2xl' className='custom-prev-button px-4 py-2 text-cyan-900'/>
          <FontAwesomeIcon icon={faArrowRight} size='2xl' className='custom-next-button px-4 py-2 text-cyan-900'/>
        </div>
      </div>
    </div>
  );
};

export default Services;
