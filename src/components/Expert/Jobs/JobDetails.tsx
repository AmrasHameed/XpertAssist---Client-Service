/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import '../../../../OlaMapsWebSDK/OlaMapsWebSDK/style.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import { OlaMaps } from '../../../../OlaMapsWebSDK/OlaMapsWebSDK/olamaps-js-sdk.es';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_OLA_MAPS_API_KEY;

interface JobData {
  service: string;
  expertId?: string;
  userId?: string;
  pin?: number;
  notes?: string;
  status?: string;
  distance?: number;
  totalAmount?: number;
  userLocation?: { lat: number; lng: number };
  expertLocation?: { latitude: number; longitude: number };
  ratePerHour?: number;
  serviceName?: string;
}

interface JobDetailsProps {
  jobData: JobData;
}

const JobDetails: React.FC<JobDetailsProps> = ({ jobData }) => {
  const [map, setMap] = useState<any>(null);
  const [, setDirections] = useState<any>(null);
  const [, setMarker] = useState<{ userMarker: any; expertMarker: any } | null>(
    null
  );

  useEffect(() => {
    if (jobData?.expertLocation && jobData?.userLocation && !map) {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) return;
      const olaMapsInstance = new OlaMaps({
        apiKey: [API_KEY],
      });

      const initializedMap = olaMapsInstance.init({
        style:
          'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json',
        container: 'map',
        center: [
          (jobData.expertLocation.longitude + jobData.userLocation.lng) / 2,
          (jobData.expertLocation.latitude + jobData.userLocation.lat) / 2,
        ],
        zoom: 13,
      });

      const popup1 = olaMapsInstance
        .addPopup({ offset: [0, -30], anchor: 'bottom' })
        .setHTML(`<p style="font-weight:bold;">User's Location</p>`);
      const popup2 = olaMapsInstance
        .addPopup({ offset: [0, -30], anchor: 'bottom' })
        .setHTML("<p style='font-weight:bold;'>Expert's Location</p>");

      const userMarker = olaMapsInstance
        .addMarker({
          offset: [0, 6],
          anchor: 'bottom',
          color: 'red',
        })
        .setLngLat([jobData.userLocation.lng, jobData.userLocation.lat])
        .setPopup(popup1)
        .addTo(initializedMap);

      const expertMarker = olaMapsInstance
        .addMarker({
          offset: [0, 6],
          anchor: 'bottom',
        })
        .setLngLat([
          jobData.expertLocation.longitude,
          jobData.expertLocation.latitude,
        ])
        .setPopup(popup2)
        .addTo(initializedMap);

      setMap(initializedMap);
      setMarker({ userMarker, expertMarker });
    }
  }, [jobData?.expertLocation, jobData?.userLocation, map]);

  useEffect(() => {
    if (map) {
      const fetchDirections = async () => {
        if (!jobData || !jobData.userLocation || !jobData.expertLocation)
          return;

        const origin = `${jobData.userLocation.lat},${jobData.userLocation.lng}`;
        const destination = `${jobData.expertLocation.latitude},${jobData.expertLocation.longitude}`;

        try {
          const { data } = await axios.post(
            'https://api.olamaps.io/routing/v1/directions',
            null,
            { params: { origin, destination, api_key: API_KEY } }
          );
          if (data.status === 'SUCCESS') {
            const route = data.routes[0];
            setDirections(route);
            const polyline = route.overview_polyline;
            const decodedPolyline = decodePolylineToGeoJSON(polyline);

            if (map.getSource('route')) {
              map.getSource('route').setData(decodedPolyline);
            } else {
              map.addLayer({
                id: 'route',
                type: 'line',
                source: { type: 'geojson', data: decodedPolyline },
                paint: { 'line-color': '#3b82ff', 'line-width': 6 },
              });
            }
          } else {
            console.error('Failed to fetch directions');
          }
        } catch (error) {
          console.error('Error fetching directions', error);
        }
      };
      map.on('style.load', fetchDirections);
    }
  }, [map, jobData]);

  const decodePolylineToGeoJSON = (encoded: string) => {
    const coords: [number, number][] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0,
      lng = 0;

    while (index < len) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;
      coords.push([lng * 1e-5, lat * 1e-5]);
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
    };
  };

  return (
    <>
      <div className="space-y-2 mb-4 p-4 bg-indigo-100 rounded-lg flex justify-between items-center">
        <div className="flex-1 font-semibold">
          <p className="text-gray-800 p-1">Service: {jobData.serviceName}</p>
          <p className="text-gray-800 p-1">Notes: {jobData.notes}</p>
          <p className="text-gray-800 p-1">
            Status:
            <span
              className={`${
                jobData.status === 'started'
                  ? 'text-green-600'
                  : jobData.status === 'pending'
                  ? 'text-orange-600'
                  : jobData.status === 'completed'
                  ? 'text-blue-600'
                  : 'text-gray-800'
              }`}
            >
              {' '}
              {jobData.status}
            </span>
          </p>
          <p className="text-gray-800 p-1">
            Distance: {jobData.distance?.toFixed(4)} km
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-4xl font-bold text-gray-800 pr-5">
            ₹{' '}
            {(
              (jobData.totalAmount || 0) -
              (jobData.totalAmount || 0) * 0.1
            ).toFixed(2)}
          </div>
          <p className="text-[0.775rem] text-black text-center mt-2">
            *Additional amount for <br />
            time taken will be <br />
            calculated upon completion.
            <br />
            Rate: ₹{jobData.ratePerHour}/hr.
          </p>
        </div>
      </div>
      {jobData.status === 'started' && (
        <p className="text-center text-red-500 text-sm">
          *Press Completed when you complete the task.
        </p>
      )}
      {jobData.status === 'pending' && (
        <div className="border-2 h-[500px] w-[713px] rounded-lg m-2">
          <div id="map" className="h-full w-full"></div>
        </div>
      )}
    </>
  );
};

export default JobDetails;
