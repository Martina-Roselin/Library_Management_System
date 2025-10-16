import React, { useState } from 'react';
import { BookOpen, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const BookCard = ({ book, onBookUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIssueBook = async () => {
    setLoading(true);
    setError('');
    
    try {
      await axios.post(`/api/books/${book.id}/issue`);
      onBookUpdate && onBookUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async () => {
    setLoading(true);
    setError('');
    
    try {
      await axios.post(`/api/books/${book.id}/return`);
      onBookUpdate && onBookUpdate();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to return book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {book.title}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                <User className="h-4 w-4" />
                <span>{book.author}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {book.availability ? (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Available</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Unavailable</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {book.category}
          </span>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isAuthenticated && (
          <div className="flex space-x-3">
            {book.availability ? (
              <button
                onClick={handleIssueBook}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Issuing...' : 'Issue Book'}
              </button>
            ) : (
              <button
                onClick={handleReturnBook}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Returning...' : 'Return Book'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;