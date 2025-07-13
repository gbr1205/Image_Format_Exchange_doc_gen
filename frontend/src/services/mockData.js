// VFX Specification Dropdown Options and Utilities
// Centralized constants for frontend form dropdowns

export const dropdownOptions = {
  projectFormat: ["Feature Film", "Episodic", "Commercial", "Music Video", "Documentary", "Short Film"],
  frameRate: ["23.976fps", "24fps", "25fps", "29.97fps", "30fps", "50fps", "59.94fps", "60fps"],
  colorScience: ["ACES 1.0", "ACES 1.1", "ACES 1.2", "ACES 1.3", "Custom"],
  mediaResolution: ["4096 x 2304", "4096 x 2160", "4096 x 2048", "2048 x 1152", "2048 x 1080", "1920 x 1080", "1280 x 720"],
  mediaAspectRatio: ["1.33:1", "1.37:1", "1.66:1", "1.78:1", "1.85:1", "2.20:1", "2.35:1", "2.39:1", "2.76:1", "4:3", "16:9"],
  mediaFrameRate: ["23.976 fps", "24 fps", "25 fps", "29.97 fps", "30 fps", "50 fps", "59.94 fps", "60 fps"],
  sourceCamera: ["Arri Alexa 35", "Arri Alexa Mini", "Arri Alexa Mini LF", "Arri Alexa LF", "RED V-Raptor", "RED Komodo", "Sony FX9", "Sony FX6", "Canon C300 Mark III", "Canon C500 Mark II", "Blackmagic URSA Mini Pro 12K"],
  codec: ["Arri Raw (HDE)", "ProRes 4444 XQ", "ProRes 4444", "ProRes 422 HQ", "ProRes 422", "ProRes 422 LT", "ProRes 422 Proxy", "RED Raw", "BRAW", "XAVC-I", "DNxHR 444", "DNxHR HQX", "DNxHR HQ"],
  sensorMode: ["Open Gate (4608 x 3164)", "UHD (3840 x 2160)", "2.39:1 (4448 x 1856)", "16:9 (3840 x 2160)", "4:3 (4096 x 3072)", "Full Frame (4096 x 3072)", "S35 (3424 x 2202)", "2K (2048 x 1080)"],
  lensSqueezeeFactor: ["1:1", "1.25:1", "1.33:1", "1.5:1", "1.65:1", "1.8:1", "2:1"],
  cameraColorSpace: ["ARRI - LogC4/AWG4", "ARRI - LogC3/AWG3", "RED - Log3G10/REDWideGamutRGB", "Sony - S-Log3/S-Gamut3.Cine", "Canon - C-Log3/Cinema Gamut", "Blackmagic - Film/Wide Gamut", "Rec. 709", "sRGB"],
  colorSpace: ["ACES2065-1 (AP0)", "ACEScg", "ACEScct", "ACEScc", "sRGB", "Rec709", "Rec1886", "Rec2020"],
  vfxFileFormat: ["OpenEXR (.exr)", "TIFF (.tiff)", "PNG (.png)", "JPEG (.jpg)", "DPX (.dpx)", "Cineon (.cin)"],
  compression: ["ZIP", "ZIP1", "ZIP16", "PIZ", "RLE", "PXR24", "B44", "B44A", "DWAA", "DWAB", "None"],
  resolution: [
    "8192 x 4320 (8K Full Frame)", 
    "6144 x 3160 (6K)", 
    "4608 x 3164 (4.6K 3:2 Open Gate)", 
    "4608 x 2592 (4.6K 16:9)", 
    "4096 x 2304 (4K 16:9)", 
    "4096 x 2160 (4K)", 
    "4096 x 2048 (4K 2:1)", 
    "3328 x 2790 (3.3K 6:5)", 
    "3072 x 3072 (3K 1:1)", 
    "2743 x 3086 (2.7K 8:9)", 
    "2048 x 1152 (2K 16:9 S16)", 
    "2048 x 1080 (2K)"
  ],
  vfxColorSpace: ["ACEScg", "ACEScct", "ACEScc", "ACES2065-1 (AP0)", "Rec. 709", "sRGB", "Adobe RGB", "P3-D65", "Rec. 2020"],
  bitDepth: ["16-bit half float", "32-bit float", "10-bit", "12-bit", "16-bit integer"],
  framePadding: ["####", "#####", "######", "%04d", "%05d", "%06d"],
  plate: ["PL", "CP", "EL", "RF", "GS", "CC", "LG"],
  tasks: ["comp", "precomp", "anim", "mm", "matte", "dmatte", "mp"],
  container: ["mov", "mp4", "avi", "mxf", "mkv"],
  videoCodec: ["ProRes 4444 XQ", "ProRes 4444", "ProRes 422 HQ", "ProRes 422", "ProRes 422 LT", "ProRes 422 Proxy", "DNxHR 444", "DNxHR HQX", "DNxHR HQ", "H.264", "H.265/HEVC"]
};

export const templateService = {
  saveTemplate: (name, data) => {
    const templates = JSON.parse(localStorage.getItem('imageFormatTemplates') || '[]');
    const template = {
      id: Date.now(),
      name,
      data,
      createdAt: new Date().toISOString()
    };
    templates.push(template);
    localStorage.setItem('imageFormatTemplates', JSON.stringify(templates));
    return template;
  },
  
  getTemplates: () => {
    return JSON.parse(localStorage.getItem('imageFormatTemplates') || '[]');
  },
  
  deleteTemplate: (id) => {
    const templates = JSON.parse(localStorage.getItem('imageFormatTemplates') || '[]');
    const filtered = templates.filter(t => t.id !== id);
    localStorage.setItem('imageFormatTemplates', JSON.stringify(filtered));
  },
  
  loadTemplate: (id) => {
    const templates = JSON.parse(localStorage.getItem('imageFormatTemplates') || '[]');
    return templates.find(t => t.id === id);
  }
};