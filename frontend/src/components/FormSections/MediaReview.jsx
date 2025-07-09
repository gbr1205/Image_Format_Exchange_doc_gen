import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Monitor } from 'lucide-react';
import { dropdownOptions } from '../../services/mockData';

const MediaReview = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange('mediaReview', { ...data, [field]: value });
  };

  return (
    <Card className="shadow-sm border-l-4 border-l-pink-500">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-transparent">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          Media Review
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Container <span className="text-red-500">*</span>
            </Label>
            <Select value={data.container || ''} onValueChange={(value) => handleChange('container', value)}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
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
            <Label className="text-sm font-medium text-gray-700">
              Video Codec <span className="text-red-500">*</span>
            </Label>
            <Select value={data.videoCodec || ''} onValueChange={(value) => handleChange('videoCodec', value)}>
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
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
            <Label className="text-sm font-medium text-gray-700">
              Resolution <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="1920x1080"
              value={data.resolution || ''}
              onChange={(e) => handleChange('resolution', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Aspect Ratio <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="2.20:1"
              value={data.aspectRatio || ''}
              onChange={(e) => handleChange('aspectRatio', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Letterboxing <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="1920x872"
              value={data.letterboxing || ''}
              onChange={(e) => handleChange('letterboxing', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Frame Rate <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="23.976"
              value={data.frameRate || ''}
              onChange={(e) => handleChange('frameRate', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Color Space <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="Rec709, CDL and Show LUT Baked in"
            value={data.colorSpace || ''}
            onChange={(e) => handleChange('colorSpace', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Slate & Overlays Link
          </Label>
          <Input
            placeholder="https://slate.link"
            value={data.slateOverlaysLink || ''}
            onChange={(e) => handleChange('slateOverlaysLink', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Review Preview */}
        <div className="bg-gradient-to-r from-pink-50 to-transparent p-6 rounded-lg border border-pink-200">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="h-5 w-5 text-pink-600" />
            <h3 className="font-semibold text-gray-800">Review Format Summary</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Container:</span>
              <div className="font-mono text-pink-700">{data.container || 'mov'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Codec:</span>
              <div className="font-mono text-pink-700">{data.videoCodec || 'ProRes 422 HQ'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Resolution:</span>
              <div className="font-mono text-pink-700">{data.resolution || '1920x1080'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-600">Frame Rate:</span>
              <div className="font-mono text-pink-700">{data.frameRate || '23.976'}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaReview;