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
    const filename = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'VFX_Spec.pdf';
    
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
    const filename = contentDisposition 
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'VFX_Spec.docx';
    
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

// Filename generation utility
export const generateFilename = (type, data) => {
  switch(type) {
    case 'vfxPulls':
      return `${data.showId}_${data.episode}_${data.sequence}_${data.scene}_${data.shotId}_${data.plate}_${data.version}.${data.framePadding}.exr`;
    case 'vfxDeliveries':
      return `${data.showId}_${data.episode}_${data.sequence}_${data.scene}_${data.shotId}_${data.task}_${data.vendorCodeName}_${data.version}.${data.framePadding}.exr`;
    default:
      return 'unnamed_file.exr';
  }
};