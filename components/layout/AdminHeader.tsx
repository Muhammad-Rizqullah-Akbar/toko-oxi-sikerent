// components/layout/AdminHeader.tsx

import React from 'react';
import { User, Bell } from 'lucide-react';

interface AdminHeaderProps {
  pageTitle: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ pageTitle }) => {
  return (
    <header className="bg-white shadow-md p-4 rounded-lg mb-6 flex justify-between items-center sticky top-0 z-30">
        
        {/* Nama Halaman */}
        <h1 className="text-2xl font-bold text-gray-800">
            {pageTitle}
        </h1>
        
        {/* Info Pengguna dan Notifikasi */}
        <div className="flex items-center space-x-4">
            
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative">
                <Bell className="w-6 h-6" />
                {/* Badge Notifikasi */}
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500"></span>
            </button>

            <div className="flex items-center space-x-2 border-l pl-4">
                <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800 font-medium">
                    <User className="w-5 h-5" />
                </div> 
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin OXI</span>
            </div>
        </div>
    </header>
  );
};

export default AdminHeader;