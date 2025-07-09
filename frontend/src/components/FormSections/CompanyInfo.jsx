import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import LogoUpload from '../LogoUpload';

const CompanyInfo = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange('companyInfo', { ...data, [field]: value });
  };

  return (
    <Card className="shadow-sm border-l-4 border-l-blue-500">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
              Company Name
            </Label>
            <Input
              id="companyName"
              placeholder="Your Company Name"
              value={data.companyName || ''}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyEmail" className="text-sm font-medium text-gray-700">
              Company Email
            </Label>
            <Input
              id="companyEmail"
              type="email"
              placeholder="company@example.com"
              value={data.companyEmail || ''}
              onChange={(e) => handleChange('companyEmail', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyAddress" className="text-sm font-medium text-gray-700">
            Company Address
          </Label>
          <Input
            id="companyAddress"
            placeholder="123 Main St, City, State"
            value={data.companyAddress || ''}
            onChange={(e) => handleChange('companyAddress', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyWebsite" className="text-sm font-medium text-gray-700">
            Company Website
          </Label>
          <Input
            id="companyWebsite"
            placeholder="https://company.com"
            value={data.companyWebsite || ''}
            onChange={(e) => handleChange('companyWebsite', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <LogoUpload
          label="Company Logo"
          value={data.companyLogo}
          onChange={(value) => handleChange('companyLogo', value)}
        />
      </CardContent>
    </Card>
  );
};

export default CompanyInfo;