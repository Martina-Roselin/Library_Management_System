import React, { useState, useEffect } from 'react';
import { Users, BookOpen, AlertCircle, DollarSign, Plus, Settings } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    issuedBooks: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const [usersResponse, booksResponse] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/books')
      ]);

      const users = usersResponse.data;
      const books = booksResponse.data;

      setStats({
        totalUsers: users.length,
        totalBooks: books.length,
        issuedBooks: books.filter(book => !book.availability).length,
        overdueBooks: 0 // This would need additional API endpoint
      });
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your library system</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Issued Books</p>
              <p className="text-2xl font-bold text-orange-600">{stats.issuedBooks}</p>
            </div>
            <BookOpen className="h-8 w-8 text-orange-500" />
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <a
              href="/admin/users"
              className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Manage Users</p>
                  <p className="text-sm text-blue-600">View, edit, and manage user accounts</p>
                </div>
              </div>
              <Settings className="h-5 w-5 text-blue-600" />
            </a>

            <a
              href="/admin/books"
              className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Manage Books</p>
                  <p className="text-sm text-green-600">Add, edit, and organize library books</p>
                </div>
              </div>
              <Plus className="h-5 w-5 text-green-600" />
            </a>

            <a
              href="/reports"
              className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <DollarSign className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Generate Reports</p>
                  <p className="text-sm text-purple-600">Download issuance and overdue reports</p>
                </div>
              </div>
              <Settings className="h-5 w-5 text-purple-600" />
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <Users className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Book returned</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Overdue book detected</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;