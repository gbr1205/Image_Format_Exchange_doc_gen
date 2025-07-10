import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Layers, FileText, Clapperboard } from 'lucide-react';
import { dropdownOptions } from '../../services/mockData';
import { generateFilename } from '../../services/api';

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
              <Label className="text-sm font-medium text-gray-700">
                Resolution <span className="text-red-500">*</span>
              </Label>
              <Select value={data.resolution || ''} onValueChange={(value) => handleChange('resolution', value)}>
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
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
                Frame Handles <span className="text-red-500">*</span> (2x value, head + tail)
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
            <Textarea
              placeholder="https://luts.link"
              value={data.vfxLutsLink || ''}
              onChange={(e) => handleChange('vfxLutsLink', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[60px]"
              rows={2}
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

        {/* Layer Definitions */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Layer Definitions</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>"PL (plate)", "CP (clean plate)", "EL (element)", "RF (reference)", "GS (green screen)", "CC (color chart)", "LG (lens grid)"</p>
          </div>
        </div>

        {/* VFX Work Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Clapperboard className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-gray-800">VFX Work</h3>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-center h-32 bg-white rounded border-2 border-dashed border-purple-300 mb-4">
              <p className="text-purple-600 text-sm font-medium">The Foundry's Nuke 16.0v2 colorspace settings example</p>
            </div>
            
            <div className="text-sm text-purple-800 space-y-3">
              <p className="font-medium">Outputs for WIPs, Review, and Deliveries should bypass and preserve VFX Pull's tech-specs and folder structure, Ex:</p>
              
              <div className="bg-white p-3 rounded border">
                <p className="font-mono text-xs mb-2">
                  "Pull Shot" {data.showId || 'AAA'}_{data.episode || '101'}_{data.sequence || '001'}_{data.scene || '001'}_{data.shotId || '0010'}_{data.plate || 'PL'}{data.identifier || '01'}_{data.version || 'v001'} folder &gt; {data.resolution?.split(' ')[0] || '4608x3164'} folder &gt;  OpenEXR sequenced files, 1001-1101 frame-range, compression {data.compression || 'ZIP1'}, Bit Depth{data.bitDepth || '16-bit half float'}, colorspace {data.colorSpace || 'ACES2065-1 (Ap0)'}.
                </p>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <p className="font-mono text-xs">
                  "VFX Shot" {data.showId || 'AAA'}_{data.episode || '101'}_{data.sequence || '001'}_{data.scene || '001'}_{data.shotId || '0010'}_comp_VEND_{data.version || 'v001'} folder &gt; {data.resolution?.split(' ')[0] || '4608x3164'} folder &gt;  OpenEXR sequenced files, 1001-1101 frame-range, compression {data.compression || 'ZIP1'}, Bit Depth{data.bitDepth || '16-bit half float'}, colorspace {data.colorSpace || 'ACES2065-1 (Ap0)'}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VFXPulls;