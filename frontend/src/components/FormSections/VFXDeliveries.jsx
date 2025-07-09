import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FileText, Package } from 'lucide-react';
import { generateFilename } from '../../services/mockData';

const VFXDeliveries = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange('vfxDeliveries', { ...data, [field]: value });
  };

  const filename = generateFilename('vfxDeliveries', data);

  return (
    <Card className="shadow-sm border-l-4 border-l-cyan-500">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
          VFX Deliveries Naming
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
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
            <Input
              placeholder="comp"
              value={data.task || ''}
              onChange={(e) => handleChange('task', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
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
      </CardContent>
    </Card>
  );
};

export default VFXDeliveries;