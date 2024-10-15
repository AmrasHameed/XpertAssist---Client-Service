import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axiosExpert from '../../../service/axios/axiosExpert';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Service } from '../../../interfaces/interface';
import Select from 'react-select';
import { expertLogin } from '../../../service/redux/slices/expertAuthSlice';

interface ProfileValues {
  id: string;
  name: string;
  email: string;
  mobile: string;
  expertImage: string;
}

interface VerifyFormValues {
  govIdType: string;
  govIdNumber: string;
  document: File | null;
}

type GovIdType =
  | 'passport'
  | 'aadhaar'
  | 'driver-license'
  | 'voter-id'
  | 'pan-card';

interface ProfileUpdates {
  name?: string;
  mobile?: string;
  expertImage?: File | null;
}

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const ProfileDetails = () => {
  const services = useSelector(
    (state: { services: { services: Service[] } }) => state.services.services
  );
  const expert = useSelector(
    (store: {
      expert: {
        expertId?: string;
        email?: string;
        mobile?: string;
        expert?: string;
        image?: string;
        service?: string;
        isVerified?: string;
      };
    }) => store.expert
  );
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [verify, setVerify] = useState<boolean>(false);

  const [initialValues, setInitialValues] = useState<ProfileValues>({
    id: expert.expertId || '',
    name: expert.expert || '',
    email: expert.email || '',
    mobile: expert.mobile || '',
    expertImage: expert.image || '',
  });

  const serviceDetails = services.find(
    (service) => service._id === expert.service
  );
  const serviceName = serviceDetails ? serviceDetails.name : 'Unknown Service';

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name should be at least 2 characters long')
      .required('Name is required'),
    mobile: Yup.string()
      .matches(/^\d{10}$/, 'Must have 10 digits')
      .required('Mobile number is required'),
  });

  const handleVerifySubmit = async (values: VerifyFormValues) => {
    try {
      const formData = new FormData();
      formData.append('govIdType', values.govIdType);
      formData.append('govIdNumber', values.govIdNumber);
      if (values.document) {
        formData.append('document', values.document);
      }
      try {
        const { data } = await axiosExpert().post(
          `/verifyExpert/${expert.expertId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        if (data.message === 'success') {
          dispatch(
            expertLogin({
              ...expert,
              isVerified: data.isVerified,
            })
          );
          toast.success('Verification Requested successfully');
          setVerify(false);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error((error as Error).message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const idNumberPatterns: Record<GovIdType, RegExp> = {
    passport: /^[a-zA-Z0-9]{5,17}$/,
    aadhaar: /^\d{12}$/,
    'driver-license': /^[a-zA-Z0-9]{5,15}$/,
    'voter-id': /^[a-zA-Z0-9]{1,15}$/,
    'pan-card': /^[A-Z]{5}\d{4}[A-Z]{1}$/,
  };

  const verificationSchema = Yup.object({
    govIdType: Yup.string().required('Please select the type of government ID'),
    govIdNumber: Yup.string()
      .required('Please enter your ID number')
      .test(
        'matches-pattern',
        'Invalid ID number format for the selected ID type',
        function (value) {
          const { govIdType } = this.parent;
          if (value && govIdType) {
            const pattern = idNumberPatterns[govIdType as GovIdType];
            return pattern ? pattern.test(value) : false;
          }
          return false;
        }
      ),
    document: Yup.mixed()
      .required('Please upload your document')
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

  const toggleEditMode = (): void => {
    setEditMode(!editMode);
    if (editMode) {
      setSelectedImage(null);
      setPreviewImage(initialValues.expertImage? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${initialValues.expertImage}`
        : 'image');
      setInitialValues(initialValues);
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleVerify = () => {
    setVerify(true);
  };

  const handleSubmit = async (values: ProfileValues): Promise<void> => {
    const updates: ProfileUpdates = {};
    if (values.name.trim() !== initialValues.name.trim()) {
      updates.name = values.name;
    }
    if (values.mobile.trim() !== initialValues.mobile.trim()) {
      updates.mobile = values.mobile;
    }
    if (selectedImage) {
      updates.expertImage = selectedImage;
    }
    if (Object.keys(updates).length === 0) {
      toast.info('No changes detected, nothing to update.');
      return;
    }
    try {
      const formData = new FormData();
      for (const key in updates) {
        if (updates[key as keyof ProfileUpdates] !== undefined) {
          formData.append(
            key as keyof ProfileUpdates,
            updates[key as keyof ProfileUpdates] as any
          );
        }
      }
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const { data } = await axiosExpert().post(
        `/updateExpert/${expert?.expertId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (data.message === 'success') {
        setEditMode(false);
        dispatch(
          expertLogin({
            ...expert,
            expert: data.name,
            mobile: data.mobile,
            image: data.expertImage,
          })
        );
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const options = [
    { value: 'passport', label: 'Passport' },
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'driver-license', label: "Driver's License" },
    { value: 'voter-id', label: 'Voter ID' },
    { value: 'pan-card', label: 'PAN Card' },
  ];

  return (
    <>
      {verify ? (
        <div className="p-8 w-3/4 bg-white rounded-lg shadow-2xl border-2 ml-4">
          <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>
          <Formik
            initialValues={{ govIdType: '', govIdNumber: '', document: null }}
            validationSchema={verificationSchema}
            onSubmit={handleVerifySubmit}
          >
            {({ setFieldValue, values }) => (
              <Form>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="gov-id-type"
                  >
                    Type of Government ID
                  </label>
                  <Select
                    id="gov-id-type"
                    name="govIdType"
                    options={options}
                    value={options.find(
                      (option) => option.value === values.govIdType
                    )}
                    onChange={(option) =>
                      setFieldValue('govIdType', option.value)
                    }
                    classNamePrefix="react-select"
                    styles={{
                      option: (provided, state) => ({
                        ...provided,
                        color: state.isSelected ? 'white' : 'black',
                        backgroundColor: state.isSelected
                          ? 'black'
                          : state.isFocused
                          ? '#c5c6c7'
                          : 'white',
                        ':hover': {
                          backgroundColor: '#c5c6c7',
                          color: 'black',
                        },
                      }),
                      control: (provided) => ({
                        ...provided,
                        border: '2px solid #000000',
                        boxShadow: 'initial',
                        '&:hover': {
                          border: '2px solid #000000',
                        },
                      }),
                    }}
                  />
                  <ErrorMessage
                    name="govIdType"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Government ID Number */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="gov-id-number"
                  >
                    Government ID Number
                  </label>
                  <Field
                    type="text"
                    id="gov-id-number"
                    name="govIdNumber"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    placeholder="Enter your ID number"
                  />
                  <ErrorMessage
                    name="govIdNumber"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Upload Documents */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="documents"
                  >
                    Upload Document
                  </label>
                  <input
                    type="file"
                    id="document"
                    name="document"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    onChange={(event) => {
                      if (
                        event.currentTarget.files &&
                        event.currentTarget.files[0]
                      ) {
                        setFieldValue('document', event.currentTarget.files[0]);
                      }
                    }}
                  />
                  <ErrorMessage
                    name="document"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between">
                  <button
                    className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-4 rounded"
                    type="submit"
                  >
                    Submit
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      setVerify(false);
                    }}
                  >
                    Back
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="p-8 w-3/4 bg-white rounded-lg shadow-2xl border-2 ml-4">
          <div className="flex items-center justify-between mb-6 relative">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={
                    previewImage || `https://${BUCKET}.s3.${REGION}.amazonaws.com/${expert.image}` || 'placeholder-image-url'
                  }
                  alt="profile"
                  className="w-16 h-16 rounded-full mr-4"
                />
                {editMode && (
                  <label className="w-8 h-8 flex items-center justify-center absolute -bottom-2 right-1 bg-gray-200 rounded-full p-1 cursor-pointer hover:bg-gray-300">
                    <span className="material-symbols-outlined">edit</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
              <div>
                <p className="font-bold">{expert.expert}</p>
                <p className="text-gray-500">{expert.email}</p>
              </div>
            </div>

            {/* isVerified Status on the right side */}
            <div className="flex flex-col items-end">
              {expert.isVerified === 'true' && (
                <p className="flex items-center text-green-500 font-semibold">
                  <span className="material-symbols-outlined font-extrabold mr-1">
                    check_circle
                  </span>
                  Verified
                </p>
              )}
              {expert.isVerified === 'false' && (
                <div className="text-right">
                  <p className="text-gray-500 text-sm mb-2">
                    Didn’t verify your account?
                  </p>
                  <button
                    className="bg-gray-800 text-white py-1 px-3 rounded hover:bg-black"
                    onClick={handleVerify}
                  >
                    Verify
                  </button>
                </div>
              )}
              {expert.isVerified === 'pending' && (
                <p className="text-yellow-500 font-semibold">
                  Verification Pending
                </p>
              )}
              {expert.isVerified === 'rejected' && (
                <div className="flex flex-col items-end">
                  <p className="text-red-500 font-semibold">
                    Verification Rejected
                  </p>
                  <p className="text-sm text-gray-400">
                    Check mail for details
                  </p>
                  <div className="text-right m-1">
                    <button
                      className="bg-gray-800 text-white py-1 px-3 rounded hover:bg-black"
                      onClick={handleVerify}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="flex justify-between py-4">
                    <span className="font-semibold">Name</span>
                    {editMode ? (
                      <div>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500">{expert.expert}</span>
                    )}
                  </div>

                  <div className="flex justify-between py-4">
                    <span className="font-semibold">Email account</span>
                    <span className="text-gray-500">{expert.email}</span>
                  </div>

                  <div className="flex justify-between py-4">
                    <span className="font-semibold">Mobile number</span>
                    {editMode ? (
                      <div>
                        <Field
                          type="text"
                          name="mobile"
                          className="peer w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent"
                        />
                        <ErrorMessage
                          name="mobile"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500">{expert.mobile}</span>
                    )}
                  </div>

                  <div className="flex justify-between py-4">
                    <span className="font-semibold">Service</span>
                    <span className="text-gray-500">{serviceName}</span>
                  </div>

                  {editMode ? (
                    <div>
                      <button
                        type="submit"
                        className="bg-gray-800 text-white py-2 px-4 rounded mt-6 hover:bg-black"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </button>
                      <button
                        type="button"
                        onClick={toggleEditMode}
                        className="bg-gray-500 text-white py-2 px-4 rounded mt-6 ml-4 hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleEditMode}
                      className="bg-black text-white py-2 px-4 rounded mt-6 hover:bg-gray-800"
                    >
                      Edit Profile
                    </button>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDetails;
