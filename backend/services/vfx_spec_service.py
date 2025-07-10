from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.vfx_spec import VFXSpec, VFXSpecCreate, VFXSpecUpdate, Template, TemplateCreate
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class VFXSpecService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.vfx_specs
        self.templates_collection = db.templates

    async def create_spec(self, spec_data: VFXSpecCreate) -> VFXSpec:
        """Create a new VFX specification"""
        try:
            spec = VFXSpec(**spec_data.dict(exclude_unset=True))
            
            # Ensure camera formats have default if empty
            if not spec.cameraFormats:
                spec.cameraFormats = [{
                    "id": 1,
                    "cameraId": "Camera A",
                    "sourceCamera": "Arri Alexa 35",
                    "codec": "Arri Raw (HDE)",
                    "sensorMode": "Open Gate (4608 x 3164)",
                    "lensSqueezeeFactor": "1:1",
                    "colorSpace": "ARRI - LogC4/AWG4"
                }]
            
            result = await self.collection.insert_one(spec.dict())
            spec.id = str(result.inserted_id)
            return spec
        except Exception as e:
            logger.error(f"Error creating VFX spec: {str(e)}")
            raise

    async def get_spec(self, spec_id: str) -> Optional[VFXSpec]:
        """Get a VFX specification by ID"""
        try:
            spec_data = await self.collection.find_one({"id": spec_id})
            if spec_data:
                spec_data['_id'] = str(spec_data['_id'])
                return VFXSpec(**spec_data)
            return None
        except Exception as e:
            logger.error(f"Error getting VFX spec: {str(e)}")
            raise

    async def get_all_specs(self, limit: int = 50) -> List[VFXSpec]:
        """Get all VFX specifications"""
        try:
            specs = []
            cursor = self.collection.find().limit(limit).sort("createdAt", -1)
            async for spec_data in cursor:
                spec_data['_id'] = str(spec_data['_id'])
                specs.append(VFXSpec(**spec_data))
            return specs
        except Exception as e:
            logger.error(f"Error getting VFX specs: {str(e)}")
            raise

    async def update_spec(self, spec_id: str, spec_data: VFXSpecUpdate) -> Optional[VFXSpec]:
        """Update a VFX specification"""
        try:
            update_data = spec_data.dict(exclude_unset=True)
            update_data['updatedAt'] = datetime.utcnow()
            
            result = await self.collection.update_one(
                {"id": spec_id},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_spec(spec_id)
            return None
        except Exception as e:
            logger.error(f"Error updating VFX spec: {str(e)}")
            raise

    async def delete_spec(self, spec_id: str) -> bool:
        """Delete a VFX specification"""
        try:
            result = await self.collection.delete_one({"id": spec_id})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting VFX spec: {str(e)}")
            raise

    async def create_template(self, template_data: TemplateCreate) -> Template:
        """Create a new template"""
        try:
            template = Template(**template_data.dict())
            result = await self.templates_collection.insert_one(template.dict())
            template.id = str(result.inserted_id)
            return template
        except Exception as e:
            logger.error(f"Error creating template: {str(e)}")
            raise

    async def get_templates(self) -> List[Template]:
        """Get all templates"""
        try:
            templates = []
            cursor = self.templates_collection.find().sort("createdAt", -1)
            async for template_data in cursor:
                template_data['_id'] = str(template_data['_id'])
                templates.append(Template(**template_data))
            return templates
        except Exception as e:
            logger.error(f"Error getting templates: {str(e)}")
            raise

    async def get_template(self, template_id: str) -> Optional[Template]:
        """Get a template by ID"""
        try:
            template_data = await self.templates_collection.find_one({"id": template_id})
            if template_data:
                template_data['_id'] = str(template_data['_id'])
                return Template(**template_data)
            return None
        except Exception as e:
            logger.error(f"Error getting template: {str(e)}")
            raise

    async def delete_template(self, template_id: str) -> bool:
        """Delete a template"""
        try:
            result = await self.templates_collection.delete_one({"id": template_id})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting template: {str(e)}")
            raise