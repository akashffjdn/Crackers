import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaArrowUp,      // ✅ Changed from FaTrendingUp
  FaArrowDown,    // ✅ Changed from FaTrendingDown
  FaUsers,
  FaShoppingCart,
  FaRupeeSign,
  FaEye,
  FaHeart,
  FaDownload,
  FaCalendarAlt
} from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import { formatPriceSimple } from '../../utils/formatPrice';

interface AnalyticsData {
  salesTrend: { month: string; sales: number; orders: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  customerData: { newCustomers: number; returningCustomers: number; totalCustomers: number };
  categoryPerformance: { category: string; percentage: number; sales: number }[];
  revenueMetrics: {
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    yearRevenue: number;
    growthRate: number;
  };
  trafficData: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
  };
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call - replace with real analytics API
    const fetchAnalytics = async () => {
      setIsLoading(true);
      
      setTimeout(() => {
        const mockData: AnalyticsData = {
          salesTrend: [
            { month: 'Jan', sales: 45000, orders: 120 },
            { month: 'Feb', sales: 52000, orders: 145 },
            { month: 'Mar', sales: 48000, orders: 132 },
            { month: 'Apr', sales: 61000, orders: 167 },
            { month: 'May', sales: 55000, orders: 156 },
            { month: 'Jun', sales: 67000, orders: 189 },
            { month: 'Jul', sales: 73000, orders: 203 },
            { month: 'Aug', sales: 69000, orders: 194 },
            { month: 'Sep', sales: 78000, orders: 218 },
            { month: 'Oct', sales: 85000, orders: 235 },
            { month: 'Nov', sales: 92000, orders: 267 },
            { month: 'Dec', sales: 103000, orders: 298 }
          ],
          topProducts: [
            { name: 'Premium Golden Sparklers - Pack of 50', sold: 1247, revenue: 248030 },
            { name: 'Diwali Special Family Pack', sold: 445, revenue: 311055 },
            { name: 'Golden Shower Flower Pot - Big Size', sold: 1156, revenue: 345644 },
            { name: 'Color Burst Rockets - Pack of 10', sold: 789, revenue: 314811 },
            { name: 'Colorful Ground Chakkars - Set of 12', sold: 923, revenue: 137527 }
          ],
          customerData: {
            newCustomers: 1247,
            returningCustomers: 1300,
            totalCustomers: 2547
          },
          categoryPerformance: [
            { category: 'Sparklers', percentage: 35, sales: 298500 },
            { category: 'Gift Boxes', percentage: 25, sales: 213750 },
            { category: 'Flower Pots', percentage: 20, sales: 171000 },
            { category: 'Rockets', percentage: 12, sales: 102600 },
            { category: 'Ground Chakkars', percentage: 8, sales: 68400 }
          ],
          revenueMetrics: {
            todayRevenue: 12500,
            weekRevenue: 87500,
            monthRevenue: 356420,
            yearRevenue: 856420,
            growthRate: 23.5
          },
          trafficData: {
            totalVisitors: 45672,
            uniqueVisitors: 32145,
            pageViews: 156789,
            bounceRate: 34.5,
            avgSessionDuration: '4:32'
          }
        };
        
        setAnalyticsData(mockData);
        setIsLoading(false);
      }, 1000);
    };

    fetchAnalytics();
  }, [selectedPeriod]);

  if (isLoading || !analyticsData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const StatCard = ({ icon: Icon, title, value, change, isPositive }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-red-600" />
        </div>
        <div className="ml-4 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-xl sm:text-2xl font-semibold text-gray-900">{value}</div>
              {change && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {change}%
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your business performance and insights</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 3 months</option>
              <option value="year">Last 12 months</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <FaDownload />
              <span className="hidden sm:inline">Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={FaRupeeSign}
            title="Total Revenue"
            value={formatPriceSimple(analyticsData.revenueMetrics.monthRevenue)}
            change={analyticsData.revenueMetrics.growthRate}
            isPositive={true}
          />
          <StatCard
            icon={FaShoppingCart}
            title="Total Orders"
            value="1,823"
            change={15.3}
            isPositive={true}
          />
          <StatCard
            icon={FaUsers}
            title="New Customers"
            value={analyticsData.customerData.newCustomers.toLocaleString()}
            change={8.7}
            isPositive={true}
          />
          <StatCard
            icon={FaEye}
            title="Page Views"
            value={analyticsData.trafficData.pageViews.toLocaleString()}
            change={12.4}
            isPositive={true}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
              <FaChartLine className="text-gray-400" />
            </div>
            <div className="h-64 sm:h-80 flex items-end justify-between space-x-1 sm:space-x-2">
              {analyticsData.salesTrend.slice(-6).map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-gradient-to-t from-red-600 to-red-400 rounded-t w-full transition-all hover:from-red-700 hover:to-red-500"
                    style={{
                      height: `${(data.sales / Math.max(...analyticsData.salesTrend.map(d => d.sales))) * 100}%`,
                      minHeight: '20px'
                    }}
                    title={`${data.month}: ${formatPriceSimple(data.sales)}`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2 font-medium">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
              <FaChartPie className="text-gray-400" />
            </div>
            <div className="space-y-4">
              {analyticsData.categoryPerformance.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-sm font-medium text-gray-900 w-20 sm:w-24 truncate">
                      {category.category}
                    </span>
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-red-600 to-orange-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
              <FaChartBar className="text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                      Product
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                      Sold
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider pb-3">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analyticsData.topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {product.name}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm text-gray-900">{product.sold}</span>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPriceSimple(product.revenue)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Insights */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Customer Insights</h3>
              <FaUsers className="text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {analyticsData.customerData.totalCustomers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Customers</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-semibold text-green-600">
                    {analyticsData.customerData.newCustomers.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">New</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-blue-600">
                    {analyticsData.customerData.returningCustomers.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Returning</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Website Traffic</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Page Views:</span>
                    <span className="font-medium">{analyticsData.trafficData.pageViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unique Visitors:</span>
                    <span className="font-medium">{analyticsData.trafficData.uniqueVisitors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bounce Rate:</span>
                    <span className="font-medium">{analyticsData.trafficData.bounceRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Session:</span>
                    <span className="font-medium">{analyticsData.trafficData.avgSessionDuration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPriceSimple(analyticsData.revenueMetrics.todayRevenue)}
              </div>
              <div className="text-sm text-gray-600">Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatPriceSimple(analyticsData.revenueMetrics.weekRevenue)}
              </div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatPriceSimple(analyticsData.revenueMetrics.monthRevenue)}
              </div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatPriceSimple(analyticsData.revenueMetrics.yearRevenue)}
              </div>
              <div className="text-sm text-gray-600">This Year</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
