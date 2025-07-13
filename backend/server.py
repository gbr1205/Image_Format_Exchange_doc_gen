import os
import sys
from pathlib import Path
from typing import List, Optional
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, APIRouter, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import logging
import io
import base64
from PIL import Image

# Import models and services
from models.vfx_spec import VFXSpec, VFXSpecCreate, VFXSpecUpdate, Template, TemplateCreate
from services.vfx_spec_service import VFXSpecService
from services.export_service import ExportService
from constants import DROPDOWN_OPTIONS

# Configuration
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize services
vfx_spec_service = VFXSpecService(db)
export_service = ExportService()

# Create FastAPI app
app = FastAPI(
    title="VFX Specs Exchange API", 
    description="Professional VFX specification management system",
    version="1.0.0"
)

# API Router
api_router = APIRouter(prefix="/api")

# VFX Specifications endpoints
@api_router.post("/vfx-specs", response_model=VFXSpec)
async def create_vfx_spec(spec_data: VFXSpecCreate):
    """Create a new VFX specification"""
    try:
        return await vfx_spec_service.create_spec(spec_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/vfx-specs", response_model=List[VFXSpec])
async def get_all_vfx_specs(limit: int = 50):
    """Get all VFX specifications"""
    try:
        return await vfx_spec_service.get_all_specs(limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/vfx-specs/{spec_id}", response_model=VFXSpec)
async def get_vfx_spec(spec_id: str):
    """Get a VFX specification by ID"""
    try:
        spec = await vfx_spec_service.get_spec(spec_id)
        if not spec:
            raise HTTPException(status_code=404, detail="VFX specification not found")
        return spec
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/vfx-specs/{spec_id}", response_model=VFXSpec)
async def update_vfx_spec(spec_id: str, spec_data: VFXSpecUpdate):
    """Update a VFX specification"""
    try:
        spec = await vfx_spec_service.update_spec(spec_id, spec_data)
        if not spec:
            raise HTTPException(status_code=404, detail="VFX specification not found")
        return spec
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/vfx-specs/{spec_id}")
async def delete_vfx_spec(spec_id: str):
    """Delete a VFX specification"""
    try:
        deleted = await vfx_spec_service.delete_spec(spec_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="VFX specification not found")
        return {"message": "VFX specification deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Template endpoints
@api_router.post("/templates", response_model=Template)
async def create_template(template_data: TemplateCreate):
    """Create a new template"""
    try:
        return await vfx_spec_service.create_template(template_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/templates", response_model=List[Template])
async def get_templates():
    """Get all templates"""
    try:
        return await vfx_spec_service.get_templates()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/templates/{template_id}", response_model=Template)
async def get_template(template_id: str):
    """Get a template by ID"""
    try:
        template = await vfx_spec_service.get_template(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        return template
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    """Delete a template"""
    try:
        deleted = await vfx_spec_service.delete_template(template_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Template not found")
        return {"message": "Template deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Export endpoints
@api_router.post("/export/pdf")
async def export_to_pdf(spec_data: dict):
    """Export VFX specification to PDF"""
    try:
        pdf_content = await export_service.export_to_pdf(spec_data)
        
        # Create filename
        project_title = spec_data.get('projectInfo', {}).get('projectTitle', 'VFX_Spec')
        filename = f"{project_title.replace(' ', '_')}_VFX_Spec_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return StreamingResponse(
            io.BytesIO(pdf_content),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/export/docx")
async def export_to_docx(spec_data: dict):
    """Export VFX specification to DOCX"""
    try:
        docx_content = await export_service.export_to_docx(spec_data)
        
        # Create filename
        project_title = spec_data.get('projectInfo', {}).get('projectTitle', 'VFX_Spec')
        filename = f"{project_title.replace(' ', '_')}_VFX_Spec_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
        
        return StreamingResponse(
            io.BytesIO(docx_content),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Logo processing endpoint
@api_router.post("/process-logo")
async def process_logo(file: UploadFile = File(...)):
    """Process and resize logo to 128px height"""
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image
        image_data = await file.read()
        
        try:
            image = Image.open(io.BytesIO(image_data))
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        # Calculate new dimensions (maintain aspect ratio, 128px height)
        target_height = 128
        aspect_ratio = image.width / image.height
        target_width = int(target_height * aspect_ratio)
        
        # Resize image
        resized_image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
        
        # Convert to RGB if necessary
        if resized_image.mode != 'RGB':
            resized_image = resized_image.convert('RGB')
        
        # Save to bytes
        output = io.BytesIO()
        resized_image.save(output, format='PNG', optimize=True)
        output.seek(0)
        
        # Convert to base64
        image_base64 = base64.b64encode(output.getvalue()).decode()
        data_url = f"data:image/png;base64,{image_base64}"
        
        return {
            "dataUrl": data_url,
            "width": target_width,
            "height": target_height
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Dropdown options endpoint
@api_router.get("/dropdown-options")
async def get_dropdown_options():
    """Get all dropdown options for the form"""
    return {
        "projectFormat": ["Feature Film", "Episodic", "Commercial", "Music Video", "Documentary", "Short Film"],
        "frameRate": ["23.976fps", "24fps", "25fps", "29.97fps", "30fps", "50fps", "59.94fps", "60fps"],
        "colorScience": ["ACES 1.3", "ACES 1.2", "ACES 1.1", "ACES 1.0", "Rec. 709", "DCI-P3", "Adobe RGB", "Custom"],
        "sourceCamera": ["Arri Alexa 35", "Arri Alexa Mini", "Arri Alexa Mini LF", "Arri Alexa LF", "RED V-Raptor", "RED Komodo", "Sony FX9", "Sony FX6", "Canon C300 Mark III", "Canon C500 Mark II", "Blackmagic URSA Mini Pro 12K"],
        "codec": ["Arri Raw (HDE)", "ProRes 4444 XQ", "ProRes 4444", "ProRes 422 HQ", "ProRes 422", "ProRes 422 LT", "ProRes 422 Proxy", "RED Raw", "BRAW", "XAVC-I", "DNxHR 444", "DNxHR HQX", "DNxHR HQ"],
        "sensorMode": ["Open Gate (4608 x 3164)", "UHD (3840 x 2160)", "2.39:1 (4448 x 1856)", "16:9 (3840 x 2160)", "4:3 (4096 x 3072)", "Full Frame (4096 x 3072)", "S35 (3424 x 2202)", "2K (2048 x 1080)"],
        "lensSqueezeeFactor": ["1:1", "1.25:1", "1.33:1", "1.5:1", "1.65:1", "1.8:1", "2:1"],
        "cameraColorSpace": ["ARRI - LogC4/AWG4", "ARRI - LogC3/AWG3", "RED - Log3G10/REDWideGamutRGB", "Sony - S-Log3/S-Gamut3.Cine", "Canon - C-Log3/Cinema Gamut", "Blackmagic - Film/Wide Gamut", "Rec. 709", "sRGB"],
        "vfxFileFormat": ["OpenEXR (.exr)", "TIFF (.tiff)", "PNG (.png)", "JPEG (.jpg)", "DPX (.dpx)", "Cineon (.cin)"],
        "compression": ["ZIP", "ZIP1", "ZIP16", "PIZ", "RLE", "PXR24", "B44", "B44A", "DWAA", "DWAB", "None"],
        "resolution": [
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
        "vfxColorSpace": ["ACEScg", "ACEScct", "ACEScc", "ACES2065-1 (AP0)", "Rec. 709", "sRGB", "Adobe RGB", "P3-D65", "Rec. 2020"],
        "bitDepth": ["16-bit half float", "32-bit float", "10-bit", "12-bit", "16-bit integer"],
        "framePadding": ["####", "#####", "######", "%04d", "%05d", "%06d"],
        "plate": ["PL", "CP", "EL", "RF", "GS", "CC", "LG"],
        "tasks": ["comp", "precomp", "anim", "mm", "matte", "dmatte", "mp"],
        "container": ["mov", "mp4", "avi", "mxf", "mkv"],
        "videoCodec": ["ProRes 4444 XQ", "ProRes 4444", "ProRes 422 HQ", "ProRes 422", "ProRes 422 LT", "ProRes 422 Proxy", "DNxHR 444", "DNxHR HQX", "DNxHR HQ", "H.264", "H.265/HEVC"]
    }

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "VFX Specs Exchange API is running", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()