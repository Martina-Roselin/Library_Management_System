import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, AlertCircle, DollarSign, User, Book } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    issuedBooks: 0,
    overdueBooks: 0,
    pendingFines: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [issuesResponse, finesResponse] = await Promise.all([
        axios.get('/api/users/issues'),
        axios.get('/api/payments/fines')
      ]);

      const issues = issuesResponse.data;
      const fines = finesResponse.data;

      const issuedBooks = issues.filter(issue => !issue.returnDate).length;
      const overdueBooks = issues.filter(issue => 
        !issue.returnDate && new Date(issue.dueDate) < new Date()
      ).length;
      const pendingFines = fines.filter(fine => fine.status === 'PENDING').length;

      setStats({ issuedBooks, overdueBooks, pendingFines });
      setRecentIssues(issues.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your library activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Currently Issued</p>
              <p className="text-2xl font-bold text-gray-900">{stats.issuedBooks}</p>
            </div>
            <Book className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdueBooks}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Fines</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingFines}</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {recentIssues.length === 0 ? (
            <p className="text-gray-500">No recent book issues</p>
          ) : (
            <div className="space-y-3">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium text-gray-900">Book #{issue.id}</p>
                      <p className="text-sm text-gray-600">
                        Issued: {new Date(issue.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Due: {new Date(issue.dueDate).toLocaleDateString()}
                    </p>
                    {issue.returnDate && (
                      <p className="text-sm text-green-600">Returned</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/books"
              className="block w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <span className="font-medium text-indigo-700">Browse Books</span>
              </div>
            </a>
            <a
              href="/my-books"
              className="block w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700">My Issued Books</span>
              </div>
            </a>
            <a
              href="/payments"
              className="block w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
            >
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-700">View Payments</span>
              </div>
            </a>
            <a
              href="/profile"
              className="block w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
            >
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-700">Edit Profile</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;