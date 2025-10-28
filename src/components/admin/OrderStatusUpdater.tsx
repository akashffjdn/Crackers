import React, { useState } from 'react';
import { FaTimes, FaShippingFast } from 'react-icons/fa';
import { Order } from '../../data/types';

interface OrderStatusUpdaterProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void;
}

const OrderStatusUpdater: React.FC<OrderStatusUpdaterProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Order['status']>('pending');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setTrackingNumber(order.trackingNumber || '');
    }
  }, [order]);

  const statusOptions: { value: Order['status']; label: string; color: string; description: string }[] = [
    {
      value: 'pending',
      label: 'Pending',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      description: 'Order received, awaiting confirmation'
    },
    {
      value: 'confirmed',
      label: 'Confirmed',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'Order confirmed, preparing for processing'
    },
    {
      value: 'processing',
      label: 'Processing',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      description: 'Order is being prepared and packaged'
    },
    {
      value: 'shipped',
      label: 'Shipped',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      description: 'Order has been shipped and is in transit'
    },
    {
      value: 'delivered',
      label: 'Delivered',
      color: 'text-green-600 bg-green-50 border-green-200',
      description: 'Order has been delivered successfully'
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      color: 'text-red-600 bg-red-50 border-red-200',
      description: 'Order has been cancelled'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (order) {
      onUpdateStatus(order.id, selectedStatus, trackingNumber || undefined);
      onClose();
    }
  };

  const generateTrackingNumber = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setTrackingNumber(`SP${timestamp}${randomNum}`);
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Update Order Status</h2>
            <p className="text-sm text-gray-500">Order ID: #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Customer:</span>
              <p className="text-gray-900">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Order Date:</span>
              <p className="text-gray-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total Amount:</span>
              <p className="text-gray-900 font-semibold">₹{order.total}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Current Status
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {statusOptions.map((status) => (
                <label
                  key={status.value}
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedStatus === status.value
                      ? status.color
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={selectedStatus === status.value}
                    onChange={(e) => setSelectedStatus(e.target.value as Order['status'])}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{status.label}</span>
                      {selectedStatus === status.value && (
                        <div className="w-4 h-4 bg-current rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs mt-1 opacity-80">{status.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Tracking Number */}
          {(selectedStatus === 'shipped' || selectedStatus === 'delivered') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={generateTrackingNumber}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <FaShippingFast />
                  <span>Generate</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to auto-generate or enter custom tracking number
              </p>
            </div>
          )}

          {/* Status Change Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Internal Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any internal notes about this status change..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Status Change Timeline Preview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Status Change Preview</h4>
            <div className="text-sm text-blue-800">
              <p>
                Order #{order.id} status will be updated to{' '}
                <span className="font-semibold">{statusOptions.find(s => s.value === selectedStatus)?.label}</span>
              </p>
              {trackingNumber && (
                <p className="mt-1">Tracking number: <span className="font-mono">{trackingNumber}</span></p>
              )}
              <p className="text-xs text-blue-600 mt-2">
                Customer will be notified via email and SMS about this status change.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <FaShippingFast />
              <span>Update Status</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderStatusUpdater;
