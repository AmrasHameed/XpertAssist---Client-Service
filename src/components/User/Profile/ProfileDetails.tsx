import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axiosUser from '../../../service/axios/axiosUser';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../../service/redux/slices/userAuthSlice';

interface ProfileValues {
  id: string;
  name: string;
  email: string;
  mobile: string;
  userImage: string;
}

interface ProfileUpdates {
  name?: string;
  mobile?: string;
  userImage?: File | null;
}

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const ProfileDetails = () => {
  const user = useSelector(
    (store: {
      user: {
        user: string;
        userId: string;
        email: string;
        mobile: string;
        image: string;
      };
    }) => store.user
  );
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<ProfileValues>({
    id: user.userId || '',
    name: user.user || '',
    email: user.email || '',
    mobile: user.mobile || '',
    userImage: user.image || '',
  });
  useEffect(() => {
    setInitialValues({
      id: user.userId || '',
      name: user.user || '',
      email: user.email || '',
      mobile: user.mobile || '',
      userImage: user.image || '',
    });
    setPreviewImage(
      user.image
        ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${user.image}`
        : null
    );
  }, [user]);
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name should be at least 2 characters long')
      .required('Name is required'),
    mobile: Yup.string()
      .matches(/^\d{10}$/, 'Must have 10 digits')
      .required('Mobile number is required'),
  });
  const toggleEditMode = (): void => {
    setEditMode(!editMode);
    if (editMode) {
      setSelectedImage(null);
      setPreviewImage(
        initialValues.userImage
          ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${initialValues.userImage}`
          : ''
      );
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
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
      updates.userImage = selectedImage;
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
      const { data } = await axiosUser().post(
        `/updateProfile/${user?.userId}`,
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
          userLogin({
            ...user,
            user: data.name,
            mobile: data.mobile,
            image: data.userImage,
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

  return (
    <div className="p-4 sm:p-8 w-full sm:w-3/4 bg-white rounded-lg shadow-glow ml-0 sm:ml-4">
      <div className="flex flex-col sm:flex-row items-center mb-8 relative">
        <div className="relative mb-4 sm:mb-0">
          <img
            src={
              previewImage ||
              `https://${BUCKET}.s3.${REGION}.amazonaws.com/${user.image}` ||
              'placeholder-image-url'
            }
            alt="profile"
            className="w-24 h-24 sm:w-20 sm:h-20 rounded-full border-2 border-gray-300"
          />
          {editMode && (
            <label className="w-8 h-8 flex items-center justify-center absolute -bottom-2 right-1 bg-gray-100 rounded-full shadow cursor-pointer hover:bg-gray-200">
              <span className="material-symbols-outlined text-gray-600">
                edit
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        <div className="text-center sm:text-left sm:ml-4">
          <p className="font-bold text-xl">{user.user}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Name Field */}
              <div className="flex flex-col sm:flex-row justify-between py-4">
                <span className="font-semibold text-sm sm:text-base">Name</span>
                {editMode ? (
                  <div className="w-full sm:w-2/3">
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                ) : (
                  <span className="text-gray-500">{user.user}</span>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col sm:flex-row justify-between py-4">
                <span className="font-semibold text-sm sm:text-base">
                  Email
                </span>
                <span className="text-gray-500">{user.email}</span>
              </div>

              {/* Mobile Number Field */}
              <div className="flex flex-col sm:flex-row justify-between py-4">
                <span className="font-semibold text-sm sm:text-base">
                  Mobile
                </span>
                {editMode ? (
                  <div className="w-full sm:w-2/3">
                    <Field
                      type="text"
                      name="mobile"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                ) : (
                  <span className="text-gray-500">{user.mobile}</span>
                )}
              </div>

              {/* Action Buttons */}
              {editMode ? (
                <div className="flex flex-col sm:flex-row mt-6">
                  <button
                    type="submit"
                    className="bg-gray-800 text-white py-2 px-4 rounded-lg shadow hover:bg-black transition-all mb-4 sm:mb-0 w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition-all mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={toggleEditMode}
                  className="bg-black text-white py-2 px-4 rounded-lg shadow hover:bg-gray-800 transition-all mt-6 w-full sm:w-auto"
                >
                  Edit Profile
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProfileDetails;
