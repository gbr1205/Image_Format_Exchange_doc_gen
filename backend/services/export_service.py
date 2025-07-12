from typing import Dict, Any, Optional
import base64
import io
from datetime import datetime
import logging
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.units import inch
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
import PIL.Image

logger = logging.getLogger(__name__)

class ExportService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.custom_styles = self._create_custom_styles()

    def _create_custom_styles(self):
        """Create custom styles for PDF generation"""
        custom_styles = {}
        
        # Title style
        custom_styles['title'] = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=20,
            spaceAfter=30,
            textColor=colors.darkblue,
            alignment=1  # Center alignment
        )
        
        # Section header style
        custom_styles['section'] = ParagraphStyle(
            'CustomSection',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceBefore=20,
            spaceAfter=10,
            textColor=colors.darkblue,
            leftIndent=0
        )
        
        # Subsection style
        custom_styles['subsection'] = ParagraphStyle(
            'CustomSubsection',
            parent=self.styles['Heading3'],
            fontSize=12,
            spaceBefore=15,
            spaceAfter=8,
            textColor=colors.black,
            leftIndent=0
        )
        
        # Body text style
        custom_styles['body'] = ParagraphStyle(
            'CustomBody',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            leftIndent=20
        )
        
        return custom_styles

    def _should_include_field(self, value: Any) -> bool:
        """Check if field should be included (not empty)"""
        if value is None:
            return False
        if isinstance(value, str):
            return value.strip() != ''
        if isinstance(value, (list, dict)):
            return len(value) > 0
        return True

    def _get_logo_image(self, logo_data: str) -> Optional[Image]:
        """Convert base64 logo data to ReportLab Image"""
        try:
            if logo_data and logo_data.startswith('data:image'):
                # Extract base64 data
                base64_data = logo_data.split(',')[1]
                image_data = base64.b64decode(base64_data)
                image_buffer = io.BytesIO(image_data)
                
                # Create ReportLab Image
                img = Image(image_buffer)
                img.drawHeight = 1 * inch
                img.drawWidth = 2 * inch
                return img
        except Exception as e:
            logger.error(f"Error processing logo: {str(e)}")
        return None

    async def export_to_pdf(self, data: Dict[str, Any]) -> bytes:
        """Export VFX specification to professional PDF"""
        try:
            logger.info("Generating professional PDF export")
            
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.75*inch, bottomMargin=0.75*inch)
            story = []
            
            # Title
            title = Paragraph("IMAGE FORMAT EXCHANGE SPECS", self.custom_styles['title'])
            story.append(title)
            story.append(Spacer(1, 20))
            
            # Subtitle
            subtitle = Paragraph("Technical Consistency Across Processes", self.styles['Normal'])
            subtitle.alignment = 1  # Center
            story.append(subtitle)
            story.append(Spacer(1, 30))
            
            # Date
            date_text = f"Generated: {datetime.now().strftime('%B %d, %Y at %H:%M')}"
            date_para = Paragraph(date_text, self.styles['Normal'])
            date_para.alignment = 1  # Center
            story.append(date_para)
            story.append(Spacer(1, 30))
            
            # Letterhead Information Section
            letterhead_info = data.get('letterheadInfo', {})
            if any(self._should_include_field(letterhead_info.get(field)) for field in letterhead_info):
                story.append(Paragraph("LETTERHEAD INFORMATION", self.custom_styles['section']))
                
                # Add logo if present
                if letterhead_info.get('logo'):
                    logo_img = self._get_logo_image(letterhead_info['logo'])
                    if logo_img:
                        story.append(logo_img)
                        story.append(Spacer(1, 10))
                
                letterhead_data = []
                if self._should_include_field(letterhead_info.get('userCompanyName')):
                    letterhead_data.append(['Company Name:', letterhead_info['userCompanyName']])
                if self._should_include_field(letterhead_info.get('email')):
                    letterhead_data.append(['Email:', letterhead_info['email']])
                if self._should_include_field(letterhead_info.get('address')):
                    letterhead_data.append(['Address:', letterhead_info['address']])
                if self._should_include_field(letterhead_info.get('website')):
                    letterhead_data.append(['Website:', letterhead_info['website']])
                
                if letterhead_data:
                    table = Table(letterhead_data, colWidths=[2*inch, 4*inch])
                    table.setStyle(TableStyle([
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                        ('FONTSIZE', (0, 0), (-1, -1), 10),
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ]))
                    story.append(table)
                    story.append(Spacer(1, 20))
            
            # Project Information Section
            project_info = data.get('projectInfo', {})
            if any(self._should_include_field(project_info.get(field)) for field in project_info):
                story.append(Paragraph("PROJECT INFORMATION", self.custom_styles['section']))
                
                project_data = []
                fields_mapping = {
                    'documentVersion': 'Document Version:',
                    'projectDate': 'Project Date:',
                    'projectTitle': 'Project Title:',
                    'projectCodeName': 'Project Code Name:',
                    'projectFormat': 'Project Format:',
                    'client': 'Client:',
                    'director': 'Director:',
                    'dop': 'Director of Photography:',
                    'productionCompany': 'Production Company:',
                    'postProductionSupervisor': 'Post-Production Supervisor:',
                    'lab': 'Lab:',
                    'colorist': 'Colorist:',
                    'vfxSupervisor': 'VFX Supervisor:',
                    'vfxOnSetSupervisor': 'VFX On-Set Supervisor:',
                    'vfxVendor': 'VFX Vendor:',
                    'vendorCodeName': 'Vendor Code Name:',
                    'projectFrameRate': 'Project Frame Rate:',
                    'colorScience': 'Color Science:',
                    'customColorScience': 'Custom Color Science:',
                    'vfxDocumentsLink': 'VFX Documents Link:'
                }
                
                for field, label in fields_mapping.items():
                    if self._should_include_field(project_info.get(field)):
                        project_data.append([label, str(project_info[field])])
                
                if project_data:
                    table = Table(project_data, colWidths=[2.5*inch, 3.5*inch])
                    table.setStyle(TableStyle([
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                        ('FONTSIZE', (0, 0), (-1, -1), 10),
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ]))
                    story.append(table)
                    story.append(Spacer(1, 20))
            
            # Camera Formats Section
            camera_formats = data.get('cameraFormats', [])
            if camera_formats:
                story.append(Paragraph("CAMERA FORMATS", self.custom_styles['section']))
                
                for i, camera in enumerate(camera_formats, 1):
                    if any(self._should_include_field(camera.get(field)) for field in camera):
                        story.append(Paragraph(f"Camera {i}: {camera.get('cameraId', 'Unknown')}", self.custom_styles['subsection']))
                        
                        camera_data = []
                        if self._should_include_field(camera.get('sourceCamera')):
                            camera_data.append(['Source Camera:', camera['sourceCamera']])
                        if self._should_include_field(camera.get('codec')):
                            camera_data.append(['Codec:', camera['codec']])
                        if self._should_include_field(camera.get('sensorMode')):
                            camera_data.append(['Sensor Mode:', camera['sensorMode']])
                        if self._should_include_field(camera.get('lensSqueezeeFactor')):
                            camera_data.append(['Lens Squeeze Factor:', camera['lensSqueezeeFactor']])
                        if self._should_include_field(camera.get('colorSpace')):
                            camera_data.append(['Color Space:', camera['colorSpace']])
                        
                        if camera_data:
                            table = Table(camera_data, colWidths=[2*inch, 4*inch])
                            table.setStyle(TableStyle([
                                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                                ('FONTSIZE', (0, 0), (-1, -1), 10),
                                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                            ]))
                            story.append(table)
                            story.append(Spacer(1, 15))
            
            # VFX Pulls Section
            vfx_pulls = data.get('vfxPulls', {})
            if any(self._should_include_field(vfx_pulls.get(field)) for field in vfx_pulls):
                story.append(Paragraph("VFX PULLS SPECIFICATIONS", self.custom_styles['section']))
                
                vfx_data = []
                vfx_fields = {
                    'fileFormat': 'File Format:',
                    'compression': 'Compression:',
                    'resolution': 'Resolution:',
                    'colorSpace': 'Color Space:',
                    'bitDepth': 'Bit Depth:',
                    'frameHandles': 'Frame Handles:',
                    'framePadding': 'Frame Padding:',
                    'showId': 'Show ID:',
                    'episode': 'Episode:',
                    'sequence': 'Sequence:',
                    'scene': 'Scene:',
                    'shotId': 'Shot ID:',
                    'plate': 'Plate:',
                    'identifier': 'Identifier:',
                    'version': 'Version:',
                    'vfxLutsLink': 'VFX LUTs Link:'
                }
                
                for field, label in vfx_fields.items():
                    if self._should_include_field(vfx_pulls.get(field)):
                        vfx_data.append([label, str(vfx_pulls[field])])
                
                if vfx_data:
                    table = Table(vfx_data, colWidths=[2*inch, 4*inch])
                    table.setStyle(TableStyle([
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                        ('FONTSIZE', (0, 0), (-1, -1), 10),
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ]))
                    story.append(table)
                    story.append(Spacer(1, 20))
            
            # Media Review Section
            media_review = data.get('mediaReview', {})
            if any(self._should_include_field(media_review.get(field)) for field in media_review):
                story.append(Paragraph("MEDIA REVIEW SPECIFICATIONS", self.custom_styles['section']))
                
                media_data = []
                media_fields = {
                    'container': 'Container:',
                    'videoCodec': 'Video Codec:',
                    'resolution': 'Resolution:',
                    'aspectRatio': 'Aspect Ratio:',
                    'letterboxing': 'Letterboxing:',
                    'frameRate': 'Frame Rate:',
                    'colorSpace': 'Color Space:',
                    'slateOverlaysLink': 'Slate & Overlays Link:'
                }
                
                for field, label in media_fields.items():
                    if self._should_include_field(media_review.get(field)):
                        media_data.append([label, str(media_review[field])])
                
                if media_data:
                    table = Table(media_data, colWidths=[2*inch, 4*inch])
                    table.setStyle(TableStyle([
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                        ('FONTSIZE', (0, 0), (-1, -1), 10),
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ]))
                    story.append(table)
                    story.append(Spacer(1, 20))
            
            # VFX Deliveries Section
            vfx_deliveries = data.get('vfxDeliveries', {})
            if any(self._should_include_field(vfx_deliveries.get(field)) for field in vfx_deliveries):
                story.append(Paragraph("VFX DELIVERIES SPECIFICATIONS", self.custom_styles['section']))
                
                delivery_data = []
                delivery_fields = {
                    'showId': 'Show ID:',
                    'episode': 'Episode:',
                    'sequence': 'Sequence:',
                    'scene': 'Scene:',
                    'shotId': 'Shot ID:',
                    'task': 'Task:',
                    'vendorCodeName': 'Vendor Code Name:',
                    'version': 'Version:'
                }
                
                for field, label in delivery_fields.items():
                    if self._should_include_field(vfx_deliveries.get(field)):
                        delivery_data.append([label, str(vfx_deliveries[field])])
                
                if delivery_data:
                    table = Table(delivery_data, colWidths=[2*inch, 4*inch])
                    table.setStyle(TableStyle([
                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                        ('FONTSIZE', (0, 0), (-1, -1), 10),
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ]))
                    story.append(table)
                    story.append(Spacer(1, 20))
            
            # Build PDF
            doc.build(story)
            buffer.seek(0)
            return buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Error generating PDF: {str(e)}")
            raise

    async def export_to_docx(self, data: Dict[str, Any]) -> bytes:
        """Export VFX specification to professional DOCX"""
        try:
            logger.info("Generating professional DOCX export")
            
            doc = Document()
            
            # Set document styles
            style = doc.styles['Normal']
            style.font.name = 'Calibri'
            style.font.size = Pt(11)
            
            # Title
            title = doc.add_heading('IMAGE FORMAT EXCHANGE SPECS', 0)
            title.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
            # Subtitle
            subtitle = doc.add_paragraph('Technical Consistency Across Processes')
            subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
            # Date
            date_para = doc.add_paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y at %H:%M')}")
            date_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
            doc.add_paragraph()  # Empty line
            
            # Letterhead Information Section
            letterhead_info = data.get('letterheadInfo', {})
            if any(self._should_include_field(letterhead_info.get(field)) for field in letterhead_info):
                doc.add_heading('Letterhead Information', level=1)
                
                if self._should_include_field(letterhead_info.get('userCompanyName')):
                    doc.add_paragraph(f"Company Name: {letterhead_info['userCompanyName']}")
                if self._should_include_field(letterhead_info.get('email')):
                    doc.add_paragraph(f"Email: {letterhead_info['email']}")
                if self._should_include_field(letterhead_info.get('address')):
                    doc.add_paragraph(f"Address: {letterhead_info['address']}")
                if self._should_include_field(letterhead_info.get('website')):
                    doc.add_paragraph(f"Website: {letterhead_info['website']}")
                
                doc.add_paragraph()  # Empty line
            
            # Project Information Section
            project_info = data.get('projectInfo', {})
            if any(self._should_include_field(project_info.get(field)) for field in project_info):
                doc.add_heading('Project Information', level=1)
                
                fields_mapping = {
                    'documentVersion': 'Document Version',
                    'projectDate': 'Project Date',
                    'projectTitle': 'Project Title',
                    'projectCodeName': 'Project Code Name',
                    'projectFormat': 'Project Format',
                    'client': 'Client',
                    'director': 'Director',
                    'dop': 'Director of Photography',
                    'productionCompany': 'Production Company',
                    'postProductionSupervisor': 'Post-Production Supervisor',
                    'lab': 'Lab',
                    'colorist': 'Colorist',
                    'vfxSupervisor': 'VFX Supervisor',
                    'vfxOnSetSupervisor': 'VFX On-Set Supervisor',
                    'vfxVendor': 'VFX Vendor',
                    'vendorCodeName': 'Vendor Code Name',
                    'projectFrameRate': 'Project Frame Rate',
                    'colorScience': 'Color Science',
                    'customColorScience': 'Custom Color Science',
                    'vfxDocumentsLink': 'VFX Documents Link'
                }
                
                for field, label in fields_mapping.items():
                    if self._should_include_field(project_info.get(field)):
                        doc.add_paragraph(f"{label}: {project_info[field]}")
                
                doc.add_paragraph()  # Empty line
            
            # Camera Formats Section
            camera_formats = data.get('cameraFormats', [])
            if camera_formats:
                doc.add_heading('Camera Formats', level=1)
                
                for i, camera in enumerate(camera_formats, 1):
                    if any(self._should_include_field(camera.get(field)) for field in camera):
                        doc.add_heading(f"Camera {i}: {camera.get('cameraId', 'Unknown')}", level=2)
                        
                        if self._should_include_field(camera.get('sourceCamera')):
                            doc.add_paragraph(f"Source Camera: {camera['sourceCamera']}")
                        if self._should_include_field(camera.get('codec')):
                            doc.add_paragraph(f"Codec: {camera['codec']}")
                        if self._should_include_field(camera.get('sensorMode')):
                            doc.add_paragraph(f"Sensor Mode: {camera['sensorMode']}")
                        if self._should_include_field(camera.get('lensSqueezeeFactor')):
                            doc.add_paragraph(f"Lens Squeeze Factor: {camera['lensSqueezeeFactor']}")
                        if self._should_include_field(camera.get('colorSpace')):
                            doc.add_paragraph(f"Color Space: {camera['colorSpace']}")
                
                doc.add_paragraph()  # Empty line
            
            # VFX Pulls Section
            vfx_pulls = data.get('vfxPulls', {})
            if any(self._should_include_field(vfx_pulls.get(field)) for field in vfx_pulls):
                doc.add_heading('VFX Pulls Specifications', level=1)
                
                vfx_fields = {
                    'fileFormat': 'File Format',
                    'compression': 'Compression',
                    'resolution': 'Resolution',
                    'colorSpace': 'Color Space',
                    'bitDepth': 'Bit Depth',
                    'frameHandles': 'Frame Handles',
                    'framePadding': 'Frame Padding',
                    'showId': 'Show ID',
                    'episode': 'Episode',
                    'sequence': 'Sequence',
                    'scene': 'Scene',
                    'shotId': 'Shot ID',
                    'plate': 'Plate',
                    'identifier': 'Identifier',
                    'version': 'Version',
                    'vfxLutsLink': 'VFX LUTs Link'
                }
                
                for field, label in vfx_fields.items():
                    if self._should_include_field(vfx_pulls.get(field)):
                        doc.add_paragraph(f"{label}: {vfx_pulls[field]}")
                
                doc.add_paragraph()  # Empty line
            
            # Media Review Section
            media_review = data.get('mediaReview', {})
            if any(self._should_include_field(media_review.get(field)) for field in media_review):
                doc.add_heading('Media Review Specifications', level=1)
                
                media_fields = {
                    'container': 'Container',
                    'videoCodec': 'Video Codec',
                    'resolution': 'Resolution',
                    'aspectRatio': 'Aspect Ratio',
                    'letterboxing': 'Letterboxing',
                    'frameRate': 'Frame Rate',
                    'colorSpace': 'Color Space',
                    'slateOverlaysLink': 'Slate & Overlays Link'
                }
                
                for field, label in media_fields.items():
                    if self._should_include_field(media_review.get(field)):
                        doc.add_paragraph(f"{label}: {media_review[field]}")
                
                doc.add_paragraph()  # Empty line
            
            # VFX Deliveries Section
            vfx_deliveries = data.get('vfxDeliveries', {})
            if any(self._should_include_field(vfx_deliveries.get(field)) for field in vfx_deliveries):
                doc.add_heading('VFX Deliveries Specifications', level=1)
                
                delivery_fields = {
                    'showId': 'Show ID',
                    'episode': 'Episode',
                    'sequence': 'Sequence',
                    'scene': 'Scene',
                    'shotId': 'Shot ID',
                    'task': 'Task',
                    'vendorCodeName': 'Vendor Code Name',
                    'version': 'Version'
                }
                
                for field, label in delivery_fields.items():
                    if self._should_include_field(vfx_deliveries.get(field)):
                        doc.add_paragraph(f"{label}: {vfx_deliveries[field]}")
            
            # Save to buffer
            buffer = io.BytesIO()
            doc.save(buffer)
            buffer.seek(0)
            return buffer.getvalue()
            
        except Exception as e:
            logger.error(f"Error generating DOCX: {str(e)}")
            raise

    def generate_filename(self, export_type: str, data: Dict[str, Any]) -> str:
        """Generate filename based on export type and data"""
        try:
            if export_type == 'vfxPulls':
                vfx_pulls = data.get('vfxPulls', {})
                return f"{vfx_pulls.get('showId', 'AAA')}_{vfx_pulls.get('episode', '101')}_{vfx_pulls.get('sequence', '001')}_{vfx_pulls.get('scene', '001')}_{vfx_pulls.get('shotId', '0010')}_{vfx_pulls.get('plate', 'PL01')}_{vfx_pulls.get('version', 'v001')}.{vfx_pulls.get('framePadding', '####')}.exr"
            elif export_type == 'vfxDeliveries':
                vfx_deliveries = data.get('vfxDeliveries', {})
                return f"{vfx_deliveries.get('showId', 'AAA')}_{vfx_deliveries.get('episode', '101')}_{vfx_deliveries.get('sequence', '001')}_{vfx_deliveries.get('scene', '001')}_{vfx_deliveries.get('shotId', '0010')}_{vfx_deliveries.get('task', 'comp')}_{vfx_deliveries.get('vendorCodeName', 'VEND')}_{vfx_deliveries.get('version', 'v001')}.{vfx_deliveries.get('framePadding', '####')}.exr"
            else:
                project_title = data.get('projectInfo', {}).get('projectTitle', 'VFX_Specification')
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                return f"{project_title.replace(' ', '_')}_{timestamp}"
        except Exception as e:
            logger.error(f"Error generating filename: {str(e)}")
            return f"VFX_Specification_{datetime.now().strftime('%Y%m%d_%H%M%S')}"