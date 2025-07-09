import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { 
  Save, 
  Download, 
  FileText, 
  Settings, 
  Eye, 
  Folder,
  Camera,
  Monitor,
  Layers,
  Film,
  Building2,
  Sparkles
} from 'lucide-react';

import CompanyInfo from './components/FormSections/CompanyInfo';
import ProjectInfo from './components/FormSections/ProjectInfo';
import { mockProjects, templateService } from './services/mockData';

import './App.css';

const VFXSpecsForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyInfo: {},
    projectInfo: {},
    cameraFormats: [{ id: 1, cameraId: 'Camera A', sourceCamera: 'Arri Alexa 35', codec: 'Arri Raw (HDE)', sensorMode: 'Open Gate (4608 x 3164)', lensSqueezeeFactor: '1:1', colorSpace: 'ARRI - LogC4/AWG4' }],
    vfxPulls: { frameHandles: 8, framePadding: '####', showId: '', episode: '', shotId: '', plate: 'PL01', identifier: '01', version: 'v001' },
    mediaReview: { container: 'mov', videoCodec: 'ProRes 422 HQ', resolution: '1920x1080', aspectRatio: '2.20:1', letterboxing: '1920x872', frameRate: '23.976', colorSpace: 'Rec709, CDL and Show LUT Baked in' },
    vfxDeliveries: { showId: '', episode: '', shotId: '', task: 'comp', vendorCodeName: '', version: 'v001' }
  });

  const [templates, setTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState('company');
  const [completionProgress, setCompletionProgress] = useState(0);

  useEffect(() => {
    loadTemplates();
    // Load sample data
    if (mockProjects.length > 0) {
      setFormData(mockProjects[0].data);
    }
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const loadTemplates = () => {
    const savedTemplates = templateService.getTemplates();
    setTemplates(savedTemplates);
  };

  const calculateProgress = () => {
    const requiredFields = [
      'companyInfo.companyName',
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

  const handleSectionChange = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSaveTemplate = () => {
    const templateName = prompt('Enter template name:');
    if (templateName) {
      templateService.saveTemplate(templateName, formData);
      loadTemplates();
      toast({
        title: 'Template Saved',
        description: `Template "${templateName}" saved successfully!`,
      });
    }
  };

  const handleLoadTemplate = (templateId) => {
    const template = templateService.loadTemplate(templateId);
    if (template) {
      setFormData(template.data);
      toast({
        title: 'Template Loaded',
        description: `Template "${template.name}" loaded successfully!`,
      });
    }
  };

  const handleExport = (format) => {
    toast({
      title: 'Export Started',
      description: `Generating ${format.toUpperCase()} export...`,
    });
    
    // Mock export functionality
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: `${format.toUpperCase()} file ready for download!`,
      });
    }, 2000);
  };

  const getTabIcon = (tab) => {
    const icons = {
      company: Building2,
      project: Film,
      camera: Camera,
      vfx: Layers,
      media: Monitor,
      delivery: FileText
    };
    const Icon = icons[tab] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const getTabStatus = (tab) => {
    const checks = {
      company: formData.companyInfo?.companyName,
      project: formData.projectInfo?.projectTitle && formData.projectInfo?.client,
      camera: formData.cameraFormats?.length > 0,
      vfx: formData.vfxPulls?.showId && formData.vfxPulls?.shotId,
      media: formData.mediaReview?.container,
      delivery: formData.vfxDeliveries?.showId && formData.vfxDeliveries?.task
    };
    return checks[tab] ? 'complete' : 'incomplete';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                VFX Specs Exchange
              </h1>
              <p className="text-gray-600 mt-1">Technical Consistency Across Processes</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Progress value={completionProgress} className="w-32" />
                <span className="text-sm font-medium text-gray-600">{completionProgress}%</span>
              </div>
              <Badge variant={completionProgress === 100 ? 'default' : 'secondary'}>
                {completionProgress === 100 ? 'Complete' : 'In Progress'}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport('docx')}>
                <FileText className="h-4 w-4 mr-2" />
                Export DOCX
              </Button>
            </div>
          </div>
        </div>

        {/* Templates */}
        {templates.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border shadow-sm">
            <TabsTrigger value="company" className="flex items-center gap-2 data-[state=active]:bg-blue-50">
              {getTabIcon('company')}
              <span className="hidden sm:inline">Company</span>
              <Badge variant={getTabStatus('company') === 'complete' ? 'default' : 'secondary'} className="ml-1 h-2 w-2 p-0 rounded-full" />
            </TabsTrigger>
            <TabsTrigger value="project" className="flex items-center gap-2 data-[state=active]:bg-green-50">
              {getTabIcon('project')}
              <span className="hidden sm:inline">Project</span>
              <Badge variant={getTabStatus('project') === 'complete' ? 'default' : 'secondary'} className="ml-1 h-2 w-2 p-0 rounded-full" />
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2 data-[state=active]:bg-purple-50">
              {getTabIcon('camera')}
              <span className="hidden sm:inline">Camera</span>
              <Badge variant={getTabStatus('camera') === 'complete' ? 'default' : 'secondary'} className="ml-1 h-2 w-2 p-0 rounded-full" />
            </TabsTrigger>
            <TabsTrigger value="vfx" className="flex items-center gap-2 data-[state=active]:bg-orange-50">
              {getTabIcon('vfx')}
              <span className="hidden sm:inline">VFX</span>
              <Badge variant={getTabStatus('vfx') === 'complete' ? 'default' : 'secondary'} className="ml-1 h-2 w-2 p-0 rounded-full" />
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2 data-[state=active]:bg-pink-50">
              {getTabIcon('media')}
              <span className="hidden sm:inline">Media</span>
              <Badge variant={getTabStatus('media') === 'complete' ? 'default' : 'secondary'} className="ml-1 h-2 w-2 p-0 rounded-full" />
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2 data-[state=active]:bg-cyan-50">
              {getTabIcon('delivery')}
              <span className="hidden sm:inline">Delivery</span>
              <Badge variant={getTabStatus('delivery') === 'complete' ? 'default' : 'secondary'} className="ml-1 h-2 w-2 p-0 rounded-full" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <CompanyInfo 
              data={formData.companyInfo} 
              onChange={handleSectionChange}
            />
          </TabsContent>

          <TabsContent value="project" className="space-y-6">
            <ProjectInfo 
              data={formData.projectInfo} 
              onChange={handleSectionChange}
            />
          </TabsContent>

          <TabsContent value="camera" className="space-y-6">
            <Card className="shadow-sm border-l-4 border-l-purple-500">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Camera Formats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Camera Formats Section</p>
                  <p>Dynamic camera format configuration will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vfx" className="space-y-6">
            <Card className="shadow-sm border-l-4 border-l-orange-500">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent">
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  VFX Pulls
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <Layers className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">VFX Pulls Configuration</p>
                  <p>Technical specifications and naming conventions for VFX pulls</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card className="shadow-sm border-l-4 border-l-pink-500">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-transparent">
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  Media Review
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <Monitor className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Media Review Settings</p>
                  <p>Review format specifications and delivery requirements</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <Card className="shadow-sm border-l-4 border-l-cyan-500">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent">
                <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  VFX Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">VFX Deliveries Naming</p>
                  <p>Final delivery naming conventions and specifications</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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