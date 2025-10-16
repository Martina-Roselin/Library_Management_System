import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const PaymentsPage = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      const response = await axios.get('/api/payments/fines');
      setFines(response.data);
    } catch (error) {
      console.error('Failed to fetch fines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (fine) => {
    setPaymentLoading(fine.id);
    
    try {
      await axios.post('/api/payments/pay', {
        fineId: fine.id,
        amount: parseFloat(fine.amount),
        paymentMethod
      });
      
      fetchFines(); // Refresh the list
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setPaymentLoading(null);
    }
  };

  const totalPendingAmount = fines
    .filter(fine => fine.status === 'PENDING')
    .reduce((sum, fine) => sum + parseFloat(fine.amount), 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <DollarSign className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Payments & Fines</h1>
        </div>
        <p className="text-gray-600">Manage your outstanding fines and payment history</p>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Pending Fines</p>
            <p className="text-2xl font-bold text-red-600">${totalPendingAmount.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Fines</p>
            <p className="text-2xl font-bold text-gray-900">{fines.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Paid Fines</p>
            <p className="text-2xl font-bold text-green-600">
              {fines.filter(fine => fine.status === 'PAID').length}
            </p>
          </div>
        </div>
      </div>

      {fines.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No fines</h3>
          <p className="mt-1 text-sm text-gray-500">
            You have no outstanding fines. Keep up the good work!
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Fines History</h2>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fine ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Record
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fines.map((fine) => (
                  <tr key={fine.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{fine.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-semibold text-red-600">
                        ${parseFloat(fine.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p>Issue #{fine.issueRecord?.id}</p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(fine.issueRecord?.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fine.status === 'PAID' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {fine.status === 'PENDING' && (
                        <button
                          onClick={() => handlePayment(fine)}
                          disabled={paymentLoading === fine.id}
                          className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>
                            {paymentLoading === fine.id ? 'Processing...' : 'Pay Now'}
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;