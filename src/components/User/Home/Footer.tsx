import {
  faFacebook,
  faInstagram,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer = () => {
  return (
    <div className="bg-white mt-6">
      <hr className="" />
      <footer className="bg-white text-black mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between">
            {/* About Us Section */}
            <div className="w-full sm:w-1/3 mb-6  sm:mb-0">
              <h3 className="text-lg font-semibold">About Us</h3>
              <p className="mt-2 text-gray-400">
                We provide reliable and professional services to meet your
                needs. Our team is dedicated to delivering top-quality work and
                exceptional customer service.
              </p>
            </div>

            {/* Quick Links Section */}
            <div className="w-full sm:w-1/3 mb-6 sm:mb-0">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-black">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-black">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-black">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-black">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter Signup Section */}
            <div className="w-full sm:w-1/3 mb-6 sm:mb-0">
              <h3 className="text-lg font-semibold">Newsletter Signup</h3>
              <p className="mt-2 text-gray-400">
                Sign up for our newsletter to receive the latest updates and
                offers.
              </p>
              <form className="mt-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border-2 ring-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button
                  type="submit"
                  className="mt-2 w-full px-4 py-2 border border-white text-white font-semibold rounded-md hover:bg-white hover:text-black transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-6 mt-6  ">
            <div className="flex flex-wrap items-center justify-between">
              <p className="text-sm text-gray-400 mb-10">
                &copy; 2024 XpertAssist. All rights reserved.
              </p>
              <div className="flex space-x-4 mb-10">
                <a
                  href="www.facebook.com"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={faFacebook} size='xl'/>
                </a>
                <a
                  href="www.intagram.com"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={faInstagram} size='xl' />
                </a>
                <a
                  href="www.x.com"
                  className="text-gray-400 hover:text-gray-300"
                >
                  <FontAwesomeIcon icon={faXTwitter} size='xl'/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
