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
    <Card className="shadow-sm border-l-4" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', borderLeftColor: 'var(--accent-primary)' }}>
      <CardHeader style={{ backgroundColor: 'var(--background-secondary)' }}>
        <CardTitle className="text-xl flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
          Letterhead Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="userCompanyName" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              User/Company Name <span style={{ color: 'var(--error)' }}>*</span>
            </Label>
            <Input
              id="userCompanyName"
              placeholder="Your Company Name"
              value={data.userCompanyName || ''}
              onChange={(e) => handleChange('userCompanyName', e.target.value)}
              className="transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--background-secondary)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-primary)' 
              }}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Email <span style={{ color: 'var(--error)' }}>*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="company@example.com"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--background-secondary)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-primary)' 
              }}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Address
          </Label>
          <Input
            id="address"
            placeholder="123 Main St, City, State"
            value={data.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="transition-all duration-200"
            style={{ 
              backgroundColor: 'var(--background-secondary)', 
              borderColor: 'var(--border)', 
              color: 'var(--text-primary)' 
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Website
          </Label>
          <Input
            id="website"
            placeholder="https://company.com"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="transition-all duration-200"
            style={{ 
              backgroundColor: 'var(--background-secondary)', 
              borderColor: 'var(--border)', 
              color: 'var(--text-primary)' 
            }}
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