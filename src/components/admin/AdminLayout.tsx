import React from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout:React.FC<{children:React.ReactNode}> = ({children}) => (
  <div className="min-h-screen bg-gray-50">
    <AdminHeader/>
    <div className="flex pt-16">
      {/* sidebar fixed at 0–64 px width */}
      <AdminSidebar/>
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  </div>
);

export default AdminLayout;
