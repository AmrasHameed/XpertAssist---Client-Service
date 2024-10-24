/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import '../../../../OlaMapsWebSDK/OlaMapsWebSDK/style.css';
import { OlaMaps } from '../../../../OlaMapsWebSDK/OlaMapsWebSDK/olamaps-js-sdk.es';
import axios from 'axios';
import axiosUser from '../../../service/axios/axiosUser';
import { useDispatch, useSelector } from 'react-redux';
import { Service } from '../../../interfaces/interface';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { connectSocket, disconnectSocket, getSocket } from '../../../Socket';
import { startSearching } from '../../../service/redux/slices/expertSearch';

const AUTOCOMPLETE_API_URL = import.meta.env.VITE_AUTOCOMPLETE_API_URL;
const REVERSE_GEOCODING_API_URL = import.meta.env
  .VITE_REVERSE_GEOCODING_API_URL;
const API_KEY = import.meta.env.VITE_OLA_MAPS_API_KEY;

interface Coordinates {
  lng: number;
  lat: number;
}

const MapAndLocation = () => {
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );
  const {userId} = useSelector((store: { user: {userId: string} }) => store.user);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [olaMap, setOlaMap] = useState<OlaMaps | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lng: 0,
    lat: 0,
  });
  const [marker, setMarker] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>('');
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<any[]>(
    []
  );
  const [reverseGeocodeSuggestions, setReverseGeocodeSuggestions] = useState<
    any[]
  >([]);
  const [shouldFetchAutocomplete, setShouldFetchAutocomplete] =
    useState<boolean>(true);
  const [isReverseGeocodeActive, setIsReverseGeocodeActive] =
    useState<boolean>(false);

  const suggestionsRef = useRef<HTMLUListElement | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelect = (service: Service) => {
    formik.setFieldValue('service', service._id);
    setIsOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('userToken') || '';
    const refreshToken = localStorage.getItem('refreshToken') || '';
    const socket = connectSocket(token, refreshToken);
    socket.on('newTokens', (data) => {
      const { token, refreshToken } = data;
      localStorage.setItem('userToken', token);
      localStorage.setItem('refreshToken', refreshToken);
    });
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const initMap = (lat: number, lng: number) => {
      const olaMapsInstance = new OlaMaps({
        apiKey: [API_KEY],
      });

      const map = olaMapsInstance.init({
        style:
          'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json',
        container: 'map',
        center: [lng, lat],
        zoom: 15,
      });

      const markerInstance = olaMapsInstance
        .addMarker({
          offset: [0, 6],
          anchor: 'bottom',
          color: 'red',
          draggable: true,
        })
        .setLngLat([lng, lat])
        .addTo(map);

      const onDragEnd = () => {
        const lngLat = markerInstance.getLngLat();
        if (
          lngLat &&
          typeof lngLat.lng === 'number' &&
          typeof lngLat.lat === 'number'
        ) {
          setCoordinates({ lng: lngLat.lng, lat: lngLat.lat });
          setSearchInput(`${lngLat.lat}, ${lngLat.lng}`);
          setIsReverseGeocodeActive(true);
          reverseGeocode(lngLat.lat, lngLat.lng);
          formik.setFieldValue('location', {
            lng: lngLat.lng,
            lat: lngLat.lat,
          });
        }
      };

      markerInstance.on('dragend', onDragEnd);
      setOlaMap(map);
      setMarker(markerInstance);
      return () => {
        markerInstance.off('dragend', onDragEnd);
      };
    };

    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ lng: longitude, lat: latitude });
            initMap(latitude, longitude);
            setLoading(false);
          },
          (error) => {
            console.error('Error getting location', error);
            const defaultLocation = {
              lat: 12.931423492103944,
              lng: 77.61648476788898,
            };
            setCoordinates(defaultLocation);
            initMap(defaultLocation.lat, defaultLocation.lng);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        console.error('Geolocation not supported');
        const defaultLocation = {
          lat: 12.931423492103944,
          lng: 77.61648476788898,
        };
        setCoordinates(defaultLocation);
        initMap(defaultLocation.lat, defaultLocation.lng);
        setLoading(false);
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (shouldFetchAutocomplete && searchInput && !isReverseGeocodeActive) {
        fetchAutocompleteSuggestions(searchInput);
      } else {
        setAutocompleteSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchInput, shouldFetchAutocomplete, isReverseGeocodeActive]);

  const fetchAutocompleteSuggestions = async (input: string) => {
    try {
      const response = await axios.get(AUTOCOMPLETE_API_URL, {
        params: {
          input,
          api_key: API_KEY,
        },
      });
      setAutocompleteSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions', error);
    }
  };

  const handlePlaceSelect = (place: any) => {
    const { lat, lng } = place.geometry.location;
    setCoordinates({ lng, lat });
    olaMap?.panTo([lng, lat]);
    if (marker) {
      marker.setLngLat([lng, lat]);
    }
    setSearchInput(place.description || place.formatted_address);
    formik.setFieldValue('location', { lat, lng });
    setShouldFetchAutocomplete(false);
    setAutocompleteSuggestions([]);
    setReverseGeocodeSuggestions([]);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(REVERSE_GEOCODING_API_URL, {
        params: {
          latlng: `${lat},${lng}`,
          api_key: API_KEY,
        },
      });

      const results = response.data.results;
      setReverseGeocodeSuggestions(results || []);
      setIsReverseGeocodeActive(true);
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setShouldFetchAutocomplete(true);
    setIsReverseGeocodeActive(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setReverseGeocodeSuggestions([]);
      setAutocompleteSuggestions([]);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lng: longitude, lat: latitude });
          setSearchInput(`${latitude}, ${longitude}`);
          reverseGeocode(latitude, longitude);
          formik.setFieldValue('location', { lat: latitude, lng: longitude });
          olaMap?.panTo([longitude, latitude]);
          if (marker) {
            marker.setLngLat([longitude, latitude]);
          }
        },
        (error) => console.error('Error getting location', error)
      );
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validationSchema = Yup.object({
    service: Yup.string().required('Service is required'),
    location: Yup.object({
      lat: Yup.number()
        .required('Location is required')
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90'),
      lng: Yup.number()
        .required('Location is required')
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180'),
    }).required('Location is required'),
    notes: Yup.string()
      .min(25, 'Description must be at least 25 characters long')
      .max(300, 'Description cannot exceed 300 characters')
      .required('Description in required'),
  });

  const formik = useFormik({
    initialValues: {
      location: { lat: '', lng: '' },
      service: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const location: Coordinates = {
          lat: Number(values.location.lat),
          lng: Number(values.location.lng),
        };
        const socket = getSocket();
        if (socket) {
          socket.emit('service-request', {
            location,
            service: values.service,
            notes: values.notes,
            userId,
          });
          // dispatch(startSearching())
        } else {
          console.error('Socket not connected');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log('Error:', err.message);
        } else {
          console.log('An unknown error occurred');
        }
      }
    },
  });

  return (
    <div className="bg-gradient-to-b from-black via-black to-white min-h-screen flex items-center justify-center pb-10">
      <div className="relative flex">
        <div className="flex flex-col justify-start ml-4 p-2">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col">
              <h1 className="text-[2.5rem] font-extrabold text-white text-shadow-glow">
                Select the{' '}
                <span
                  className="relative inline-block text-shadow-none"
                  style={{
                    textDecoration: 'none',
                    backgroundImage:
                      'linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Location
                </span>
              </h1>
              <h1 className="text-[2.5rem] font-extrabold text-white text-shadow-glow">
                and{' '}
                <span
                  className="relative inline-block text-shadow-none"
                  style={{
                    textDecoration: 'none',
                    backgroundImage:
                      'linear-gradient(137.48deg, #ffdb3b 10%, #fe53bb 45%, #8f51ea 67%, #0044ff 87%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Service
                </span>
              </h1>
            </div>

            <div className="relative w-[450px] mt-6">
              <input
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                placeholder="Search for places..."
                className="p-3  rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-[400px] transition duration-200"
              />
              <span className="absolute inset-y-0 right-0.5 flex items-center group">
                <button
                  onClick={handleCurrentLocation}
                  className="py-[0.40rem] px-[0.60rem] rounded-lg border-2 bg-gray-200 transition-colors duration-200 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-2xl">
                    my_location
                  </span>
                </button>
                <span className="absolute top-12 left-5 -translate-x-1/2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[2000]">
                  Current Location
                </span>
              </span>
            </div>
            {formik.errors.location && formik.touched.location && (
              <div className="text-red-600 text-sm">
                {formik.errors.location.lat || formik.errors.location.lat}
              </div>
            )}
            {isReverseGeocodeActive && reverseGeocodeSuggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="bg-white list-none p-2 mt-2 rounded-lg shadow-lg z-10 w-96"
              >
                {reverseGeocodeSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex cursor-pointer p-2 transition-colors duration-200 hover:bg-gray-100 truncate"
                    onClick={() => handlePlaceSelect(suggestion)}
                  >
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                    &nbsp;{suggestion.formatted_address}
                  </li>
                ))}
              </ul>
            )}
            {!isReverseGeocodeActive && autocompleteSuggestions.length > 0 && (
              <ul className="bg-white list-none p-2 mt-2 rounded-lg shadow-lg z-10 w-96">
                {autocompleteSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handlePlaceSelect(suggestion)}
                    className="flex cursor-pointer p-2 transition-colors duration-200 hover:bg-gray-100 truncate"
                  >
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                    &nbsp;
                    {suggestion.description || suggestion.formatted_address}
                  </li>
                ))}
              </ul>
            )}
            <div className="relative mb-2 my-2">
              <div
                className="peer w-full p-2 border bg-gray-200 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black cursor-pointer flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="flex-2">
                  {formik.values.service
                    ? services.find(
                        (service) => service._id === formik.values.service
                      )?.name
                    : 'Select a service you want'}
                </span>
                <span className="flex-shrink-2">
                  <span
                    className={`material-symbols-outlined w-6 h-6 transition-transform ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  >
                    arrow_drop_down
                  </span>
                </span>
              </div>
              {isOpen && (
                <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 z-10">
                  {services.map((service) => (
                    <li
                      key={service._id}
                      className="p-2 hover:bg-gray-200 relative"
                      onClick={() => handleSelect(service)}
                      data-tooltip-id={`tooltip-${service._id}`}
                    >
                      {service.name}
                      <Tooltip
                        id={`tooltip-${service._id}`}
                        className="bg-gray-700 text-white"
                      >
                        {service.description}
                      </Tooltip>
                    </li>
                  ))}
                </ul>
              )}
              {formik.errors.service && formik.touched.service && (
                <div className="text-red-600 text-sm">
                  {formik.errors.service}
                </div>
              )}
            </div>
            <div className="relative mb-2">
              <textarea
                name="notes"
                placeholder="Please describe the issue you are facing..."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.notes || ''}
                rows="5"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
              {formik.errors.notes && formik.touched.notes && (
                <div className="text-red-500 text-sm">
                  {formik.errors.notes}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-white text-black rounded border-2 hover:bg-black hover:text-white border-black hover:ring-2 hover:ring-cyan-600"
            >
              Send Request
            </button>
          </form>
        </div>
        <div className="border-2 h-[500px] w-[500px] rounded-lg m-2">
          <div className="h-full w-full flex-shrink-0 p-2 rounded-full relative hover:ring-2">
            {' '}
            <div id="map" className="h-full w-full "></div>
            {!loading && (
              <div className="absolute bottom-8 left-2 bg-black bg-opacity-50 text-white p-2 rounded-lg z-10">
                {' '}
                <p className="text-xs">Longitude: {coordinates.lng}</p>
                <p className="text-xs">Latitude: {coordinates.lat}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapAndLocation;
