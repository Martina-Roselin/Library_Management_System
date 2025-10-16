import React, { useState } from 'react';
import { FileText, Download, Calendar, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ReportsPage = () => {
  const [loading, setLoading] = useState({});

  const handleDownloadReport = async (reportType) => {
    setLoading({ ...loading, [reportType]: true });
    
    try {
      const response = await axios.get(`/api/reports/${reportType}`, {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from content-disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${reportType}-report.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to download ${reportType} report:`, error);
      alert(`Failed to generate ${reportType} report. Please try again.`);
    } finally {
      setLoading({ ...loading, [reportType]: false });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        </div>
        <p className="text-gray-600">Generate and download comprehensive library reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issuance Report Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h2 className="text-xl font-semibold text-blue-900">
                Issuance Report
              </h2>
            </div>
            <p className="text-blue-700 text-sm">
              Comprehensive report of all book issuance records including issue dates, due dates, and return status.
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Report includes:</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Complete issuance history</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>User details and book information</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Issue and due dates</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Return status tracking</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => handleDownloadReport('issuance')}
              disabled={loading.issuance}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading.issuance ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Generate Issuance Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Overdue Report Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-red-50 border-b border-red-100">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <h2 className="text-xl font-semibold text-red-900">
                Overdue Report
              </h2>
            </div>
            <p className="text-red-700 text-sm">
              Detailed report of all overdue books with fine calculations and borrower information.
            </p>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Report includes:</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>Overdue book listings</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>Fine calculations</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>Borrower contact details</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>Days overdue tracking</span>
                </li>
              </ul>
            </div>
            
            <button
              onClick={() => handleDownloadReport('overdue')}
              disabled={loading.overdue}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading.overdue ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Generate Overdue Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Report Information</h3>
          <div className="mt-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">File Format</h4>
                <p>Reports are generated in PDF format for easy viewing and printing.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Data Currency</h4>
                <p>All reports reflect real-time data from the library management system.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Access Control</h4>
                <p>Report generation is restricted to administrators only.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Usage</h4>
                <p>Perfect for audits, analysis, and administrative record keeping.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;