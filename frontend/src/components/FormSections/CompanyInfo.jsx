import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import LogoUpload from '../LogoUpload';

const LetterheadInfo = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange('letterheadInfo', { ...data, [field]: value });
  };

  return (
    <Card className="shadow-sm border-l-4 border-l-blue-500">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Letterhead Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="userCompanyName" className="text-sm font-medium text-gray-700">
              User/Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="userCompanyName"
              placeholder="Your Company Name"
              value={data.userCompanyName || ''}
              onChange={(e) => handleChange('userCompanyName', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="company@example.com"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Address
          </Label>
          <Input
            id="address"
            placeholder="123 Main St, City, State"
            value={data.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
            Website
          </Label>
          <Input
            id="website"
            placeholder="https://company.com"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <LogoUpload
          label="Logo"
          value={data.logo}
          onChange={(value) => handleChange('logo', value)}
        />
      </CardContent>
    </Card>
  );
};

export default LetterheadInfo;