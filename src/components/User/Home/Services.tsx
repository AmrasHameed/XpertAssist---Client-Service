import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const servicesData = [
  {
    title: 'Plumbing Services',
    description:
      'Expert plumbing services for pipe leaks, clogged drains, and other water-related issues. Available for emergency repairs.',
    image: 'plumbing.jpg',
  },
  {
    title: 'Electrician Services',
    description:
      'Professional electrician services for fixing electrical issues, power outages, wiring, and emergency repairs.',
    image: 'electrician.jpg',
  },
  {
    title: 'Emergency Medical Services',
    description:
      'Ambulance, first aid, and urgent care for medical emergencies.',
    image: 'medical.webp',
  },
  {
    title: 'Fire Services',
    description: 'Fire department response for fire emergencies.',
    image: 'fire.jpg',
  },
  {
    title: 'Locksmith Services',
    description: 'Emergency lockout assistance and security issue resolutions.',
    image: 'lock.jpg',
  },
  {
    title: 'Pest Control',
    description:
      'Immediate response for pest infestations, including termites and bed bugs.',
    image: 'pest.jpg',
  },
  {
    title: 'HVAC Repair',
    description:
      'Emergency heating, ventilation, and air conditioning repairs during extreme weather conditions.',
    image: 'hvac.jpg',
  },
  {
    title: 'Roadside Assistance',
    description:
      'Towing, flat tire repair, battery jump-starts, and fuel delivery for roadside emergencies.',
    image: 'road.jpeg',
  },
];

const Services = () => {
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
          {servicesData.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col border-2 transition-shadow duration-200 ease-in hover:scale-95 hover:shadow-none h-[400px]">
                <img
                  className="w-full h-[200px] object-cover"
                  src={service.image}
                  alt={service.title}
                />
                <div className="flex-1 p-6 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {service.title}
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
