import {
  faGithub,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="bg-white mt-6">
  <hr className="" />
  <footer className="bg-white text-black mt-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-between gap-6">
        {/* About Us Section */}
        <div className="w-full sm:w-1/3">
          <h3 className="text-lg font-semibold">About Us</h3>
          <p className="mt-2 text-gray-400">
            We provide reliable and professional services to meet your needs. Our team is dedicated to delivering top-quality work and exceptional customer service.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="w-full sm:w-1/3">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link to={'/'} className="text-gray-400 hover:text-black">
                Home
              </Link>
            </li>
            <li>
              <Link to={'/services'} className="text-gray-400 hover:text-black">
                Services
              </Link>
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
        <div className="w-full sm:w-1/3">
          <h3 className="text-lg font-semibold">Newsletter Signup</h3>
          <p className="mt-2 text-gray-400">
            Sign up for our newsletter to receive the latest updates and offers.
          </p>
          <form className="mt-4">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border-2 ring-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300 pt-6 mt-6">
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-sm text-gray-400 mb-4 sm:mb-0">
            &copy; 2024 XpertAssist. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="mailto:amrazhameed@gmail.com"
              className="text-gray-400 hover:text-gray-500"
            >
              <FontAwesomeIcon icon={faEnvelope} size="xl" />
            </a>
            <a
              href="https://www.instagram.com/amrazhameed/"
              className="text-gray-400 hover:text-gray-500"
            >
              <FontAwesomeIcon icon={faInstagram} size="xl" />
            </a>
            <a
              href="https://github.com/AmrasHameed/"
              className="text-gray-400 hover:text-gray-500"
            >
              <FontAwesomeIcon icon={faGithub} size="xl" />
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
