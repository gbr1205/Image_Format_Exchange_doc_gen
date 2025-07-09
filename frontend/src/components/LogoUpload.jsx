import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const LogoUpload = ({ label, value, onChange, className = "" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef(null);

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (maintain aspect ratio, 128px height)
        const targetHeight = 128;
        const aspectRatio = img.width / img.height;
        const targetWidth = targetHeight * aspectRatio;
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              dataUrl: e.target.result,
              width: targetWidth,
              height: targetHeight
            });
          };
          reader.readAsDataURL(blob);
        }, 'image/png', 0.9);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const resizedImage = await resizeImage(file);
      onChange(resizedImage);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      {value ? (
        <Card className="p-4 border-2 border-dashed border-gray-300 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={value.dataUrl} 
                  alt="Logo preview" 
                  className="h-16 w-auto object-contain rounded border border-gray-200"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>{value.width}x{value.height}px</p>
                <p className="text-xs text-gray-500">Resized to fit 128px height</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-600">Processing image...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <p>Drop logo here or <span className="text-blue-600 font-medium">browse</span></p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                  <p className="text-xs text-gray-500">Will be resized to 128px height</p>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default LogoUpload;