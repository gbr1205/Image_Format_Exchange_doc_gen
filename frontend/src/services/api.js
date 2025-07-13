import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// VFX Specs API
export const vfxSpecsAPI = {
  create: async (data) => {
    const response = await axios.post(`${API}/vfx-specs`, data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await axios.get(`${API}/vfx-specs`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API}/vfx-specs/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await axios.put(`${API}/vfx-specs/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await axios.delete(`${API}/vfx-specs/${id}`);
    return response.data;
  }
};

// Templates API
export const templatesAPI = {
  create: async (name, data) => {
    const response = await axios.post(`${API}/templates`, { name, data });
    return response.data;
  },
  
  getAll: async () => {
    const response = await axios.get(`${API}/templates`);
    return response.data;
  },
  
  getById: async (id) => {
    const response = await axios.get(`${API}/templates/${id}`);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await axios.delete(`${API}/templates/${id}`);
    return response.data;
  }
};

// Export API
export const exportAPI = {
  toPDF: async (data) => {
    const response = await axios.post(`${API}/export/pdf`, data, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from headers or create default
    const contentDisposition = response.headers['content-disposition'];
    let filename = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'VFX_Specification.pdf';
    
    // Add project title and timestamp for unique naming
    const projectTitle = data.projectInfo?.projectTitle || 'VFX_Spec';
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    filename = `${projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.pdf`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  
  toDOCX: async (data) => {
    const response = await axios.post(`${API}/export/docx`, data, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from headers or create default
    const contentDisposition = response.headers['content-disposition'];
    let filename = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'VFX_Specification.docx';
    
    // Add project title and timestamp for unique naming
    const projectTitle = data.projectInfo?.projectTitle || 'VFX_Spec';
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    filename = `${projectTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.docx`;
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};

// Logo processing API
export const logoAPI = {
  process: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API}/process-logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
};

// Dropdown options API
export const dropdownAPI = {
  getOptions: async () => {
    const response = await axios.get(`${API}/dropdown-options`);
    return response.data;
  }
};

// Helper function to get file extension from format
const getFileExtension = (format) => {
  if (format.includes('.exr')) return 'exr';
  if (format.includes('.tiff')) return 'tiff';
  if (format.includes('.png')) return 'png';
  if (format.includes('.jpg')) return 'jpg';
  if (format.includes('.dpx')) return 'dpx';
  if (format.includes('.cin')) return 'cin';
  return 'exr'; // default
};

// Helper function to check if field should be included (not empty)
const shouldInclude = (value) => {
  return value && value.toString().trim() !== '';
};

// Filename generation utility
export const generateFilename = (type, data) => {
  if (type === 'vfxPulls') {
    const parts = [];
    
    // Required fields
    if (shouldInclude(data.showId)) parts.push(data.showId);
    if (shouldInclude(data.episode)) parts.push(data.episode);
    
    // Optional fields
    if (shouldInclude(data.sequence)) parts.push(data.sequence);
    if (shouldInclude(data.scene)) parts.push(data.scene);
    
    // Required fields
    if (shouldInclude(data.shotId)) parts.push(data.shotId);
    if (shouldInclude(data.plate) && shouldInclude(data.identifier)) {
      parts.push(data.plate + data.identifier); // No dash separation
    }
    if (shouldInclude(data.version)) parts.push(data.version);
    
    const baseName = parts.join('_');
    const padding = shouldInclude(data.framePadding) ? data.framePadding : '####';
    const extension = shouldInclude(data.fileFormat) ? getFileExtension(data.fileFormat) : 'exr';
    
    return `${baseName}.${padding}.${extension}`;
  }
  
  if (type === 'vfxDeliveries') {
    const parts = [];
    
    // Required fields
    if (shouldInclude(data.showId)) parts.push(data.showId);
    if (shouldInclude(data.episode)) parts.push(data.episode);
    
    // Optional fields
    if (shouldInclude(data.sequence)) parts.push(data.sequence);
    if (shouldInclude(data.scene)) parts.push(data.scene);
    
    // Required fields
    if (shouldInclude(data.shotId)) parts.push(data.shotId);
    if (shouldInclude(data.task)) parts.push(data.task);
    if (shouldInclude(data.vendorCodeName)) parts.push(data.vendorCodeName);
    if (shouldInclude(data.version)) parts.push(data.version);
    
    const baseName = parts.join('_');
    const padding = shouldInclude(data.framePadding) ? data.framePadding : '####';
    const extension = shouldInclude(data.fileFormat) ? getFileExtension(data.fileFormat) : 'exr';
    
    return `${baseName}.${padding}.${extension}`;
  }
  
  return 'unnamed_file.exr';
};