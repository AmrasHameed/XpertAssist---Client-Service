import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Player } from '@lottiefiles/react-lottie-player';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosAdmin } from '../../../service/axios/axiosAdmin';

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchService();
  }, [id]);
  const fetchService = async () => {
    try {
      const { data } = await axiosAdmin().get(`/getService/${id}`);
      formik.setValues({
        serviceName: data.name,
        description: data.description,
        price: data.price,
        image: '',
      });
      setImageUrl(
        `https://${BUCKET}.s3.${REGION}.amazonaws.com/${data.serviceImage}`
      );
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      serviceName: '',
      description: '',
      price: '',
      image: '',
    },
    validationSchema: Yup.object({
      serviceName: Yup.string().required('Service name is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required'),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.serviceName);
        formData.append('description', values.description);
        formData.append('price', values.price);
        if (values.image) formData.append('serviceImage', values.image);

        console.log('FormData Entries:');
        formData.forEach((value, key) => {
          console.log(key + ': ' + value);
        });

        const { data } = await axiosAdmin().put(
          `/updateService/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        if (data.message === 'success') {
          toast.success('Service updated successfully!');
          navigate('/admin/service-management');
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue('image', file);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      setImageUrl(null);
      formik.setFieldValue('image', null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-10">
      <div className="w-full max-w-4xl">
        {/* Centered Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Edit Service</h1>
        </div>

        <div className="flex">
          {/* Form Section on the Left */}
          <div className="w-1/2 space-y-1">
            <form onSubmit={formik.handleSubmit}>
              {/* Service Name Field */}
              <div className="relative mb-4 mt-3">
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  value={formik.values.serviceName}
                  onChange={formik.handleChange}
                  className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
                  placeholder="Service Name"
                />
                <label
                  htmlFor="serviceName"
                  className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1"
                >
                  Service Name
                </label>
                {formik.errors.serviceName && formik.touched.serviceName ? (
                  <div className="text-red-600 text-sm">
                    {formik.errors.serviceName}
                  </div>
                ) : null}
              </div>

              {/* Description Field */}
              <div className="relative mb-4">
                <textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
                  placeholder="Service Description"
                />
                <label
                  htmlFor="description"
                  className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1"
                >
                  Description
                </label>
                {formik.errors.description && formik.touched.description ? (
                  <div className="text-red-600 text-sm">
                    {formik.errors.description}
                  </div>
                ) : null}
              </div>

              {/* Price Field */}
              <div className="relative mb-4">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
                  placeholder="Price"
                />
                <label
                  htmlFor="price"
                  className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1"
                >
                  Price
                </label>
                {formik.errors.price && formik.touched.price ? (
                  <div className="text-red-600 text-sm">
                    {formik.errors.price}
                  </div>
                ) : null}
              </div>

              {/* Image Field */}
              <div className="relative mb-4">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
                />
                <label
                  htmlFor="image"
                  className="absolute left-2 -top-3.5 text-sm text-gray-600 bg-white px-1"
                >
                  Upload Image
                </label>
                {formik.errors.image && formik.touched.image ? (
                  <div className="text-red-600 text-sm">
                    {formik.errors.image}
                  </div>
                ) : null}
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="mt-2 h-24" />
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-black text-white rounded hover:bg-gray-800"
              >
                Update Service
              </button>
            </form>
          </div>

          {/* Animation Section on the Right */}
          <div className="w-1/2 ml-12 flex justify-center items-center">
            <Player
              autoplay
              loop
              src="/Animation - addService.json"
              style={{ height: '400px', width: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;
