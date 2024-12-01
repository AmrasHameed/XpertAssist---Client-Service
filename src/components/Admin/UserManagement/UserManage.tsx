import { useEffect, useState } from 'react';
import { axiosAdmin } from '../../../service/axios/axiosAdmin';
import { toast } from 'react-toastify';
import Loading from '@/utils/Loading';

interface User {
  accountStatus: string;
  _id: string;
  name: string;
  email: string;
  mobile: number;
  userImage: string;
}

const BUCKET = import.meta.env.VITE_AWS_S3_BUCKET;
const REGION = import.meta.env.VITE_AWS_S3_REGION;

const UserManage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, SetIsLoading] = useState<boolean>(false)
  const usersPerPage = 5;

  const totalPages = Math.ceil(users.length / usersPerPage);

  useEffect(() => {
    SetIsLoading(true)
    fetchUserData();
  }, [currentPage]);

  const fetchUserData = async () => {
    try {
      const { data } = await axiosAdmin().get('/getUsers');
      console.log(data);
      if (data) {
        SetIsLoading(false)
        setUsers(data);
      } else {
        SetIsLoading(false)
        toast.error('No Users Found');
      }
    } catch (error) {
      SetIsLoading(false)
      toast.error((error as Error).message);
    }
  };

  const handleBlockUnblock = async (
    userId: string,
    currentStatus: 'Blocked' | 'UnBlocked'
  ) => {
    try {
      const newStatus = currentStatus === 'UnBlocked' ? 'Blocked' : 'UnBlocked';
      const { data } = await axiosAdmin().patch(
        `/users/${userId}/block-unblock`,
        { accountStatus: newStatus }
      );
      if (data.message === 'success') {
        toast.success(`User has been ${newStatus.toLowerCase()} successfully!`);
        fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      {users.length === 0 ? (
         isLoading?<Loading/>:
        <div>
          <h1 className="flex justify-center items-center text-grey-800 text-3xl pt-3 mt-7">
            Users List is Empty
          </h1>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col w-full">
          <h1 className="p-2 m-2 text-3xl font-medium">User Management</h1>
          <div className="relative overflow-x-auto shadow-xl sm:rounded-xl border-2 shadow-black mt-3 ">
            <table className=" text-md text-left rounded-lg rtl:text-right ">
              <thead className="text-sm text-center uppercase bg-gray-800 text-gray-100 rounded-lg">
                <tr>
                  <th scope="col" className="px-8 py-3">
                    User Image
                  </th>
                  <th scope="col" className="px-8 py-3">
                    UserName
                  </th>
                  <th scope="col" className="px-8 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-8 py-3">
                    Mobile
                  </th>
                  <th scope="col" className="px-8 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-center font-medium whitespace-nowrap text-white">
                {currentUsers.map((user, index) => {
                  return (
                    <tr
                      key={user._id || index}
                      className="bg-gray-100 border-white text-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                      <td
                        scope="row"
                        className="px-8 py-3 flex items-center justify-center"
                      >
                        {user.userImage && (
                          <img
                            src={
                              user.userImage
                                ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${user.userImage}`
                                : 'image'
                            }
                            alt="user"
                            className="w-10 h-10 rounded-full border-2 border-black"
                          />
                        )}
                      </td>
                      <td scope="row" className="px-8 py-3">
                        {user.name}
                      </td>
                      <td scope="row" className="px-8 py-3">
                        {user.email}
                      </td>
                      <td scope="row" className="px-8 py-3">
                        {user.mobile}
                      </td>
                      <td className="px-8 py-4">
                        <button
                          onClick={() =>
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-expect-error
                            handleBlockUnblock(user._id, user.accountStatus)
                          }
                          className={`w-20 p-1 rounded-md ${
                            user.accountStatus === 'UnBlocked'
                              ? 'bg-red-600 hover:bg-red-800 text-white'
                              : 'bg-green-600 hover:bg-green-800 text-white'
                          }`}
                        >
                          {user.accountStatus === 'UnBlocked'
                            ? 'Block'
                            : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 mx-2 ${
                currentPage === 1
                  ? 'bg-gray-400'
                  : 'bg-gray-700 hover:bg-gray-900'
              } text-white rounded-lg`}
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-2 text-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-24 px-4 py-2 mx-2 ${
                currentPage === totalPages
                  ? 'bg-gray-400'
                  : 'bg-gray-700 hover:bg-gray-900'
              } text-white rounded-lg`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManage;
