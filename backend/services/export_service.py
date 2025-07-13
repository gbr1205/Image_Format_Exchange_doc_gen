from typing import Dict, Any, Optional
import base64
import io
from datetime import datetime
import logging
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, Line
from reportlab.graphics import renderPDF
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.shared import OxmlElement, qn
from docx.oxml import parse_xml
import PIL.Image

logger = logging.getLogger(__name__)

class ExportService:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.custom_styles = self._create_custom_styles()
        self._register_fonts()

    def _register_fonts(self):
        """Register Roboto fonts if available, fallback to Helvetica"""
        try:
            # Try to register Roboto fonts (would need font files in production)
            # For now, we'll use Helvetica as fallback
            self.font_family = 'Helvetica'
            self.font_bold = 'Helvetica-Bold'
        except:
            self.font_family = 'Helvetica'
            self.font_bold = 'Helvetica-Bold'

    def _create_custom_styles(self):
        """Create custom styles for PDF generation with enhanced styling"""
        custom_styles = {}
        
        # Enhanced title style with gradient-like effect
        custom_styles['title'] = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=26,
            spaceAfter=20,
            spaceBefore=10,
            textColor=colors.HexColor('#1a365d'),  # Dark blue
            alignment=1,  # Center alignment
            fontName='Helvetica-Bold',
            borderWidth=2,
            borderPadding=12,
            borderColor=colors.HexColor('#3182ce'),
            backColor=colors.HexColor('#f7fafc')  # Light background
        )
        
        # Professional subtitle style
        custom_styles['subtitle'] = ParagraphStyle(
            'CustomSubtitle',
            parent=self.styles['Normal'],
            fontSize=14,
            spaceAfter=25,
            textColor=colors.HexColor('#4a5568'),  # Medium gray
            alignment=1,
            fontName='Helvetica-Oblique',
            borderWidth=1,
            borderPadding=8,
            borderColor=colors.HexColor('#e2e8f0'),
            backColor=colors.HexColor('#ffffff')
        )
        
        # Enhanced section header with professional gradient effect
        custom_styles['section'] = ParagraphStyle(
            'CustomSection',
            parent=self.styles['Heading2'],
            fontSize=16,
            spaceBefore=30,
            spaceAfter=15,
            textColor=colors.white,
            leftIndent=15,
            fontName='Helvetica-Bold',
            borderWidth=2,
            borderPadding=12,
            borderColor=colors.HexColor('#2d3748')
        )
        
        # Enhanced subsection style
        custom_styles['subsection'] = ParagraphStyle(
            'CustomSubsection',
            parent=self.styles['Heading3'],
            fontSize=14,
            spaceBefore=20,
            spaceAfter=12,
            textColor=colors.HexColor('#2d3748'),
            leftIndent=10,
            fontName='Helvetica-Bold',
            borderWidth=1,
            borderPadding=8,
            borderColor=colors.HexColor('#cbd5e0'),
            backColor=colors.HexColor('#f7fafc')
        )
        
        # Professional body text with subtle styling
        custom_styles['body'] = ParagraphStyle(
            'CustomBody',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=8,
            leftIndent=25,
            fontName='Helvetica',
            textColor=colors.HexColor('#2d3748')
        )
        
        # Company info style
        custom_styles['company'] = ParagraphStyle(
            'CompanyInfo',
            fontSize=20,
            textColor=colors.HexColor('#1a365d'),
            fontName='Helvetica-Bold',
            alignment=1,
            spaceBefore=10,
            spaceAfter=5
        )
        
        # Contact info style
        custom_styles['contact'] = ParagraphStyle(
            'ContactInfo',
            fontSize=11,
            textColor=colors.HexColor('#4a5568'),
            fontName='Helvetica',
            alignment=1,
            spaceAfter=3
        )
        
        # Date style with enhanced formatting
        custom_styles['date'] = ParagraphStyle(
            'DateStyle',
            fontSize=11,
            textColor=colors.HexColor('#718096'),
            alignment=1,
            fontName='Helvetica-Oblique',
            borderWidth=1,
            borderPadding=6,
            borderColor=colors.HexColor('#e2e8f0'),
            backColor=colors.HexColor('#f7fafc')
        )
        
        return custom_styles

    def _create_section_header(self, title, bg_color):
        """Create a styled section header with enhanced background and borders"""
        header_style = ParagraphStyle(
            'SectionHeader',
            fontSize=16,
            spaceBefore=30,
            spaceAfter=15,
            textColor=colors.white,
            leftIndent=15,
            fontName='Helvetica-Bold',
            backColor=bg_color,
            borderPadding=12,
            borderWidth=2,
            borderColor=colors.HexColor('#2d3748')
        )
        return Paragraph(title, header_style)

    def _create_enhanced_divider_line(self, color=None, thickness=2):
        """Create an enhanced horizontal divider line with professional styling"""
        if color is None:
            color = colors.HexColor('#3182ce')
        return HRFlowable(width="100%", thickness=thickness, color=color, spaceBefore=10, spaceAfter=10)

    def _create_decorative_border(self):
        """Create a decorative border element"""
        return HRFlowable(width="100%", thickness=3, color=colors.HexColor('#e2e8f0'), spaceBefore=5, spaceAfter=5)

    def _create_logo_with_text_table(self, text_data, logo_data, logo_label):
        """Create a table that displays text with logo next to it"""
        table_data = []
        
        for text_item in text_data:
            label, value = text_item
            if label == logo_label and logo_data:
                # Create a table row with text and logo
                logo_img = self._get_logo_image(logo_data, height=0.8*inch, width=1.2*inch)
                if logo_img:
                    table_data.append([label, value, logo_img])
                else:
                    table_data.append([label, value, ""])
            else:
                table_data.append([label, value, ""])
        
        if table_data:
            # Use different column widths if logos are present
            has_logos = any(len(row) > 2 and row[2] != "" for row in table_data)
            if has_logos:
                col_widths = [2*inch, 2.5*inch, 1.5*inch]
                table = Table(table_data, colWidths=col_widths)
            else:
                # Standard two-column layout
                table_data = [[row[0], row[1]] for row in table_data]
                col_widths = [2.5*inch, 3.5*inch]
                table = Table(table_data, colWidths=col_widths)
            
            # Enhanced table styling with professional borders
            table_style = [
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 11),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 10),
                ('LEFTPADDING', (0, 0), (-1, -1), 15),
                ('RIGHTPADDING', (0, 0), (-1, -1), 15),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e0')),
                ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
                ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#3182ce')),  # Header underline
            ]
            
            # Special styling for logo cells
            if has_logos:
                table_style.extend([
                    ('ALIGN', (2, 0), (2, -1), 'CENTER'),
                    ('VALIGN', (2, 0), (2, -1), 'MIDDLE'),
                ])
            
            table.setStyle(TableStyle(table_style))
            return table
        return None

    def _should_include_field(self, value: Any) -> bool:
        """Check if field should be included (not empty)"""
        if value is None:
            return False
        if isinstance(value, str):
            return value.strip() != ''
        if isinstance(value, (list, dict)):
            return len(value) > 0
        return True

    def _get_logo_image(self, logo_data: str, height=1*inch, width=2*inch) -> Optional[Image]:
        """Convert base64 logo data to ReportLab Image with custom sizing"""
        try:
            if logo_data and logo_data.startswith('data:image'):
                # Extract base64 data
                base64_data = logo_data.split(',')[1]
                image_data = base64.b64decode(base64_data)
                image_buffer = io.BytesIO(image_data)
                
                # Create ReportLab Image with custom dimensions
                img = Image(image_buffer)
                img.drawHeight = height
                img.drawWidth = width
                img.hAlign = 'CENTER'
                return img
        except Exception as e:
            logger.error(f"Error processing logo: {str(e)}")
        return None

    def _get_logo_from_data(self, data: Dict[str, Any], logo_path: str) -> Optional[str]:
        """Extract logo data from nested dictionary path"""
        try:
            keys = logo_path.split('.')
            current = data
            for key in keys:
                if isinstance(current, dict) and key in current:
                    current = current[key]
                else:
                    return None
            
            # Handle both old format (string) and new format (dict with dataUrl)
            if isinstance(current, dict) and 'dataUrl' in current:
                return current['dataUrl']
            elif isinstance(current, str):
                return current
        except Exception as e:
            logger.error(f"Error extracting logo from {logo_path}: {str(e)}")
        return None

    def _create_styled_table(self, data, col_widths, bg_color=None, has_logos=False):
        """Create a styled table with enhanced formatting and logo support"""
        if not data:
            return None
            
        table = Table(data, colWidths=col_widths)
        
        # Enhanced table styling with professional appearance
        table_style = [
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('LEFTPADDING', (0, 0), (-1, -1), 15),
            ('RIGHTPADDING', (0, 0), (-1, -1), 15),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#cbd5e0')),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#f8f9fa')]),
            ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#3182ce')),  # Professional header line
        ]
        
        # Add special styling for logo columns if present
        if has_logos and len(col_widths) > 2:
            table_style.extend([
                ('ALIGN', (2, 0), (2, -1), 'CENTER'),
                ('VALIGN', (2, 0), (2, -1), 'MIDDLE'),
                ('FONTSIZE', (2, 0), (2, -1), 8),
            ])
        
        # Apply background color to header if specified
        if bg_color:
            table_style.append(('BACKGROUND', (0, 0), (-1, 0), bg_color))
        
        table.setStyle(TableStyle(table_style))
        return table

    async def export_to_pdf(self, data: Dict[str, Any]) -> bytes:
        """Export VFX specification to professional styled PDF"""
        try:
            logger.info("Generating professional styled PDF export")
            
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(
                buffer, 
                pagesize=A4, 
                topMargin=0.75*inch, 
                bottomMargin=0.75*inch,
                leftMargin=0.75*inch,
                rightMargin=0.75*inch
            )
            story = []
            
            # Header with logo and title
            letterhead_info = data.get('letterheadInfo', {})
            if letterhead_info.get('logo'):
                logo_img = self._get_logo_image(letterhead_info['logo'])
                if logo_img:
                    story.append(logo_img)
                    story.append(Spacer(1, 10))
            
            # Company info header
            if letterhead_info.get('userCompanyName'):
                company_style = ParagraphStyle(
                    'CompanyHeader',
                    fontSize=18,
                    textColor=colors.HexColor('#2d3748'),
                    fontName='Helvetica-Bold',
                    alignment=1
                )
                story.append(Paragraph(letterhead_info['userCompanyName'], company_style))
                if letterhead_info.get('email'):
                    story.append(Paragraph(letterhead_info['email'], self.styles['Normal']))
                story.append(Spacer(1, 20))
            
            # Main title with enhanced styling
            title = Paragraph("IMAGE FORMAT EXCHANGE SPECS", self.custom_styles['title'])
            story.append(title)
            
            # Subtitle
            subtitle = Paragraph("Technical Consistency Across Processes", self.custom_styles['subtitle'])
            story.append(subtitle)
            story.append(Spacer(1, 20))
            
            # Date with styling
            date_text = f"Generated: {datetime.now().strftime('%B %d, %Y at %H:%M')}"
            date_style = ParagraphStyle(
                'DateStyle',
                fontSize=10,
                textColor=colors.HexColor('#718096'),
                alignment=1,
                fontName='Helvetica'
            )
            story.append(Paragraph(date_text, date_style))
            
            # Divider line after letterhead
            story.append(Spacer(1, 20))
            story.append(self._create_divider_line())
            story.append(Spacer(1, 30))
            
            # PROJECT INFORMATION SECTION with cool blue background
            project_info = data.get('projectInfo', {})
            if any(self._should_include_field(project_info.get(field)) for field in project_info):
                section_header = self._create_section_header("PROJECT INFORMATION", colors.HexColor('#3182ce'))
                story.append(KeepTogether([section_header]))
                story.append(Spacer(1, 10))
                
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
                    table = self._create_styled_table(project_data, [2.5*inch, 3.5*inch])
                    story.append(table)
                    story.append(Spacer(1, 25))
            
            # CAMERA FORMATS SECTION with cool green background
            camera_formats = data.get('cameraFormats', [])
            if camera_formats:
                section_header = self._create_section_header("CAMERA FORMATS", colors.HexColor('#38a169'))
                story.append(KeepTogether([section_header]))
                story.append(Spacer(1, 10))
                
                for i, camera in enumerate(camera_formats, 1):
                    if any(self._should_include_field(camera.get(field)) for field in camera):
                        # Camera subsection header
                        subsection_style = ParagraphStyle(
                            'CameraSubsection',
                            fontSize=12,
                            spaceBefore=15,
                            spaceAfter=8,
                            textColor=colors.HexColor('#2d3748'),
                            fontName='Helvetica-Bold'
                        )
                        story.append(Paragraph(f"Camera {i}: {camera.get('cameraId', 'Unknown')}", subsection_style))
                        
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
                            table = self._create_styled_table(camera_data, [2*inch, 4*inch])
                            story.append(table)
                            story.append(Spacer(1, 15))
                
                story.append(Spacer(1, 10))
            
            # VFX PULLS SECTION with cool purple background
            vfx_pulls = data.get('vfxPulls', {})
            if any(self._should_include_field(vfx_pulls.get(field)) for field in vfx_pulls):
                section_header = self._create_section_header("VFX PULLS SPECIFICATIONS", colors.HexColor('#805ad5'))
                story.append(KeepTogether([section_header]))
                story.append(Spacer(1, 10))
                
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
                    table = self._create_styled_table(vfx_data, [2*inch, 4*inch])
                    story.append(table)
                    story.append(Spacer(1, 25))
            
            # MEDIA REVIEW SECTION with cool teal background
            media_review = data.get('mediaReview', {})
            if any(self._should_include_field(media_review.get(field)) for field in media_review):
                section_header = self._create_section_header("MEDIA REVIEW SPECIFICATIONS", colors.HexColor('#319795'))
                story.append(KeepTogether([section_header]))
                story.append(Spacer(1, 10))
                
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
                    table = self._create_styled_table(media_data, [2*inch, 4*inch])
                    story.append(table)
                    story.append(Spacer(1, 25))
            
            # VFX DELIVERIES SECTION with cool orange background
            vfx_deliveries = data.get('vfxDeliveries', {})
            if any(self._should_include_field(vfx_deliveries.get(field)) for field in vfx_deliveries):
                section_header = self._create_section_header("VFX DELIVERIES SPECIFICATIONS", colors.HexColor('#ed8936'))
                story.append(KeepTogether([section_header]))
                story.append(Spacer(1, 10))
                
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
                    table = self._create_styled_table(delivery_data, [2*inch, 4*inch])
                    story.append(table)
                    story.append(Spacer(1, 25))
            
            # Footer divider
            story.append(self._create_divider_line())
            
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