import React from 'react';
import { FaClock, FaCheck, FaTruck, FaBox, FaTimes } from 'react-icons/fa';

interface OrderStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  showIcon?: boolean;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, showIcon = true }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: FaClock,
          label: 'Pending'
        };
      case 'confirmed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: FaCheck,
          label: 'Confirmed'
        };
      case 'processing':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: FaBox,
          label: 'Processing'
        };
      case 'shipped':
        return {
          color: 'bg-orange-100 text-orange-800',
          icon: FaTruck,
          label: 'Shipped'
        };
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-800',
          icon: FaCheck,
          label: 'Delivered'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: FaTimes,
          label: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: FaClock,
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
