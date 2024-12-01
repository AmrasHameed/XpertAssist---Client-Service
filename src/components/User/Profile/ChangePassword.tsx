import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosUser from '../../../service/axios/axiosUser';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface PasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const user = useSelector((store: { user: { userId: string } }) => store.user);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = async (values: PasswordValues) => {
    try {
      setIsSubmitting(true);
      const { data } = await axiosUser().post(
        `/changePassword/${user?.userId}`,
        values
      );
      if (data.message === 'success') {
        toast.success('Password changed successfully');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="change-password p-6 sm:p-8 sm:mx-2 w-full sm:w-3/4 bg-white rounded-lg shadow-glow mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
        Change Password
      </h2>

      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="mb-3 sm:mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-gray-700 font-semibold mb-1 sm:mb-2"
            >
              Current Password
            </label>
            <Field
              type="password"
              name="currentPassword"
              className="peer w-full p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <ErrorMessage
              name="currentPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-semibold mb-1 sm:mb-2"
            >
              New Password
            </label>
            <Field
              type="password"
              name="newPassword"
              className="peer w-full p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <ErrorMessage
              name="newPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="mb-3 sm:mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-semibold mb-1 sm:mb-2"
            >
              Confirm New Password
            </label>
            <Field
              type="password"
              name="confirmPassword"
              className="peer w-full p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="mt-4 sm:mt-6">
            <button
              type="submit"
              className={`w-full sm:w-auto bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Change Password'}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ChangePassword;
