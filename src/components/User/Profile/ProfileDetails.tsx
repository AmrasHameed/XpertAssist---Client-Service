import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axiosUser from '../../../service/axios/axiosUser';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

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

const ProfileDetails = () => {
  const user = useSelector((store: { user: { userId: string } }) => store.user);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<ProfileValues>({
    id: '',
    name: '',
    email: '',
    mobile: '',
    userImage: '',
  });

  useEffect(() => {
    if (user?.userId) {
      fetchServiceData();
    }
  }, []);

  const fetchServiceData = async (): Promise<void> => {
    try {
      const { data } = await axiosUser().get(`/getUser/${user?.userId}`);
      if (data.message === 'success') {
        setInitialValues(data);
        setPreviewImage(data.userImage);
      } else {
        toast.error('No Services Found');
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

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
      setPreviewImage(initialValues.userImage);
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
        window.location.reload()
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  
  return (
    <div className="p-8 w-3/4 bg-white rounded-lg shadow-glow ml-4">
     <div className="flex items-center mb-6 relative">
        <div className="relative">
          <img
            src={previewImage || initialValues.userImage}
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
          <p className="font-bold">{initialValues.name}</p>
          <p className="text-gray-500">{initialValues.email}</p>
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
                  <span className="text-gray-500">{initialValues.name}</span>
                )}
              </div>

              <div className="flex justify-between py-4">
                <span className="font-semibold">Email account</span>
                <span className="text-gray-500">{initialValues.email}</span>
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
                  <span className="text-gray-500">{initialValues.mobile}</span>
                )}
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
  );
};

export default ProfileDetails;
