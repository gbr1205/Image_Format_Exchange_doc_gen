import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, Package, AlertTriangle, Settings } from 'lucide-react';
import { generateFilename } from '../../services/api';
import { dropdownOptions } from '../../services/mockData';

const VFXDeliveries = ({ data, onChange, vfxPullsData }) => {
  const handleChange = (field, value) => {
    onChange('vfxDeliveries', { ...data, [field]: value });
  };

  // Create combined data for filename generation
  const combinedData = { ...data, ...vfxPullsData };
  const filename = generateFilename('vfxDeliveries', combinedData);

  return (
    <Card className="shadow-sm border-l-4 border-l-cyan-500">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
          VFX Deliveries Naming
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        {/* Important Notice */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-bold text-red-800">IMPORTANT</span>
          </div>
          <div className="text-sm text-red-800 space-y-2">
            <p>Vendor deliverables retain all technical specifications from the original VFX Pull provided by Media Production Suite (MPS) or Lab. Any fixed numerical values that remap the image's output such as CDL and LUT files and viewer inputs are for viewing purposes ONLY.</p>
          </div>
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
              className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
              className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
              className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
              className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
              className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Task <span className="text-red-500">*</span>
            </Label>
            <Select value={data.task || ''} onValueChange={(value) => handleChange('task', value)}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
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
            <Label className="text-sm font-medium text-gray-700">
              Vendor Code Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VEND"
              value={data.vendorCodeName || ''}
              onChange={(e) => handleChange('vendorCodeName', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
              className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Generated Filename Preview */}
        <div className="bg-gradient-to-r from-cyan-50 to-transparent p-6 rounded-lg border border-cyan-200">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-cyan-600" />
            <h3 className="font-semibold text-gray-800">Delivery Filename Preview</h3>
          </div>
          <div className="font-mono text-sm bg-white p-3 rounded border border-cyan-200">
            {filename}
          </div>
          <div className="mt-3 text-sm text-gray-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <span className="font-medium">Show:</span> {data.showId || 'AAA'}
              </div>
              <div>
                <span className="font-medium">Episode:</span> {data.episode || '101'}
              </div>
              <div>
                <span className="font-medium">Shot:</span> {data.shotId || '0010'}
              </div>
              <div>
                <span className="font-medium">Task:</span> {data.task || 'comp'}
              </div>
            </div>
          </div>
        </div>

        {/* Task Definitions */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Task Definitions</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>"comp, precomp, anim (playblast), mm (matchmove), matte (add ID), dmatte (grade matte, add ID), and mp (mattepainting add ID)"</p>
          </div>
        </div>

        {/* Technical Specifications Inherited */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5 text-cyan-600" />
            <h3 className="font-semibold text-gray-800">Technical Specifications (Inherited from VFX Pulls)</h3>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Resolution:</span>
                <div className="text-gray-800">{vfxPullsData?.resolution || 'Not specified'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Format:</span>
                <div className="text-gray-800">{vfxPullsData?.fileFormat || 'Not specified'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Colorspace:</span>
                <div className="text-gray-800">{vfxPullsData?.colorSpace || 'Not specified'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Bit Depth:</span>
                <div className="text-gray-800">{vfxPullsData?.bitDepth || 'Not specified'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Frame Padding:</span>
                <div className="text-gray-800">{vfxPullsData?.framePadding || 'Not specified'}</div>
              </div>
              <div>
                <span className="font-medium text-gray-600">Compression:</span>
                <div className="text-gray-800">{vfxPullsData?.compression || 'Not specified'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Guidelines */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-700">Delivery Guidelines</span>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• All deliveries must follow the standardized naming convention</p>
            <p>• Vendor Code Name should match the registered vendor identifier</p>
            <p>• Version numbers should increment for each delivery iteration</p>
            <p>• Task field should specify the type of work delivered (comp, roto, paint, etc.)</p>
          </div>
        </div>

        {/* Additional Technical Notes */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-sm text-yellow-800 space-y-2">
            <p className="font-medium">Additional Technical Requirements:</p>
            <p>• Grain RGB HSVL and Signal to Noise Ratio (SNR)</p>
            <p>• Metadata (including timecode)</p>
            <p>• Sequence Length</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VFXDeliveries;