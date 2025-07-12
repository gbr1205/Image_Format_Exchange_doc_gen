import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Building2, 
  Film, 
  Camera, 
  Layers, 
  Monitor, 
  FileText, 
  Plus, 
  Trash2,
  FileVideo,
  Users,
  Package,
  AlertTriangle,
  Settings,
  Clapperboard
} from 'lucide-react';
import LogoUpload from './LogoUpload';
import { dropdownOptions } from '../services/mockData';
import { generateFilename } from '../services/api';

const ConsolidatedForm = ({ formData, onFormChange }) => {
  const [cameraFormats, setCameraFormats] = useState(formData.cameraFormats || [
    { 
      id: 1, 
      cameraId: 'Camera A', 
      sourceCamera: 'Arri Alexa 35', 
      codec: 'Arri Raw (HDE)', 
      sensorMode: 'Open Gate (4608 x 3164)', 
      lensSqueezeeFactor: '1:1', 
      colorSpace: 'ARRI - LogC4/AWG4' 
    }
  ]);

  const handleSectionChange = (section, field, value) => {
    onFormChange({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const handleCameraChange = (cameraId, field, value) => {
    const updatedCameras = cameraFormats.map(camera => 
      camera.id === cameraId ? { ...camera, [field]: value } : camera
    );
    setCameraFormats(updatedCameras);
    onFormChange({
      ...formData,
      cameraFormats: updatedCameras
    });
  };

  const handleAddCamera = () => {
    const newCamera = {
      id: Math.max(...cameraFormats.map(c => c.id), 0) + 1,
      cameraId: `Camera ${String.fromCharCode(65 + cameraFormats.length)}`,
      sourceCamera: '',
      codec: '',
      sensorMode: '',
      lensSqueezeeFactor: '',
      colorSpace: ''
    };
    const updatedCameras = [...cameraFormats, newCamera];
    setCameraFormats(updatedCameras);
    onFormChange({
      ...formData,
      cameraFormats: updatedCameras
    });
  };

  const handleRemoveCamera = (cameraId) => {
    const updatedCameras = cameraFormats.filter(camera => camera.id !== cameraId);
    setCameraFormats(updatedCameras);
    onFormChange({
      ...formData,
      cameraFormats: updatedCameras
    });
  };

  // Generate filenames for preview
  const vfxPullsFilename = generateFilename('vfxPulls', formData.vfxPulls || {});
  const vfxDeliveriesFilename = generateFilename('vfxDeliveries', {
    ...formData.vfxDeliveries,
    ...formData.vfxPulls
  });

  // Generate review format summary
  const generateReviewSummary = () => {
    const data = formData.mediaReview || {};
    const parts = [];
    if (data.container) parts.push(data.container.toUpperCase());
    if (data.videoCodec) parts.push(data.videoCodec);
    if (data.resolution) parts.push(data.resolution);
    if (data.aspectRatio) parts.push(`aspect ratio ${data.aspectRatio}`);
    if (data.letterboxing) parts.push(`widescreen content of ${data.letterboxing}`);
    if (data.frameRate) parts.push(`at ${data.frameRate} fps`);
    
    return parts.length > 0 ? parts.join(', ') + '.' : 'Configure settings above to see summary.';
  };

  return (
    <div className="space-y-8">
      {/* Letterhead Information Section */}
      <Card className="shadow-sm border-l-4 section-letterhead" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
        <CardHeader style={{ backgroundColor: 'var(--background-secondary)' }}>
          <CardTitle className="text-xl flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Building2 className="h-5 w-5" />
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
                value={formData.letterheadInfo?.userCompanyName || ''}
                onChange={(e) => handleSectionChange('letterheadInfo', 'userCompanyName', e.target.value)}
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
                value={formData.letterheadInfo?.email || ''}
                onChange={(e) => handleSectionChange('letterheadInfo', 'email', e.target.value)}
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
              value={formData.letterheadInfo?.address || ''}
              onChange={(e) => handleSectionChange('letterheadInfo', 'address', e.target.value)}
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
              value={formData.letterheadInfo?.website || ''}
              onChange={(e) => handleSectionChange('letterheadInfo', 'website', e.target.value)}
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
            value={formData.letterheadInfo?.logo}
            onChange={(value) => handleSectionChange('letterheadInfo', 'logo', value)}
          />
        </CardContent>
      </Card>

      {/* Project Information Section */}
      <Card className="shadow-sm border-l-4 section-project" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
        <CardHeader style={{ backgroundColor: 'var(--background-secondary)' }}>
          <CardTitle className="text-xl flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Film className="h-5 w-5" />
            Project Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Document Version <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="v1.0"
                value={formData.projectInfo?.documentVersion || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'documentVersion', e.target.value)}
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
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Project Date <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                type="date"
                value={formData.projectInfo?.projectDate || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'projectDate', e.target.value)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Project Title <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="Project Title"
                value={formData.projectInfo?.projectTitle || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'projectTitle', e.target.value)}
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
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Project Code Name <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="Project Code"
                value={formData.projectInfo?.projectCodeName || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'projectCodeName', e.target.value)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Project Format <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Select value={formData.projectInfo?.projectFormat || ''} onValueChange={(value) => handleSectionChange('projectInfo', 'projectFormat', value)}>
                <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
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
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Client <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="Client Name"
                value={formData.projectInfo?.client || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'client', e.target.value)}
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

          <LogoUpload
            label="Client Logo"
            value={formData.projectInfo?.clientLogo}
            onChange={(value) => handleSectionChange('projectInfo', 'clientLogo', value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Director <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="Director Name"
                value={formData.projectInfo?.director || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'director', e.target.value)}
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
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                DOP <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="Director of Photography"
                value={formData.projectInfo?.dop || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'dop', e.target.value)}
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
            <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Production Company <span style={{ color: 'var(--error)' }}>*</span>
            </Label>
            <Input
              placeholder="Production Company"
              value={formData.projectInfo?.productionCompany || ''}
              onChange={(e) => handleSectionChange('projectInfo', 'productionCompany', e.target.value)}
              className="transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--background-secondary)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-primary)' 
              }}
              required
            />
          </div>

          <LogoUpload
            label="Production Company Logo"
            value={formData.projectInfo?.productionCompanyLogo}
            onChange={(value) => handleSectionChange('projectInfo', 'productionCompanyLogo', value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Post-Production Supervisor <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="Post-Production Supervisor"
                value={formData.projectInfo?.postProductionSupervisor || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'postProductionSupervisor', e.target.value)}
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
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Lab
              </Label>
              <Input
                placeholder="Lab Name"
                value={formData.projectInfo?.lab || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'lab', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LogoUpload
              label="Lab Logo"
              value={formData.projectInfo?.labLogo}
              onChange={(value) => handleSectionChange('projectInfo', 'labLogo', value)}
            />
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Colorist
              </Label>
              <Input
                placeholder="Colorist Name"
                value={formData.projectInfo?.colorist || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'colorist', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                VFX Supervisor <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="VFX Supervisor"
                value={formData.projectInfo?.vfxSupervisor || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'vfxSupervisor', e.target.value)}
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
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                VFX On-Set Supervisor <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="VFX On-Set Supervisor"
                value={formData.projectInfo?.vfxOnSetSupervisor || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'vfxOnSetSupervisor', e.target.value)}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                VFX Vendor <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="VFX Vendor"
                value={formData.projectInfo?.vfxVendor || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'vfxVendor', e.target.value)}
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
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Vendor Code Name <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="Vendor Code"
                value={formData.projectInfo?.vendorCodeName || ''}
                onChange={(e) => handleSectionChange('projectInfo', 'vendorCodeName', e.target.value)}
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

          <LogoUpload
            label="VFX Vendor Logo"
            value={formData.projectInfo?.vfxVendorLogo}
            onChange={(value) => handleSectionChange('projectInfo', 'vfxVendorLogo', value)}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              VFX Documents Link
            </Label>
            <Textarea
              placeholder="https://documents.link"
              value={formData.projectInfo?.vfxDocumentsLink || ''}
              onChange={(e) => handleSectionChange('projectInfo', 'vfxDocumentsLink', e.target.value)}
              className="transition-all duration-200 min-h-[60px]"
              style={{ 
                backgroundColor: 'var(--background-secondary)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-primary)' 
              }}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Project Frame Rate <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Select value={formData.projectInfo?.projectFrameRate || ''} onValueChange={(value) => handleSectionChange('projectInfo', 'projectFrameRate', value)}>
                <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
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
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Color Science <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Select value={formData.projectInfo?.colorScience || ''} onValueChange={(value) => handleSectionChange('projectInfo', 'colorScience', value)}>
                <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <SelectValue placeholder="ACEScg" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions.colorSpace.map(science => (
                    <SelectItem key={science} value={science}>{science}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Formats Section */}
      <Card className="shadow-sm border-l-4 section-camera" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
        <CardHeader style={{ backgroundColor: 'var(--background-secondary)' }}>
          <CardTitle className="text-xl flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Camera className="h-5 w-5" />
            Camera Formats
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {cameraFormats.map((camera, index) => (
            <Card key={camera.id} className="border-2 border-dashed" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--border)' }}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Camera className="h-4 w-4" />
                    {camera.cameraId}
                  </CardTitle>
                  {cameraFormats.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCamera(camera.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Camera ID <span style={{ color: 'var(--error)' }}>*</span>
                  </Label>
                  <Input
                    placeholder="Camera A"
                    value={camera.cameraId}
                    onChange={(e) => handleCameraChange(camera.id, 'cameraId', e.target.value)}
                    className="transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--background-secondary)', 
                      borderColor: 'var(--border)', 
                      color: 'var(--text-primary)' 
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Source Camera <span style={{ color: 'var(--error)' }}>*</span>
                    </Label>
                    <Select 
                      value={camera.sourceCamera} 
                      onValueChange={(value) => handleCameraChange(camera.id, 'sourceCamera', value)}
                    >
                      <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.sourceCamera.map(cam => (
                          <SelectItem key={cam} value={cam}>{cam}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Codec <span style={{ color: 'var(--error)' }}>*</span>
                    </Label>
                    <Select 
                      value={camera.codec} 
                      onValueChange={(value) => handleCameraChange(camera.id, 'codec', value)}
                    >
                      <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        <SelectValue placeholder="Select codec" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.codec.map(codec => (
                          <SelectItem key={codec} value={codec}>{codec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Sensor Mode <span style={{ color: 'var(--error)' }}>*</span>
                    </Label>
                    <Select 
                      value={camera.sensorMode} 
                      onValueChange={(value) => handleCameraChange(camera.id, 'sensorMode', value)}
                    >
                      <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        <SelectValue placeholder="Select sensor mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.sensorMode.map(mode => (
                          <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Lens Squeeze Factor <span style={{ color: 'var(--error)' }}>*</span>
                    </Label>
                    <Input
                      placeholder="1:1"
                      value={camera.lensSqueezeeFactor}
                      onChange={(e) => handleCameraChange(camera.id, 'lensSqueezeeFactor', e.target.value)}
                      className="transition-all duration-200"
                      style={{ 
                        backgroundColor: 'var(--background-secondary)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text-primary)' 
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Color Space <span style={{ color: 'var(--error)' }}>*</span>
                  </Label>
                  <Select 
                    value={camera.colorSpace} 
                    onValueChange={(value) => handleCameraChange(camera.id, 'colorSpace', value)}
                  >
                    <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                      <SelectValue placeholder="Select color space" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.cameraColorSpace.map(space => (
                        <SelectItem key={space} value={space}>{space}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button
            onClick={handleAddCamera}
            variant="outline"
            className="w-full border-2 border-dashed hover:opacity-80"
            style={{ 
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border)'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Camera Format
          </Button>
        </CardContent>
      </Card>

      {/* VFX Pulls Section */}
      <Card className="shadow-sm border-l-4 section-vfx" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
        <CardHeader style={{ backgroundColor: 'var(--background-secondary)' }}>
          <CardTitle className="text-xl flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Layers className="h-5 w-5" />
            VFX Pulls
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Technical Specifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5" style={{ color: 'var(--warning)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Technical Specifications</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  File Format <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Select value={formData.vfxPulls?.fileFormat || ''} onValueChange={(value) => handleSectionChange('vfxPulls', 'fileFormat', value)}>
                  <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <SelectValue placeholder="OpenEXR (.exr)" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.vfxFileFormat.map(format => (
                      <SelectItem key={format} value={format}>{format}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Compression <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Select value={formData.vfxPulls?.compression || ''} onValueChange={(value) => handleSectionChange('vfxPulls', 'compression', value)}>
                  <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <SelectValue placeholder="ZIP1" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.compression.map(comp => (
                      <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Resolution <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Select value={formData.vfxPulls?.resolution || ''} onValueChange={(value) => handleSectionChange('vfxPulls', 'resolution', value)}>
                  <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <SelectValue placeholder="4096 x 2160 (4K)" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.resolution.map(res => (
                      <SelectItem key={res} value={res}>{res}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Color Space <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Select value={formData.vfxPulls?.colorSpace || ''} onValueChange={(value) => handleSectionChange('vfxPulls', 'colorSpace', value)}>
                  <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <SelectValue placeholder="ACEScg" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.vfxColorSpace.map(space => (
                      <SelectItem key={space} value={space}>{space}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Bit Depth <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Select value={formData.vfxPulls?.bitDepth || ''} onValueChange={(value) => handleSectionChange('vfxPulls', 'bitDepth', value)}>
                  <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <SelectValue placeholder="16-bit half float" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.bitDepth.map(depth => (
                      <SelectItem key={depth} value={depth}>{depth}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Frame Handles <span style={{ color: 'var(--error)' }}>*</span> (2x value, head + tail)
                </Label>
                <Input
                  type="number"
                  placeholder="8"
                  value={formData.vfxPulls?.frameHandles || ''}
                  onChange={(e) => handleSectionChange('vfxPulls', 'frameHandles', parseInt(e.target.value))}
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Frame Padding <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Select value={formData.vfxPulls?.framePadding || ''} onValueChange={(value) => handleSectionChange('vfxPulls', 'framePadding', value)}>
                  <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <SelectValue placeholder="####" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.framePadding.map(padding => (
                      <SelectItem key={padding} value={padding}>{padding}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                VFX LUTs Link
              </Label>
              <Textarea
                placeholder="https://luts.link"
                value={formData.vfxPulls?.vfxLutsLink || ''}
                onChange={(e) => handleSectionChange('vfxPulls', 'vfxLutsLink', e.target.value)}
                className="transition-all duration-200 min-h-[60px]"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
                rows={2}
              />
            </div>
          </div>

          {/* VFX Pulls Naming */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" style={{ color: 'var(--warning)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>VFX Pulls Naming</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Show ID <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Input
                  placeholder="AAA"
                  value={formData.vfxPulls?.showId || ''}
                  onChange={(e) => handleSectionChange('vfxPulls', 'showId', e.target.value)}
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Episode <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Input
                  placeholder="101"
                  value={formData.vfxPulls?.episode || ''}
                  onChange={(e) => handleSectionChange('vfxPulls', 'episode', e.target.value)}
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Sequence
                </Label>
                <Input
                  placeholder="001"
                  value={formData.vfxPulls?.sequence || ''}
                  onChange={(e) => handleSectionChange('vfxPulls', 'sequence', e.target.value)}
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Scene
                </Label>
                <Input
                  placeholder="001"
                  value={formData.vfxPulls?.scene || ''}
                  onChange={(e) => handleSectionChange('vfxPulls', 'scene', e.target.value)}
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Shot ID <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Input
                  placeholder="0010"
                  value={formData.vfxPulls?.shotId || ''}
                  onChange={(e) => handleSectionChange('vfxPulls', 'shotId', e.target.value)}
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Plate <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Select value={formData.vfxPulls?.plate || ''} onValueChange={(value) => handleSectionChange('vfxPulls', 'plate', value)}>
                  <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                    <SelectValue placeholder="PL" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.plate.map(plate => (
                      <SelectItem key={plate} value={plate}>{plate}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Identifier <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Input
                  placeholder="01"
                  value={formData.vfxPulls?.identifier || ''}
                  onChange={(e) => handleSectionChange('vfxPulls', 'identifier', e.target.value)}
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Version <span style={{ color: 'var(--error)' }}>*</span>
                </Label>
                <Input
                  placeholder="v001"
                  value={formData.vfxPulls?.version || ''}
                  onChange={(e) => handleSectionChange('vfxPulls', 'version', e.target.value)}
                  className="transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--background-secondary)', 
                    borderColor: 'var(--border)', 
                    color: 'var(--text-primary)' 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Generated Filename Preview */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Generated Filename Preview</span>
            </div>
            <div className="font-mono text-sm p-2 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              {vfxPullsFilename}
            </div>
          </div>

          {/* Layer Definitions */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--info)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Layer Definitions</h4>
            <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <p>"PL (plate)", "CP (clean plate)", "EL (element)", "RF (reference)", "GS (green screen)", "CC (color chart)", "LG (lens grid)"</p>
            </div>
          </div>

          {/* VFX Work Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clapperboard className="h-5 w-5" style={{ color: 'var(--warning)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>VFX Work</h3>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-center h-32 rounded border-2 border-dashed mb-4" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>The Foundry's Nuke 16.0v2 colorspace settings example</p>
              </div>
              
              <div className="text-sm space-y-3" style={{ color: 'var(--text-secondary)' }}>
                <p className="font-medium">Outputs for WIPs, Review, and Deliveries should bypass and preserve VFX Pull's tech-specs and folder structure, Ex:</p>
                
                <div className="p-3 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
                  <p className="font-mono text-xs mb-2">
                    "Pull Shot" {formData.vfxPulls?.showId || 'AAA'}_{formData.vfxPulls?.episode || '101'}_{formData.vfxPulls?.sequence || '001'}_{formData.vfxPulls?.scene || '001'}_{formData.vfxPulls?.shotId || '0010'}_{formData.vfxPulls?.plate || 'PL'}{formData.vfxPulls?.identifier || '01'}_{formData.vfxPulls?.version || 'v001'} folder &gt; {formData.vfxPulls?.resolution?.split(' ')[0] || '4608x3164'} folder &gt;  OpenEXR sequenced files, 1001-1101 frame-range, compression {formData.vfxPulls?.compression || 'ZIP1'}, Bit Depth{formData.vfxPulls?.bitDepth || '16-bit half float'}, colorspace {formData.vfxPulls?.colorSpace || 'ACES2065-1 (Ap0)'}.
                  </p>
                </div>
                
                <div className="p-3 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
                  <p className="font-mono text-xs">
                    "VFX Shot" {formData.vfxPulls?.showId || 'AAA'}_{formData.vfxPulls?.episode || '101'}_{formData.vfxPulls?.sequence || '001'}_{formData.vfxPulls?.scene || '001'}_{formData.vfxPulls?.shotId || '0010'}_comp_VEND_{formData.vfxPulls?.version || 'v001'} folder &gt; {formData.vfxPulls?.resolution?.split(' ')[0] || '4608x3164'} folder &gt;  OpenEXR sequenced files, 1001-1101 frame-range, compression {formData.vfxPulls?.compression || 'ZIP1'}, Bit Depth{formData.vfxPulls?.bitDepth || '16-bit half float'}, colorspace {formData.vfxPulls?.colorSpace || 'ACES2065-1 (Ap0)'}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Review Section */}
      <Card className="shadow-sm border-l-4 section-media" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
        <CardHeader style={{ backgroundColor: 'var(--background-secondary)' }}>
          <CardTitle className="text-xl flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Monitor className="h-5 w-5" />
            Media Review
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Container <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Select value={formData.mediaReview?.container || ''} onValueChange={(value) => handleSectionChange('mediaReview', 'container', value)}>
                <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <SelectValue placeholder="mov" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions.container.map(container => (
                    <SelectItem key={container} value={container}>{container}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Video Codec <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Select value={formData.mediaReview?.videoCodec || ''} onValueChange={(value) => handleSectionChange('mediaReview', 'videoCodec', value)}>
                <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <SelectValue placeholder="ProRes 422 HQ" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions.videoCodec.map(codec => (
                    <SelectItem key={codec} value={codec}>{codec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Resolution <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="1920x1080"
                value={formData.mediaReview?.resolution || ''}
                onChange={(e) => handleSectionChange('mediaReview', 'resolution', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Aspect Ratio <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="2.20:1"
                value={formData.mediaReview?.aspectRatio || ''}
                onChange={(e) => handleSectionChange('mediaReview', 'aspectRatio', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Letterboxing <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="1920x872"
                value={formData.mediaReview?.letterboxing || ''}
                onChange={(e) => handleSectionChange('mediaReview', 'letterboxing', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Frame Rate <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="23.976"
                value={formData.mediaReview?.frameRate || ''}
                onChange={(e) => handleSectionChange('mediaReview', 'frameRate', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Color Space <span style={{ color: 'var(--error)' }}>*</span>
            </Label>
            <Input
              placeholder="Rec709, CDL and Show LUT Baked in"
              value={formData.mediaReview?.colorSpace || ''}
              onChange={(e) => handleSectionChange('mediaReview', 'colorSpace', e.target.value)}
              className="transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--background-secondary)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-primary)' 
              }}
            />
          </div>

          {/* Review Format Summary */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--accent-secondary)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Review Format Summary</h3>
            </div>
            <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p className="leading-relaxed">{generateReviewSummary()}</p>
              <p className="font-medium">Color Workflow: CDL applied before Show LUT baked in Rec709</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Slate & Overlays Link
            </Label>
            <Textarea
              placeholder="https://slate.link"
              value={formData.mediaReview?.slateOverlaysLink || ''}
              onChange={(e) => handleSectionChange('mediaReview', 'slateOverlaysLink', e.target.value)}
              className="transition-all duration-200 min-h-[60px]"
              style={{ 
                backgroundColor: 'var(--background-secondary)', 
                borderColor: 'var(--border)', 
                color: 'var(--text-primary)' 
              }}
              rows={2}
            />
          </div>

          {/* Slate Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileVideo className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>SLATE</h3>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-center h-32 rounded border-2 border-dashed mb-4" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Slate Example Image</p>
              </div>
              
              <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <p>• All submissions should have a slate frame included in the same resolution and format as the media.</p>
                <p>• Slates should be on the first frame of the media and be 1 frame in duration.</p>
                <p>• Slates should include a thumbnail frame.</p>
                <p>• All fields and features should be inside of the final picture area.</p>
                <p>• A guide should be shown to indicate the final picture area on the slate frame.</p>
              </div>
            </div>
          </div>

          {/* Overlays Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5" style={{ color: 'var(--accent-secondary)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>OVERLAYS</h3>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-center h-32 rounded border-2 border-dashed mb-4" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Overlays Example Image</p>
              </div>
              
              <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <p>• Overlays (aka burn-ins or chyrons) should be included on all non-final media, unless otherwise specified by Editorial or Production.</p>
                <p>• Overlays should not be 100% white.</p>
                <p>• Overlays should be inside of any letterboxing.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VFX Deliveries Section */}
      <Card className="shadow-sm border-l-4 section-delivery" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
        <CardHeader style={{ backgroundColor: 'var(--background-secondary)' }}>
          <CardTitle className="text-xl flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FileText className="h-5 w-5" />
            VFX Deliveries Naming
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          {/* Important Notice */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--error)' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5" style={{ color: 'var(--error)' }} />
              <span className="font-bold" style={{ color: 'var(--error)' }}>IMPORTANT</span>
            </div>
            <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p>Vendor deliverables retain all technical specifications from the original VFX Pull provided by Media Production Suite (MPS) or Lab. Any fixed numerical values that remap the image's output such as CDL and LUT files and viewer inputs are for viewing purposes ONLY.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Show ID <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="AAA"
                value={formData.vfxDeliveries?.showId || ''}
                onChange={(e) => handleSectionChange('vfxDeliveries', 'showId', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Episode <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="101"
                value={formData.vfxDeliveries?.episode || ''}
                onChange={(e) => handleSectionChange('vfxDeliveries', 'episode', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Sequence
              </Label>
              <Input
                placeholder="001"
                value={formData.vfxDeliveries?.sequence || ''}
                onChange={(e) => handleSectionChange('vfxDeliveries', 'sequence', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Scene
              </Label>
              <Input
                placeholder="001"
                value={formData.vfxDeliveries?.scene || ''}
                onChange={(e) => handleSectionChange('vfxDeliveries', 'scene', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Shot ID <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="0010"
                value={formData.vfxDeliveries?.shotId || ''}
                onChange={(e) => handleSectionChange('vfxDeliveries', 'shotId', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Task <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Select value={formData.vfxDeliveries?.task || ''} onValueChange={(value) => handleSectionChange('vfxDeliveries', 'task', value)}>
                <SelectTrigger className="transition-all duration-200" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  <SelectValue placeholder="comp" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions.tasks.map(task => (
                    <SelectItem key={task} value={task}>{task}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Vendor Code Name <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="VEND"
                value={formData.vfxDeliveries?.vendorCodeName || ''}
                onChange={(e) => handleSectionChange('vfxDeliveries', 'vendorCodeName', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Version <span style={{ color: 'var(--error)' }}>*</span>
              </Label>
              <Input
                placeholder="v001"
                value={formData.vfxDeliveries?.version || ''}
                onChange={(e) => handleSectionChange('vfxDeliveries', 'version', e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>
          </div>

          {/* Generated Filename Preview */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--info)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5" style={{ color: 'var(--info)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Delivery Filename Preview</h3>
            </div>
            <div className="font-mono text-sm p-3 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              {vfxDeliveriesFilename}
            </div>
            <div className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <span className="font-medium">Show:</span> {formData.vfxDeliveries?.showId || 'AAA'}
                </div>
                <div>
                  <span className="font-medium">Episode:</span> {formData.vfxDeliveries?.episode || '101'}
                </div>
                <div>
                  <span className="font-medium">Shot:</span> {formData.vfxDeliveries?.shotId || '0010'}
                </div>
                <div>
                  <span className="font-medium">Task:</span> {formData.vfxDeliveries?.task || 'comp'}
                </div>
              </div>
            </div>
          </div>

          {/* Task Definitions */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--info)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Task Definitions</h4>
            <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <p>"comp, precomp, anim (playblast), mm (matchmove), matte (add ID), dmatte (grade matte, add ID), and mp (mattepainting add ID)"</p>
            </div>
          </div>

          {/* Technical Specifications Inherited */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5" style={{ color: 'var(--info)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Technical Specifications (Inherited from VFX Pulls)</h3>
            </div>
            
            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--border)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Resolution:</span>
                  <div style={{ color: 'var(--text-primary)' }}>{formData.vfxPulls?.resolution || 'Not specified'}</div>
                </div>
                <div>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Format:</span>
                  <div style={{ color: 'var(--text-primary)' }}>{formData.vfxPulls?.fileFormat || 'Not specified'}</div>
                </div>
                <div>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Colorspace:</span>
                  <div style={{ color: 'var(--text-primary)' }}>{formData.vfxPulls?.colorSpace || 'Not specified'}</div>
                </div>
                <div>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Bit Depth:</span>
                  <div style={{ color: 'var(--text-primary)' }}>{formData.vfxPulls?.bitDepth || 'Not specified'}</div>
                </div>
                <div>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Frame Padding:</span>
                  <div style={{ color: 'var(--text-primary)' }}>{formData.vfxPulls?.framePadding || 'Not specified'}</div>
                </div>
                <div>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Compression:</span>
                  <div style={{ color: 'var(--text-primary)' }}>{formData.vfxPulls?.compression || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Guidelines */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Delivery Guidelines</span>
            </div>
            <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p>• All deliveries must follow the standardized naming convention</p>
              <p>• Vendor Code Name should match the registered vendor identifier</p>
              <p>• Version numbers should increment for each delivery iteration</p>
              <p>• Task field should specify the type of work delivered (comp, roto, paint, etc.)</p>
            </div>
          </div>

          {/* Additional Technical Notes */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-main)', borderColor: 'var(--warning)' }}>
            <div className="text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p className="font-medium">Additional Technical Requirements:</p>
              <p>• Grain RGB HSVL and Signal to Noise Ratio (SNR)</p>
              <p>• Metadata (including timecode)</p>
              <p>• Sequence Length</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsolidatedForm;