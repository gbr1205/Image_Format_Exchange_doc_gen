import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import LogoUpload from '../LogoUpload';
import { dropdownOptions } from '../../services/mockData';

const ProjectInfo = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange('projectInfo', { ...data, [field]: value });
  };

  const requiredFields = ['documentVersion', 'projectTitle', 'projectCodeName', 'projectFormat', 'client', 'director', 'dop', 'productionCompany', 'postProductionSupervisor', 'vfxSupervisor', 'vfxOnSetSupervisor', 'vfxVendor', 'vendorCodeName', 'projectFrameRate', 'colorScience'];

  const isRequired = (field) => requiredFields.includes(field);

  return (
    <Card className="shadow-sm border-l-4 border-l-green-500">
      <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Project Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Document Version <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="v1.0"
              value={data.documentVersion || ''}
              onChange={(e) => handleChange('documentVersion', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Project Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={data.projectDate || ''}
              onChange={(e) => handleChange('projectDate', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Project Title <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Project Title"
              value={data.projectTitle || ''}
              onChange={(e) => handleChange('projectTitle', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Project Code Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Project Code"
              value={data.projectCodeName || ''}
              onChange={(e) => handleChange('projectCodeName', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Project Format <span className="text-red-500">*</span>
            </Label>
            <Select value={data.projectFormat || ''} onValueChange={(value) => handleChange('projectFormat', value)}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.projectFormat.map(format => (
                  <SelectItem key={format} value={format}>{format}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Client <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Client Name"
              value={data.client || ''}
              onChange={(e) => handleChange('client', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <LogoUpload
          label="Client Logo"
          value={data.clientLogo}
          onChange={(value) => handleChange('clientLogo', value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Director <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Director Name"
              value={data.director || ''}
              onChange={(e) => handleChange('director', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              DOP <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Director of Photography"
              value={data.dop || ''}
              onChange={(e) => handleChange('dop', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Production Company <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Production Company"
            value={data.productionCompany || ''}
            onChange={(e) => handleChange('productionCompany', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <LogoUpload
          label="Production Company Logo"
          value={data.productionCompanyLogo}
          onChange={(value) => handleChange('productionCompanyLogo', value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Post-Production Supervisor <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Post-Production Supervisor"
              value={data.postProductionSupervisor || ''}
              onChange={(e) => handleChange('postProductionSupervisor', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Lab
            </Label>
            <Input
              placeholder="Lab Name"
              value={data.lab || ''}
              onChange={(e) => handleChange('lab', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LogoUpload
            label="Lab Logo"
            value={data.labLogo}
            onChange={(value) => handleChange('labLogo', value)}
          />
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Colorist
            </Label>
            <Input
              placeholder="Colorist Name"
              value={data.colorist || ''}
              onChange={(e) => handleChange('colorist', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              VFX Supervisor <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VFX Supervisor"
              value={data.vfxSupervisor || ''}
              onChange={(e) => handleChange('vfxSupervisor', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              VFX On-Set Supervisor <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VFX On-Set Supervisor"
              value={data.vfxOnSetSupervisor || ''}
              onChange={(e) => handleChange('vfxOnSetSupervisor', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              VFX Vendor <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VFX Vendor"
              value={data.vfxVendor || ''}
              onChange={(e) => handleChange('vfxVendor', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Vendor Code Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Vendor Code"
              value={data.vendorCodeName || ''}
              onChange={(e) => handleChange('vendorCodeName', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <LogoUpload
          label="VFX Vendor Logo"
          value={data.vfxVendorLogo}
          onChange={(value) => handleChange('vfxVendorLogo', value)}
        />

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            VFX Documents Link
          </Label>
          <Textarea
            placeholder="https://documents.link"
            value={data.vfxDocumentsLink || ''}
            onChange={(e) => handleChange('vfxDocumentsLink', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[60px]"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Project Frame Rate <span className="text-red-500">*</span>
            </Label>
            <Select value={data.projectFrameRate || ''} onValueChange={(value) => handleChange('projectFrameRate', value)}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <SelectValue placeholder="23.976fps" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.frameRate.map(rate => (
                  <SelectItem key={rate} value={rate}>{rate}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Color Science <span className="text-red-500">*</span>
            </Label>
            <Select value={data.colorScience || ''} onValueChange={(value) => handleChange('colorScience', value)}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <SelectValue placeholder="ACES 1.3" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.colorScience.map(science => (
                  <SelectItem key={science} value={science}>{science}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {data.colorScience === 'Custom' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Custom Color Science
            </Label>
            <Input
              placeholder="Enter custom color science"
              value={data.customColorScience || ''}
              onChange={(e) => handleChange('customColorScience', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Additional Notes
          </Label>
          <Textarea
            placeholder="Additional project notes"
            value={data.additionalNotes || ''}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;