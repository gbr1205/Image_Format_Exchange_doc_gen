import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Layers, FileText } from 'lucide-react';
import { dropdownOptions, generateFilename } from '../../services/mockData';

const VFXPulls = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange('vfxPulls', { ...data, [field]: value });
  };

  const requiredFields = ['fileFormat', 'compression', 'resolution', 'colorSpace', 'bitDepth', 'frameHandles', 'framePadding', 'showId', 'episode', 'shotId', 'plate', 'identifier', 'version'];

  const filename = generateFilename('vfxPulls', data);

  return (
    <Card className="shadow-sm border-l-4 border-l-orange-500">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          VFX Pulls
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Technical Specifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-gray-800">Technical Specifications</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                File Format <span className="text-red-500">*</span>
              </Label>
              <Select value={data.fileFormat || ''} onValueChange={(value) => handleChange('fileFormat', value)}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
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
              <Label className="text-sm font-medium text-gray-700">
                Compression <span className="text-red-500">*</span>
              </Label>
              <Select value={data.compression || ''} onValueChange={(value) => handleChange('compression', value)}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <SelectValue placeholder="ZIP" />
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
              <Label className="text-sm font-medium text-gray-700">
                Resolution <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="4096x2160"
                value={data.resolution || ''}
                onChange={(e) => handleChange('resolution', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Color Space <span className="text-red-500">*</span>
              </Label>
              <Select value={data.colorSpace || ''} onValueChange={(value) => handleChange('colorSpace', value)}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
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
              <Label className="text-sm font-medium text-gray-700">
                Bit Depth <span className="text-red-500">*</span>
              </Label>
              <Select value={data.bitDepth || ''} onValueChange={(value) => handleChange('bitDepth', value)}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
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
              <Label className="text-sm font-medium text-gray-700">
                Frame Handles <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                placeholder="8"
                value={data.frameHandles || ''}
                onChange={(e) => handleChange('frameHandles', parseInt(e.target.value))}
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Frame Padding <span className="text-red-500">*</span>
              </Label>
              <Select value={data.framePadding || ''} onValueChange={(value) => handleChange('framePadding', value)}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
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
            <Label className="text-sm font-medium text-gray-700">
              VFX LUTs Link
            </Label>
            <Input
              placeholder="https://luts.link"
              value={data.vfxLutsLink || ''}
              onChange={(e) => handleChange('vfxLutsLink', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* VFX Pulls Naming */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-gray-800">VFX Pulls Naming</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Show ID <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="AAA"
                value={data.showId || ''}
                onChange={(e) => handleChange('showId', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Episode <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="101"
                value={data.episode || ''}
                onChange={(e) => handleChange('episode', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Sequence
              </Label>
              <Input
                placeholder="001"
                value={data.sequence || ''}
                onChange={(e) => handleChange('sequence', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Scene
              </Label>
              <Input
                placeholder="001"
                value={data.scene || ''}
                onChange={(e) => handleChange('scene', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Shot ID <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="0010"
                value={data.shotId || ''}
                onChange={(e) => handleChange('shotId', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Plate <span className="text-red-500">*</span>
              </Label>
              <Select value={data.plate || ''} onValueChange={(value) => handleChange('plate', value)}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <SelectValue placeholder="PL01" />
                </SelectTrigger>
                <SelectContent>
                  {dropdownOptions.plate.map(plate => (
                    <SelectItem key={plate} value={plate}>{plate}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Identifier <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="01"
                value={data.identifier || ''}
                onChange={(e) => handleChange('identifier', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Version <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="v001"
                value={data.version || ''}
                onChange={(e) => handleChange('version', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Generated Filename Preview */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-700">Generated Filename Preview</span>
          </div>
          <div className="font-mono text-sm bg-white p-2 rounded border">
            {filename}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VFXPulls;