import React, { useState } from 'react';
import { 
  FaSave, 
  FaStore, 
  FaShippingFast, 
  FaBell, 
  FaShieldAlt,
  FaPalette,
  FaEnvelope,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';

interface StoreSettings {
  storeName: string;
  storeDescription: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  currency: string;
  timezone: string;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  maxDeliveryDays: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  stockAlerts: boolean;
  promotionalEmails: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAttempts: number;
}

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [isSaving, setIsSaving] = useState(false);

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'Sparkle Crackers',
    storeDescription: 'Premium quality crackers from Sivakasi',
    storeAddress: '123 Fireworks Street, Sivakasi, Tamil Nadu 626123',
    storePhone: '+91 98765 43210',
    storeEmail: 'info@sparklecrackers.com',
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    freeShippingThreshold: 2000,
    standardShippingCost: 99,
    expressShippingCost: 199,
    maxDeliveryDays: 7
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    promotionalEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  });

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'store', label: 'Store Settings', icon: FaStore },
    { id: 'shipping', label: 'Shipping', icon: FaShippingFast },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'security', label: 'Security', icon: FaShieldAlt }
  ];

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
  }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-red-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your store configuration and preferences</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSave />
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {/* Store Settings */}
              {activeTab === 'store' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Store Name
                        </label>
                        <input
                          type="text"
                          value={storeSettings.storeName}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Currency
                        </label>
                        <select
                          value={storeSettings.currency}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="INR">Indian Rupee (₹)</option>
                          <option value="USD">US Dollar ($)</option>
                          <option value="EUR">Euro (€)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Description
                      </label>
                      <textarea
                        value={storeSettings.storeDescription}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={storeSettings.storePhone}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, storePhone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={storeSettings.storeEmail}
                          onChange={(e) => setStoreSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store Address
                      </label>
                      <textarea
                        value={storeSettings.storeAddress}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, storeAddress: e.target.value }))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Settings */}
              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Free Shipping Threshold (₹)
                        </label>
                        <input
                          type="number"
                          value={shippingSettings.freeShippingThreshold}
                          onChange={(e) => setShippingSettings(prev => ({ ...prev, freeShippingThreshold: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Standard Shipping Cost (₹)
                        </label>
                        <input
                          type="number"
                          value={shippingSettings.standardShippingCost}
                          onChange={(e) => setShippingSettings(prev => ({ ...prev, standardShippingCost: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Express Shipping Cost (₹)
                        </label>
                        <input
                          type="number"
                          value={shippingSettings.expressShippingCost}
                          onChange={(e) => setShippingSettings(prev => ({ ...prev, expressShippingCost: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Delivery Days
                        </label>
                        <input
                          type="number"
                          value={shippingSettings.maxDeliveryDays}
                          onChange={(e) => setShippingSettings(prev => ({ ...prev, maxDeliveryDays: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-2">
                      <ToggleSwitch
                        checked={notificationSettings.emailNotifications}
                        onChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                        label="Email Notifications"
                        description="Receive notifications via email"
                      />
                      
                      <ToggleSwitch
                        checked={notificationSettings.smsNotifications}
                        onChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                        label="SMS Notifications"
                        description="Receive notifications via SMS"
                      />
                      
                      <ToggleSwitch
                        checked={notificationSettings.orderNotifications}
                        onChange={(checked) => setNotificationSettings(prev => ({ ...prev, orderNotifications: checked }))}
                        label="Order Notifications"
                        description="Get notified about new orders"
                      />
                      
                      <ToggleSwitch
                        checked={notificationSettings.stockAlerts}
                        onChange={(checked) => setNotificationSettings(prev => ({ ...prev, stockAlerts: checked }))}
                        label="Stock Alerts"
                        description="Alert when products are running low"
                      />
                      
                      <ToggleSwitch
                        checked={notificationSettings.promotionalEmails}
                        onChange={(checked) => setNotificationSettings(prev => ({ ...prev, promotionalEmails: checked }))}
                        label="Promotional Emails"
                        description="Receive promotional and marketing emails"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Configuration</h3>
                    
                    <div className="mb-6">
                      <ToggleSwitch
                        checked={securitySettings.twoFactorAuth}
                        onChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password Expiry (days)
                        </label>
                        <input
                          type="number"
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={securitySettings.loginAttempts}
                          onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
