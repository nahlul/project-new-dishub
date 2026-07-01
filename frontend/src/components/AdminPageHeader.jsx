import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminPageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Back Button */}
      <Link to="/admin/dashboard">
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 -ml-2">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Dashboard
        </Button>
      </Link>

      {/* Title Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export default AdminPageHeader;
