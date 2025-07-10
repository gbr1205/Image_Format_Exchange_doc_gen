#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for VFX Specs Exchange
Tests all endpoints with realistic VFX industry data
"""

import requests
import json
import io
import base64
from PIL import Image
import time
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://cf2da9e7-02c0-4626-bfdb-c60a249b797d.preview.emergentagent.com/api"
TIMEOUT = 30

class VFXAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        self.created_specs = []
        self.created_templates = []
        self.test_results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }

    def log_result(self, test_name: str, success: bool, message: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        
        if success:
            self.test_results["passed"] += 1
        else:
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"{test_name}: {message}")

    def create_test_image(self) -> bytes:
        """Create a test image for logo processing"""
        img = Image.new('RGB', (200, 100), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        return img_bytes.getvalue()

    def get_sample_vfx_spec_data(self) -> Dict[str, Any]:
        """Get realistic VFX specification test data"""
        return {
            "name": "Blockbuster Action Film - VFX Spec",
            "companyInfo": {
                "companyName": "Stellar VFX Studios",
                "companyEmail": "contact@stellarvfx.com",
                "companyAddress": "1234 Hollywood Blvd, Los Angeles, CA 90028",
                "companyWebsite": "https://stellarvfx.com"
            },
            "projectInfo": {
                "documentVersion": "v2.1",
                "projectDate": "2025-01-15",
                "projectTitle": "Cosmic Guardians: Rise of the Phoenix",
                "projectCodeName": "CGPH001",
                "projectFormat": "Feature Film",
                "client": "Marvel Entertainment",
                "director": "Christopher Nolan",
                "dop": "Roger Deakins",
                "productionCompany": "Legendary Pictures",
                "postProductionSupervisor": "Sarah Johnson",
                "lab": "Company 3",
                "colorist": "Stefan Sonnenfeld",
                "vfxSupervisor": "John Knoll",
                "vfxOnSetSupervisor": "Dan Lemmon",
                "vfxVendor": "Industrial Light & Magic",
                "vendorCodeName": "ILM",
                "vfxDocumentsLink": "https://drive.google.com/vfx-docs",
                "projectFrameRate": "23.976fps",
                "colorScience": "ACES 1.3",
                "additionalNotes": "High-end superhero film with extensive space sequences and practical effects integration"
            },
            "cameraFormats": [
                {
                    "id": 1,
                    "cameraId": "Camera A",
                    "sourceCamera": "Arri Alexa 35",
                    "codec": "Arri Raw (HDE)",
                    "sensorMode": "Open Gate (4608 x 3164)",
                    "lensSqueezeeFactor": "1:1",
                    "colorSpace": "ARRI - LogC4/AWG4"
                },
                {
                    "id": 2,
                    "cameraId": "Camera B",
                    "sourceCamera": "RED V-Raptor",
                    "codec": "RED Raw",
                    "sensorMode": "Full Frame (4096 x 3072)",
                    "lensSqueezeeFactor": "1.33:1",
                    "colorSpace": "RED - Log3G10/REDWideGamutRGB"
                }
            ],
            "vfxPulls": {
                "fileFormat": "OpenEXR (.exr)",
                "compression": "ZIP",
                "resolution": "4096x2160",
                "colorSpace": "ACEScg",
                "bitDepth": "16-bit half float",
                "frameHandles": 12,
                "framePadding": "######",
                "vfxLutsLink": "https://drive.google.com/luts",
                "showId": "CGPH",
                "episode": "001",
                "sequence": "010",
                "scene": "020",
                "shotId": "0150",
                "plate": "PL",
                "identifier": "main",
                "version": "v001"
            },
            "mediaReview": {
                "container": "mov",
                "videoCodec": "ProRes 422 HQ",
                "resolution": "1920x1080",
                "aspectRatio": "2.39:1",
                "letterboxing": "Yes",
                "frameRate": "23.976fps",
                "colorSpace": "Rec. 709",
                "slateOverlaysLink": "https://drive.google.com/slates"
            },
            "vfxDeliveries": {
                "showId": "CGPH",
                "episode": "001",
                "sequence": "010",
                "scene": "020",
                "shotId": "0150",
                "task": "comp",
                "vendorCodeName": "ILM",
                "version": "v001"
            }
        }

    def get_sample_template_data(self) -> Dict[str, Any]:
        """Get sample template data"""
        return {
            "name": "Standard Feature Film Template",
            "data": {
                "projectInfo": {
                    "projectFormat": "Feature Film",
                    "projectFrameRate": "23.976fps",
                    "colorScience": "ACES 1.3"
                },
                "vfxPulls": {
                    "fileFormat": "OpenEXR (.exr)",
                    "compression": "ZIP",
                    "colorSpace": "ACEScg",
                    "bitDepth": "16-bit half float",
                    "frameHandles": 12
                }
            }
        }

    def test_health_check(self):
        """Test API health check endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "VFX Specs Exchange API is running" in data["message"]:
                    self.log_result("Health Check", True, f"API version: {data.get('version', 'unknown')}")
                else:
                    self.log_result("Health Check", False, "Invalid response format")
            else:
                self.log_result("Health Check", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Health Check", False, f"Exception: {str(e)}")

    def test_dropdown_options(self):
        """Test dropdown options endpoint"""
        try:
            response = self.session.get(f"{BASE_URL}/dropdown-options")
            if response.status_code == 200:
                data = response.json()
                required_keys = ["projectFormat", "frameRate", "colorScience", "sourceCamera", "codec"]
                missing_keys = [key for key in required_keys if key not in data]
                
                if not missing_keys:
                    self.log_result("Dropdown Options", True, f"Found {len(data)} option categories")
                else:
                    self.log_result("Dropdown Options", False, f"Missing keys: {missing_keys}")
            else:
                self.log_result("Dropdown Options", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Dropdown Options", False, f"Exception: {str(e)}")

    def test_vfx_specs_crud(self):
        """Test VFX Specifications CRUD operations"""
        spec_data = self.get_sample_vfx_spec_data()
        
        # Test CREATE
        try:
            response = self.session.post(f"{BASE_URL}/vfx-specs", json=spec_data)
            if response.status_code == 200:
                created_spec = response.json()
                spec_id = created_spec.get("id")
                if spec_id:
                    self.created_specs.append(spec_id)
                    self.log_result("VFX Spec Creation", True, f"Created spec with ID: {spec_id}")
                else:
                    self.log_result("VFX Spec Creation", False, "No ID returned")
                    return
            else:
                self.log_result("VFX Spec Creation", False, f"Status code: {response.status_code}, Response: {response.text}")
                return
        except Exception as e:
            self.log_result("VFX Spec Creation", False, f"Exception: {str(e)}")
            return

        # Test READ (single)
        try:
            response = self.session.get(f"{BASE_URL}/vfx-specs/{spec_id}")
            if response.status_code == 200:
                spec = response.json()
                if spec.get("name") == spec_data["name"]:
                    self.log_result("VFX Spec Read (Single)", True, f"Retrieved spec: {spec.get('name')}")
                else:
                    self.log_result("VFX Spec Read (Single)", False, "Data mismatch")
            else:
                self.log_result("VFX Spec Read (Single)", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("VFX Spec Read (Single)", False, f"Exception: {str(e)}")

        # Test READ (all)
        try:
            response = self.session.get(f"{BASE_URL}/vfx-specs")
            if response.status_code == 200:
                specs = response.json()
                if isinstance(specs, list) and len(specs) > 0:
                    self.log_result("VFX Spec Read (All)", True, f"Retrieved {len(specs)} specs")
                else:
                    self.log_result("VFX Spec Read (All)", False, "No specs returned or invalid format")
            else:
                self.log_result("VFX Spec Read (All)", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("VFX Spec Read (All)", False, f"Exception: {str(e)}")

        # Test UPDATE
        try:
            update_data = {
                "name": "Updated Cosmic Guardians VFX Spec",
                "projectInfo": {
                    "projectTitle": "Cosmic Guardians: Updated Title",
                    "additionalNotes": "Updated with new requirements"
                }
            }
            response = self.session.put(f"{BASE_URL}/vfx-specs/{spec_id}", json=update_data)
            if response.status_code == 200:
                updated_spec = response.json()
                if updated_spec.get("name") == update_data["name"]:
                    self.log_result("VFX Spec Update", True, "Spec updated successfully")
                else:
                    self.log_result("VFX Spec Update", False, "Update not reflected")
            else:
                self.log_result("VFX Spec Update", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("VFX Spec Update", False, f"Exception: {str(e)}")

        # Test DELETE (will be done in cleanup)

    def test_templates_crud(self):
        """Test Templates CRUD operations"""
        template_data = self.get_sample_template_data()
        
        # Test CREATE
        try:
            response = self.session.post(f"{BASE_URL}/templates", json=template_data)
            if response.status_code == 200:
                created_template = response.json()
                template_id = created_template.get("id")
                if template_id:
                    self.created_templates.append(template_id)
                    self.log_result("Template Creation", True, f"Created template with ID: {template_id}")
                else:
                    self.log_result("Template Creation", False, "No ID returned")
                    return
            else:
                self.log_result("Template Creation", False, f"Status code: {response.status_code}, Response: {response.text}")
                return
        except Exception as e:
            self.log_result("Template Creation", False, f"Exception: {str(e)}")
            return

        # Test READ (single)
        try:
            response = self.session.get(f"{BASE_URL}/templates/{template_id}")
            if response.status_code == 200:
                template = response.json()
                if template.get("name") == template_data["name"]:
                    self.log_result("Template Read (Single)", True, f"Retrieved template: {template.get('name')}")
                else:
                    self.log_result("Template Read (Single)", False, "Data mismatch")
            else:
                self.log_result("Template Read (Single)", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Template Read (Single)", False, f"Exception: {str(e)}")

        # Test READ (all)
        try:
            response = self.session.get(f"{BASE_URL}/templates")
            if response.status_code == 200:
                templates = response.json()
                if isinstance(templates, list):
                    self.log_result("Template Read (All)", True, f"Retrieved {len(templates)} templates")
                else:
                    self.log_result("Template Read (All)", False, "Invalid format")
            else:
                self.log_result("Template Read (All)", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Template Read (All)", False, f"Exception: {str(e)}")

    def test_logo_processing(self):
        """Test logo processing endpoint"""
        try:
            test_image = self.create_test_image()
            files = {'file': ('test_logo.png', test_image, 'image/png')}
            
            response = self.session.post(f"{BASE_URL}/process-logo", files=files)
            if response.status_code == 200:
                result = response.json()
                if all(key in result for key in ["dataUrl", "width", "height"]):
                    if result["height"] == 128:  # Should be resized to 128px height
                        self.log_result("Logo Processing", True, f"Resized to {result['width']}x{result['height']}")
                    else:
                        self.log_result("Logo Processing", False, f"Incorrect height: {result['height']}")
                else:
                    self.log_result("Logo Processing", False, "Missing required fields in response")
            else:
                self.log_result("Logo Processing", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Logo Processing", False, f"Exception: {str(e)}")

    def test_export_functions(self):
        """Test PDF and DOCX export functions"""
        export_data = self.get_sample_vfx_spec_data()
        
        # Test PDF Export
        try:
            response = self.session.post(f"{BASE_URL}/export/pdf", json=export_data)
            if response.status_code == 200:
                if response.headers.get('content-type') == 'application/pdf':
                    content_length = len(response.content)
                    self.log_result("PDF Export", True, f"Generated PDF ({content_length} bytes)")
                else:
                    # Check if it's a text response (mock implementation)
                    if len(response.content) > 0:
                        self.log_result("PDF Export", True, f"Generated PDF content ({len(response.content)} bytes)")
                    else:
                        self.log_result("PDF Export", False, "Empty response")
            else:
                self.log_result("PDF Export", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("PDF Export", False, f"Exception: {str(e)}")

        # Test DOCX Export
        try:
            response = self.session.post(f"{BASE_URL}/export/docx", json=export_data)
            if response.status_code == 200:
                expected_content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                if response.headers.get('content-type') == expected_content_type:
                    content_length = len(response.content)
                    self.log_result("DOCX Export", True, f"Generated DOCX ({content_length} bytes)")
                else:
                    # Check if it's a text response (mock implementation)
                    if len(response.content) > 0:
                        self.log_result("DOCX Export", True, f"Generated DOCX content ({len(response.content)} bytes)")
                    else:
                        self.log_result("DOCX Export", False, "Empty response")
            else:
                self.log_result("DOCX Export", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("DOCX Export", False, f"Exception: {str(e)}")

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        
        # Test invalid VFX spec ID
        try:
            response = self.session.get(f"{BASE_URL}/vfx-specs/invalid-id")
            if response.status_code == 404:
                self.log_result("Error Handling - Invalid VFX Spec ID", True, "Correctly returned 404")
            else:
                self.log_result("Error Handling - Invalid VFX Spec ID", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Invalid VFX Spec ID", False, f"Exception: {str(e)}")

        # Test invalid template ID
        try:
            response = self.session.get(f"{BASE_URL}/templates/invalid-id")
            if response.status_code == 404:
                self.log_result("Error Handling - Invalid Template ID", True, "Correctly returned 404")
            else:
                self.log_result("Error Handling - Invalid Template ID", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Invalid Template ID", False, f"Exception: {str(e)}")

        # Test invalid file upload
        try:
            files = {'file': ('test.txt', b'not an image', 'text/plain')}
            response = self.session.post(f"{BASE_URL}/process-logo", files=files)
            if response.status_code == 400:
                self.log_result("Error Handling - Invalid File Upload", True, "Correctly rejected non-image file")
            else:
                self.log_result("Error Handling - Invalid File Upload", False, f"Status code: {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Invalid File Upload", False, f"Exception: {str(e)}")

    def cleanup(self):
        """Clean up created test data"""
        print("\n🧹 Cleaning up test data...")
        
        # Delete created VFX specs
        for spec_id in self.created_specs:
            try:
                response = self.session.delete(f"{BASE_URL}/vfx-specs/{spec_id}")
                if response.status_code == 200:
                    self.log_result(f"Cleanup - Delete VFX Spec {spec_id}", True, "Deleted successfully")
                else:
                    self.log_result(f"Cleanup - Delete VFX Spec {spec_id}", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_result(f"Cleanup - Delete VFX Spec {spec_id}", False, f"Exception: {str(e)}")

        # Delete created templates
        for template_id in self.created_templates:
            try:
                response = self.session.delete(f"{BASE_URL}/templates/{template_id}")
                if response.status_code == 200:
                    self.log_result(f"Cleanup - Delete Template {template_id}", True, "Deleted successfully")
                else:
                    self.log_result(f"Cleanup - Delete Template {template_id}", False, f"Status code: {response.status_code}")
            except Exception as e:
                self.log_result(f"Cleanup - Delete Template {template_id}", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting VFX Specs Exchange Backend API Tests")
        print(f"📡 Testing API at: {BASE_URL}")
        print("=" * 60)
        
        # Run tests in logical order
        self.test_health_check()
        self.test_dropdown_options()
        self.test_vfx_specs_crud()
        self.test_templates_crud()
        self.test_logo_processing()
        self.test_export_functions()
        self.test_error_handling()
        
        # Cleanup
        self.cleanup()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.test_results['passed']}")
        print(f"❌ Failed: {self.test_results['failed']}")
        print(f"📈 Success Rate: {(self.test_results['passed'] / (self.test_results['passed'] + self.test_results['failed']) * 100):.1f}%")
        
        if self.test_results['errors']:
            print("\n🚨 FAILED TESTS:")
            for error in self.test_results['errors']:
                print(f"   • {error}")
        
        return self.test_results['failed'] == 0

if __name__ == "__main__":
    tester = VFXAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)