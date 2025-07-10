import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Monitor, FileVideo, Users } from 'lucide-react';
import { dropdownOptions } from '../../services/mockData';

const MediaReview = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange('mediaReview', { ...data, [field]: value });
  };

  // Generate review format summary
  const generateSummary = () => {
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

        {/* Review Format Summary */}
        <div className="bg-gradient-to-r from-pink-50 to-transparent p-6 rounded-lg border border-pink-200">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="h-5 w-5 text-pink-600" />
            <h3 className="font-semibold text-gray-800">Review Format Summary</h3>
          </div>
          <div className="text-sm text-pink-800 space-y-2">
            <p className="leading-relaxed">{generateSummary()}</p>
            <p className="font-medium">Color Workflow: CDL applied before Show LUT baked in Rec709</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Slate & Overlays Link
          </Label>
          <Textarea
            placeholder="https://slate.link"
            value={data.slateOverlaysLink || ''}
            onChange={(e) => handleChange('slateOverlaysLink', e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 min-h-[60px]"
            rows={2}
          />
        </div>

        {/* Slate Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileVideo className="h-5 w-5 text-pink-600" />
            <h3 className="font-semibold text-gray-800">SLATE</h3>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-center h-32 bg-white rounded border-2 border-dashed border-gray-300 mb-4">
              <p className="text-gray-600 text-sm font-medium">Slate Example Image</p>
            </div>
            
            <div className="text-sm text-gray-700 space-y-2">
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
            <Users className="h-5 w-5 text-pink-600" />
            <h3 className="font-semibold text-gray-800">OVERLAYS</h3>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-center h-32 bg-white rounded border-2 border-dashed border-gray-300 mb-4">
              <p className="text-gray-600 text-sm font-medium">Overlays Example Image</p>
            </div>
            
            <div className="text-sm text-gray-700 space-y-2">
              <p>• Overlays (aka burn-ins or chyrons) should be included on all non-final media, unless otherwise specified by Editorial or Production.</p>
              <p>• Overlays should not be 100% white.</p>
              <p>• Overlays should be inside of any letterboxing.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaReview;