import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { 
  Save, 
  Download, 
  FileText, 
  Folder,
  Sparkles
} from 'lucide-react';

import ConsolidatedForm from './components/ConsolidatedForm';
import { vfxSpecsAPI, templatesAPI, exportAPI, dropdownAPI } from './services/api';

import './App.css';

const VFXSpecsForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    letterheadInfo: {},
    projectInfo: {},
    cameraFormats: [{ 
      id: 1, 
      cameraId: 'Camera A', 
      sourceCamera: 'Arri Alexa 35', 
      codec: 'Arri Raw (HDE)', 
      sensorMode: 'Open Gate (4608 x 3164)', 
      lensSqueezeeFactor: '1:1', 
      colorSpace: 'ARRI - LogC4/AWG4' 
    }],
    vfxPulls: { 
      frameHandles: 8, 
      framePadding: '####', 
      showId: '', 
      episode: '', 
      shotId: '', 
      plate: 'PL', 
      identifier: '01', 
      version: 'v001' 
    },
    mediaReview: { 
      container: 'mov', 
      videoCodec: 'ProRes 422 HQ', 
      resolution: '', 
      aspectRatio: '2.20:1', 
      letterboxing: '1920x872', 
      frameRate: '', 
      colorSpace: 'Rec709, CDL and Show LUT Baked in' 
    },
    vfxDeliveries: { 
      showId: '', 
      episode: '', 
      shotId: '', 
      task: 'comp', 
      vendorCodeName: '', 
      version: 'v001' 
    }
  });

  const [templates, setTemplates] = useState([]);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [currentSpecId, setCurrentSpecId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const initializeApp = async () => {
    try {
      await loadTemplates();
      await loadDropdownOptions();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const templateList = await templatesAPI.getAll();
      setTemplates(templateList);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadDropdownOptions = async () => {
    try {
      const options = await dropdownAPI.getOptions();
      // Store in a context or state management system if needed
    } catch (error) {
      console.error('Error loading dropdown options:', error);
    }
  };

  const calculateProgress = () => {
    const requiredFields = [
      'letterheadInfo.userCompanyName',
      'letterheadInfo.email',
      'projectInfo.documentVersion',
      'projectInfo.projectTitle',
      'projectInfo.projectCodeName',
      'projectInfo.client',
      'projectInfo.director',
      'projectInfo.dop',
      'projectInfo.productionCompany',
      'projectInfo.vfxSupervisor',
      'projectInfo.vfxVendor',
      'vfxPulls.showId',
      'vfxPulls.shotId'
    ];

    const filledFields = requiredFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], formData);
      return value && value.toString().trim() !== '';
    });

    const progress = Math.round((filledFields.length / requiredFields.length) * 100);
    setCompletionProgress(progress);
  };

  const handleSectionChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleSaveTemplate = async () => {
    const templateName = prompt('Enter template name:');
    if (templateName) {
      try {
        setLoading(true);
        await templatesAPI.create(templateName, formData);
        await loadTemplates();
        toast({
          title: 'Template Saved',
          description: `Template "${templateName}" saved successfully!`,
        });
      } catch (error) {
        console.error('Error saving template:', error);
        toast({
          title: 'Error',
          description: 'Failed to save template. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLoadTemplate = async (templateId) => {
    try {
      setLoading(true);
      const template = await templatesAPI.getById(templateId);
      if (template) {
        setFormData(template.data);
        toast({
          title: 'Template Loaded',
          description: `Template "${template.name}" loaded successfully!`,
        });
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast({
        title: 'Error',
        description: 'Failed to load template. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setLoading(true);
      toast({
        title: 'Export Started',
        description: `Generating ${format.toUpperCase()} export...`,
      });
      
      if (format === 'pdf') {
        await exportAPI.toPDF(formData);
      } else if (format === 'docx') {
        await exportAPI.toDOCX(formData);
      }
      
      toast({
        title: 'Export Complete',
        description: `${format.toUpperCase()} file downloaded successfully!`,
      });
    } catch (error) {
      console.error('Error exporting:', error);
      toast({
        title: 'Export Error',
        description: 'Failed to export document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSpec = async () => {
    try {
      setLoading(true);
      
      if (currentSpecId) {
        await vfxSpecsAPI.update(currentSpecId, formData);
        toast({
          title: 'Specification Updated',
          description: 'VFX specification updated successfully!',
        });
      } else {
        const newSpec = await vfxSpecsAPI.create(formData);
        setCurrentSpecId(newSpec.id);
        toast({
          title: 'Specification Saved',
          description: 'VFX specification saved successfully!',
        });
      }
    } catch (error) {
      console.error('Error saving specification:', error);
      toast({
        title: 'Save Error',
        description: 'Failed to save specification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTabStatus = (tab) => {
    const checks = {
      letterhead: formData.letterheadInfo?.userCompanyName && formData.letterheadInfo?.email,
      project: formData.projectInfo?.projectTitle && formData.projectInfo?.client,
      camera: formData.cameraFormats?.length > 0,
      vfx: formData.vfxPulls?.showId && formData.vfxPulls?.shotId,
      media: formData.mediaReview?.container,
      delivery: formData.vfxDeliveries?.showId && formData.vfxDeliveries?.task
    };
    return checks[tab] ? 'complete' : 'incomplete';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-main)', color: 'var(--text-primary)' }}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--accent-primary)' }}>
              <Sparkles className="h-6 w-6" style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                IMAGE FORMAT EXCHANGE SPECS
              </h1>
              <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Technical Consistency Across Processes</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Progress value={completionProgress} className="w-32" style={{ backgroundColor: 'var(--background-secondary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{completionProgress}%</span>
              </div>
              <Badge variant={completionProgress === 100 ? 'default' : 'secondary'} style={{ 
                backgroundColor: completionProgress === 100 ? 'var(--success)' : 'var(--background-secondary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border)'
              }}>
                {completionProgress === 100 ? 'Complete' : 'In Progress'}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleSaveSpec}
                disabled={loading}
                style={{ 
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)'
                }}
                className="hover:opacity-80"
              >
                <Save className="h-4 w-4 mr-2" />
                {currentSpecId ? 'Update' : 'Save'} Spec
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveTemplate}
                disabled={loading}
                style={{ 
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)'
                }}
                className="hover:opacity-80"
              >
                <Folder className="h-4 w-4 mr-2" />
                Save Template
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('pdf')}
                disabled={loading}
                style={{ 
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)'
                }}
                className="hover:opacity-80"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('docx')}
                disabled={loading}
                style={{ 
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)'
                }}
                className="hover:opacity-80"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export DOCX
              </Button>
            </div>
          </div>
        </div>

        {/* Templates */}
        {templates.length > 0 && (
          <Card className="mb-6" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Folder className="h-5 w-5" />
                Saved Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {templates.map(template => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadTemplate(template.id)}
                    style={{ 
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border)'
                    }}
                    className="hover:opacity-80"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <ConsolidatedForm 
          formData={formData}
          onFormChange={setFormData}
        />
      </div>
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VFXSpecsForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;