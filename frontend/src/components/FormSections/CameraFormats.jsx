import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2, Camera } from 'lucide-react';
import { dropdownOptions } from '../../services/mockData';

const CameraFormats = ({ data, onChange }) => {
  const handleAddCamera = () => {
    const newCamera = {
      id: Date.now(),
      cameraId: `Camera ${String.fromCharCode(65 + data.length)}`,
      sourceCamera: 'Arri Alexa 35',
      codec: 'Arri Raw (HDE)',
      sensorMode: 'Open Gate (4608 x 3164)',
      lensSqueezeeFactor: '1:1',
      colorSpace: 'ARRI - LogC4/AWG4'
    };
    onChange('cameraFormats', [...data, newCamera]);
  };

  const handleRemoveCamera = (id) => {
    onChange('cameraFormats', data.filter(camera => camera.id !== id));
  };

  const handleCameraChange = (id, field, value) => {
    onChange('cameraFormats', data.map(camera => 
      camera.id === id ? { ...camera, [field]: value } : camera
    ));
  };

  return (
    <Card className="shadow-sm border-l-4 border-l-purple-500">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
        <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Camera Formats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {data.map((camera, index) => (
          <Card key={camera.id} className="border-2 border-dashed border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-700">Camera {index + 1}</span>
                </div>
                {data.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCamera(camera.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Camera ID
                  </Label>
                  <Input
                    placeholder="Camera A"
                    value={camera.cameraId || ''}
                    onChange={(e) => handleCameraChange(camera.id, 'cameraId', e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Source Camera
                  </Label>
                  <Select 
                    value={camera.sourceCamera || ''} 
                    onValueChange={(value) => handleCameraChange(camera.id, 'sourceCamera', value)}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="Arri Alexa 35" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.sourceCamera.map(cam => (
                        <SelectItem key={cam} value={cam}>{cam}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Codec
                  </Label>
                  <Select 
                    value={camera.codec || ''} 
                    onValueChange={(value) => handleCameraChange(camera.id, 'codec', value)}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="Arri Raw (HDE)" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.codec.map(codec => (
                        <SelectItem key={codec} value={codec}>{codec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Sensor Mode
                  </Label>
                  <Select 
                    value={camera.sensorMode || ''} 
                    onValueChange={(value) => handleCameraChange(camera.id, 'sensorMode', value)}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="Open Gate (4608 x 3164)" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.sensorMode.map(mode => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Lens Squeeze Factor
                  </Label>
                  <Select 
                    value={camera.lensSqueezeeFactor || ''} 
                    onValueChange={(value) => handleCameraChange(camera.id, 'lensSqueezeeFactor', value)}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="1:1" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.lensSqueezeeFactor.map(factor => (
                        <SelectItem key={factor} value={factor}>{factor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Color Space
                  </Label>
                  <Select 
                    value={camera.colorSpace || ''} 
                    onValueChange={(value) => handleCameraChange(camera.id, 'colorSpace', value)}
                  >
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="ARRI - LogC4/AWG4" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.cameraColorSpace.map(space => (
                        <SelectItem key={space} value={space}>{space}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button
          onClick={handleAddCamera}
          variant="outline"
          className="w-full border-2 border-dashed border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Camera Format
        </Button>
      </CardContent>
    </Card>
  );
};

export default CameraFormats;