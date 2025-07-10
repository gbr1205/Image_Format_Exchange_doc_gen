from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class Logo(BaseModel):
    dataUrl: str
    width: int
    height: int

class CompanyInfo(BaseModel):
    companyName: Optional[str] = None
    companyEmail: Optional[str] = None
    companyAddress: Optional[str] = None
    companyWebsite: Optional[str] = None
    companyLogo: Optional[Logo] = None

class ProjectInfo(BaseModel):
    documentVersion: Optional[str] = "v1.0"
    projectDate: Optional[str] = None
    projectTitle: Optional[str] = None
    projectCodeName: Optional[str] = None
    projectFormat: Optional[str] = None
    client: Optional[str] = None
    clientLogo: Optional[Logo] = None
    director: Optional[str] = None
    dop: Optional[str] = None
    productionCompany: Optional[str] = None
    productionCompanyLogo: Optional[Logo] = None
    postProductionSupervisor: Optional[str] = None
    lab: Optional[str] = None
    labLogo: Optional[Logo] = None
    colorist: Optional[str] = None
    vfxSupervisor: Optional[str] = None
    vfxOnSetSupervisor: Optional[str] = None
    vfxVendor: Optional[str] = None
    vfxVendorLogo: Optional[Logo] = None
    vendorCodeName: Optional[str] = None
    vfxDocumentsLink: Optional[str] = None
    projectFrameRate: Optional[str] = None
    colorScience: Optional[str] = None
    additionalNotes: Optional[str] = None

class CameraFormat(BaseModel):
    id: int
    cameraId: Optional[str] = None
    sourceCamera: Optional[str] = None
    codec: Optional[str] = None
    sensorMode: Optional[str] = None
    lensSqueezeeFactor: Optional[str] = None
    colorSpace: Optional[str] = None

class VFXPulls(BaseModel):
    fileFormat: Optional[str] = None
    compression: Optional[str] = None
    resolution: Optional[str] = None
    colorSpace: Optional[str] = None
    bitDepth: Optional[str] = None
    frameHandles: Optional[int] = None
    framePadding: Optional[str] = None
    vfxLutsLink: Optional[str] = None
    showId: Optional[str] = None
    episode: Optional[str] = None
    sequence: Optional[str] = None
    scene: Optional[str] = None
    shotId: Optional[str] = None
    plate: Optional[str] = None
    identifier: Optional[str] = None
    version: Optional[str] = None

class MediaReview(BaseModel):
    container: Optional[str] = None
    videoCodec: Optional[str] = None
    resolution: Optional[str] = None
    aspectRatio: Optional[str] = None
    letterboxing: Optional[str] = None
    frameRate: Optional[str] = None
    colorSpace: Optional[str] = None
    slateOverlaysLink: Optional[str] = None

class VFXDeliveries(BaseModel):
    showId: Optional[str] = None
    episode: Optional[str] = None
    sequence: Optional[str] = None
    scene: Optional[str] = None
    shotId: Optional[str] = None
    task: Optional[str] = None
    vendorCodeName: Optional[str] = None
    version: Optional[str] = None

class VFXSpec(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None
    companyInfo: CompanyInfo = Field(default_factory=CompanyInfo)
    projectInfo: ProjectInfo = Field(default_factory=ProjectInfo)
    cameraFormats: List[CameraFormat] = Field(default_factory=list)
    vfxPulls: VFXPulls = Field(default_factory=VFXPulls)
    mediaReview: MediaReview = Field(default_factory=MediaReview)
    vfxDeliveries: VFXDeliveries = Field(default_factory=VFXDeliveries)
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class VFXSpecCreate(BaseModel):
    name: Optional[str] = None
    companyInfo: Optional[CompanyInfo] = None
    projectInfo: Optional[ProjectInfo] = None
    cameraFormats: Optional[List[CameraFormat]] = None
    vfxPulls: Optional[VFXPulls] = None
    mediaReview: Optional[MediaReview] = None
    vfxDeliveries: Optional[VFXDeliveries] = None

class VFXSpecUpdate(BaseModel):
    name: Optional[str] = None
    companyInfo: Optional[CompanyInfo] = None
    projectInfo: Optional[ProjectInfo] = None
    cameraFormats: Optional[List[CameraFormat]] = None
    vfxPulls: Optional[VFXPulls] = None
    mediaReview: Optional[MediaReview] = None
    vfxDeliveries: Optional[VFXDeliveries] = None

class Template(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    data: Dict[str, Any]
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class TemplateCreate(BaseModel):
    name: str
    data: Dict[str, Any]