import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  FileText,
  Bell,
  Settings,
  LogOut,
  Home,
  AlertTriangle,
  Wallet,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const bills = [
    { id: 1, type: 'Water', amount: 450.75, dueDate: '2024-03-25' },
    { id: 2, type: 'Electricity', amount: 875.50, dueDate: '2024-03-28' },
    { id: 3, type: 'Property Tax', amount: 2250.00, dueDate: '2024-04-15' },
  ];

  const notifications = [
    { id: 1, type: 'warning', message: 'Water bill due in 3 days', date: '2024-03-22' },
    { id: 2, type: 'info', message: 'New property assessment completed', date: '2024-03-20' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-[#FF4500]" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.fullName}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Account Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Account Number</p>
                  <p className="text-xl font-bold">{user?.accountNumber}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Total Balance</p>
                  <p className="text-xl font-bold">R 3,576.25</p>
                </div>
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Due Date</p>
                  <p className="text-xl font-bold">March 25, 2024</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bills */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bills</h2>
                <div className="space-y-4">
                  {bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 text-[#FF4500] mr-3" />
                        <div>
                          <p className="font-medium">{bill.type}</p>
                          <p className="text-sm text-gray-500">Due: {bill.dueDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R {bill.amount.toFixed(2)}</p>
                        <Button variant="outline" className="mt-2 text-sm">
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start p-4 bg-gray-50 rounded-lg"
                  >
                    <Bell className="h-5 w-5 text-[#FF4500] mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-gray-500">{notification.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}