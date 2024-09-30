import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Player } from '@lottiefiles/react-lottie-player';
import { axiosAdmin } from '../../../service/axios/axiosAdmin';
import { useNavigate } from 'react-router-dom';

const AddService = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate()
  const validationSchema = Yup.object({
    serviceName: Yup.string().required('Service name is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be positive'),
    image: Yup.mixed()
      .required('Service image is required')
      .test(
        'fileSize',
        'File too large',
        (value) => value && value.size <= 5 * 1024 * 1024
      )
      .test(
        'fileType',
        'Unsupported File Format',
        (value) =>
          value &&
          [
            'image/jpg',
            'image/jpeg',
            'image/png',
            'image/avif',
            'image/webp',
          ].includes(value.type)
      ),
  });

  const formik = useFormik({
    initialValues: {
      serviceName: '',
      description: '',
      price: '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.serviceName);
      formData.append('description', values.description);
      formData.append('price', values.price);
      if (values.image) {
        formData.append('image', values.image);
      }

      try {
        const {data} = await axiosAdmin().post('/addService', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (data.message === 'success') {
          toast.success('Service added successfully');
          navigate('/admin/service-management')
        } else if(data.message === 'ServiceExist') {
          toast.error('Service Already Exist');
        } else {
            toast.error('Failed to Create Service')
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
      setImageUrl(null);
      formik.setFieldValue('image', null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-10">
      <div className="w-full max-w-4xl">
        {/* Centered Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Add New Service</h1>
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
                Add Service
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

export default AddService;
