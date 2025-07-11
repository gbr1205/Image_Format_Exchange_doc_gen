import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { logoAPI } from '../services/api';

const LogoUpload = ({ label, value, onChange, className = "" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const processedImage = await logoAPI.process(file);
      onChange(processedImage);
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
      <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</label>
      
      {value ? (
        <Card className="p-4 border-2 border-dashed" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={value.dataUrl} 
                  alt="Logo preview" 
                  className="h-16 w-auto object-contain rounded border"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <p>{value.width}x{value.height}px</p>
                <p className="text-xs">Resized to fit 128px height</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              style={{ 
                color: 'var(--error)', 
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background-secondary)'
              }}
              className="hover:opacity-80"
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
          style={{ 
            backgroundColor: dragActive ? 'var(--accent-hover)' : 'var(--background-secondary)',
            borderColor: dragActive ? 'var(--accent-primary)' : 'var(--border)'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Processing image...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8" style={{ color: 'var(--text-secondary)' }} />
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>Drop logo here or <span className="font-medium" style={{ color: 'var(--accent-primary)' }}>browse</span></p>
                  <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                  <p className="text-xs">Will be resized to 128px height</p>
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