import { useEffect, useState } from 'react';
import {
  FaWallet,
  FaArrowDown,
  FaArrowUp,
  FaMoneyBillWave,
} from 'react-icons/fa';
import axiosExpert from '../../../service/axios/axiosExpert';
import { useSelector } from 'react-redux';
import { RootState } from '@/service/redux/store';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Loading from '@/utils/Loading';
import 'animate.css';

interface Transaction {
  jobId?: string;
  type: 'credited' | 'debited';
  earning: number;
}

interface WalletData {
  totalEarning: number;
  earnings: Transaction[];
}

const Wallet = () => {
  const expertId = useSelector((store: RootState) => store.expert.expertId);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosExpert().get(`/walletData/${expertId}`);
        setWalletData(data);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [expertId]);

  const handleWithdraw = async () => {
    if (walletData?.totalEarning && walletData.totalEarning < 500) {
      toast.error(
        'Insufficient balance. Minimum balance for withdrawal is ₹500'
      );
      return;
    }

    if (walletData?.totalEarning && walletData.totalEarning >= 500) {
      const { value } = await Swal.fire({
        title: 'Enter Amount to Withdraw',
        input: 'number',
        inputAttributes: {
          min: 1,
          max: walletData.totalEarning,
          step: 1,
        },
        showCancelButton: true,
        confirmButtonText: 'Withdraw',
        cancelButtonText: 'Cancel',
        background: '#1e1e1e',
        color: '#ffffff',
        iconColor: '#ff0000',
        buttonsStyling: true,
        showClass: {
          popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `,
        },
        hideClass: {
          popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `,
        },
        inputValidator: (value) => {
          if (value <= 0) {
            return 'Amount must be greater than zero. Please enter a valid amount';
          }
          if (value < 500) {
            return 'Amount must be greater than ₹ 500. Please enter a valid amount';
          }
          if (value > walletData.totalEarning) {
            return `Amount must be less than ₹ ${walletData.totalEarning}. Please enter a valid amount`;
          }
        },
      });

      if (value && !isNaN(Number(value))) {
        const withdrawAmount = Number(value);
        try {
          const { data } = await axiosExpert().put(`/withdraw/${expertId}`, {
            amount: withdrawAmount,
          });
          if (data?.message === 'success') {
            setWalletData((prevState) => {
              if (!prevState) return null;
              const newTransaction: Transaction = {
                type: 'debited',
                earning: -withdrawAmount,
              };
              return {
                totalEarning: prevState.totalEarning - withdrawAmount,
                earnings: [...prevState.earnings, newTransaction],
              };
            });
            toast.success(`Successfully withdrew ₹${withdrawAmount}`);
          }
        } catch (error) {
          toast.error((error as Error).message);
        }
      }
    }
  };

  const totalPages = walletData
    ? Math.ceil(walletData.earnings.length / itemsPerPage)
    : 1;
  const currentEarnings = walletData
    ? walletData.earnings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!walletData) {
    return <div className="text-center">Nothing to display here</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 p-10 bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-2xl border border-gray-300">
      {/* Header */}
      <div className="flex items-center mb-1">
        <FaWallet size={30} className="text-indigo-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">My Wallet</h2>
      </div>

      {/* Balance */}
      <div className="text-center mb-8 flex flex-col items-center space-y-6">
        <h3 className="text-lg font-medium text-gray-500">Current Balance</h3>

        {/* Total Earning in a circle with a gradient green ring */}
        <p className="text-4xl font-extrabold text-gray-800 shadow-2xl mt-2 w-40 h-40 rounded-full flex items-center justify-center bg-white ring-8 ring-green-500">
          ₹{walletData?.totalEarning?.toFixed(2)}
        </p>

        {/* Withdraw Button */}
        <div className="text-center mt-4">
          <button
            className="flex items-center justify-center bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200"
            onClick={handleWithdraw}
          >
            <FaMoneyBillWave className="mr-2" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-6">
          Recent Transactions
        </h3>
        <ul>
          {currentEarnings.map((transaction, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-4 px-6 rounded-lg mb-4 bg-white shadow-md transform hover:scale-105 transition-transform duration-200"
            >
              <div className="flex items-center">
                {transaction.type === 'credited' ? (
                  <FaArrowDown className="text-green-500 mr-3" />
                ) : (
                  <FaArrowUp className="text-red-500 mr-3" />
                )}
                <div>
                  {transaction.jobId ? (
                    <p className="text-gray-700 font-semibold">
                      Job ID: {transaction.jobId}
                    </p>
                  ) : (
                    <p className="text-gray-700 font-semibold">Withdrawn</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Status: {transaction.type}
                  </p>
                  {transaction.jobId && transaction.type === 'debited' && (
                    <p className="text-sm text-gray-500">Cash On Hand</p>
                  )}
                </div>
              </div>
              <span
                className={`text-lg font-medium ${
                  transaction.type === 'credited'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {transaction.type === 'credited' ? '+' : '-'}₹
                {Math.abs(transaction.earning).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`w-32 px-5 py-2 text-white font-semibold rounded-lg shadow-lg transform transition duration-200 ease-in-out ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-teal-700 hover:scale-105'
            }`}
          >
            Previous
          </button>
          <span className="w-32 px-5 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 font-semibold text-center rounded-lg shadow-md">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`w-32 px-5 py-2 text-white font-semibold rounded-lg shadow-lg transform transition duration-200 ease-in-out ${
              currentPage === totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-teal-700 hover:scale-105'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
