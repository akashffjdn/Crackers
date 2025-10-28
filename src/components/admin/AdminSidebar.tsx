import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaHome,FaCalendarAlt ,
   FaFolder,  // ✅ Add this import
  FaTh 
  
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: FaTachometerAlt,
      label: 'Dashboard',
      color: 'text-blue-600'
    },
    {
      path: '/admin/products',
      icon: FaBox,
      label: 'Products',
      color: 'text-green-600'
    },
     {
      path: '/admin/festival-collections',  // ✅ Add Festival Collections
      icon: FaCalendarAlt,
      label: 'Festival Collections',
      color: 'text-yellow-600'
    },
    {
      path: '/admin/orders',
      icon: FaShoppingCart,
      label: 'Orders',
      color: 'text-orange-600'
    },
    {
      path: '/admin/users',
      icon: FaUsers,
      label: 'Users',
      color: 'text-purple-600'
    },
    {
      path: '/admin/content',
      icon: FaFileAlt,
      label: 'Content',
      color: 'text-indigo-600'
    },
    {
      path: '/admin/analytics',
      icon: FaChartBar,
      label: 'Analytics',
      color: 'text-pink-600'
    },
      {
  path: '/admin/categories',
  icon: FaFolder,           // ✅ Changed from FaCog to FaImage (more appropriate for categories)
  label: 'Categories',     // ✅ Changed from 'Settings' to 'Categories'
  color: 'text-blue-600'   // ✅ Changed to blue to distinguish from other sections
},
    {
      path: '/admin/settings',
      icon: FaCog,
      label: 'Settings',
      color: 'text-gray-600'
    },
 

  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm z-40">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/admin/dashboard" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-2 rounded-lg">
            <span className="text-xl font-bold">🎇</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">Sparkle Crackers</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActivePath(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <IconComponent 
                  className={`text-lg ${
                    isActive ? 'text-red-600' : item.color
                  }`} 
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaHome className="text-lg text-blue-600" />
            <span className="font-medium">Visit Store</span>
          </Link>
          
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* Admin Stats */}
        <div className="mt-6 p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Quick Stats</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Today's Orders:</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Orders:</span>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex justify-between">
              <span>Total Revenue:</span>
              <span className="font-semibold">₹45,670</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
