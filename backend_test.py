#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for VFX Specs Exchange
Focus: Template functionality testing as requested
"""

import asyncio
import aiohttp
import json
import sys
import os
from datetime import datetime
from typing import Dict, Any, List

# Get backend URL from frontend .env
BACKEND_URL = "https://42e63cd8-3b06-42e9-9562-2fa17d3779bd.preview.emergentagent.com/api"

class TemplateAPITester:
    def __init__(self):
        self.session = None
        self.created_template_ids = []
        self.test_results = []
        
    async def setup(self):
        """Setup test session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup(self):
        """Cleanup test session and created data"""
        # Clean up created templates
        for template_id in self.created_template_ids:
            try:
                await self.session.delete(f"{BACKEND_URL}/templates/{template_id}")
            except:
                pass
        
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
    
    def create_complex_vfx_data(self) -> Dict[str, Any]:
        """Create complex VFX specification data for testing"""
        return {
            "letterheadInfo": {
                "userCompanyName": "Industrial Light & Magic",
                "email": "vfx.supervisor@ilm.com",
                "address": "1110 Gorgas Ave, San Francisco, CA 94129",
                "website": "https://www.ilm.com",
                "logo": {
                    "dataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                    "width": 128,
                    "height": 64
                }
            },
            "projectInfo": {
                "documentVersion": "v2.1",
                "projectDate": "2025-01-15",
                "projectTitle": "Avatar: The Way of Water - Sequel",
                "projectCodeName": "PANDORA_2025",
                "projectFormat": "Feature Film",
                "client": "20th Century Studios",
                "director": "James Cameron",
                "dop": "Russell Carpenter",
                "productionCompany": "Lightstorm Entertainment",
                "postProductionSupervisor": "Dylan Highsmith",
                "lab": "Company 3",
                "colorist": "Stefan Sonnenfeld",
                "vfxSupervisor": "Joe Letteri",
                "vfxOnSetSupervisor": "Dan Lemmon",
                "vfxVendor": "Weta Digital",
                "vendorCodeName": "WETA_PANDORA",
                "vfxDocumentsLink": "https://secure.wetafx.co.nz/pandora2025",
                "projectFrameRate": "24fps",
                "colorScience": "ACES 1.3",
                "additionalNotes": "Underwater sequences require special attention to particle systems and caustics rendering."
            },
            "cameraFormats": [
                {
                    "id": 1,
                    "cameraId": "Camera A - Hero",
                    "sourceCamera": "Sony FX9",
                    "codec": "Sony XAVC-I",
                    "sensorMode": "Full Frame (4096 x 2160)",
                    "lensSqueezeeFactor": "1:1",
                    "colorSpace": "S-Log3/S-Gamut3.Cine"
                },
                {
                    "id": 2,
                    "cameraId": "Camera B - Underwater",
                    "sourceCamera": "RED V-Raptor XL",
                    "codec": "RED Raw (R3D)",
                    "sensorMode": "8K Full Format (8192 x 4320)",
                    "lensSqueezeeFactor": "1:1",
                    "colorSpace": "REDWideGamutRGB/Log3G10"
                }
            ],
            "vfxPulls": {
                "fileFormat": "OpenEXR",
                "compression": "PIZ",
                "resolution": "4096 x 2160",
                "colorSpace": "ACES2065-1",
                "bitDepth": "16-bit half float",
                "frameHandles": 24,
                "framePadding": "8 digits",
                "vfxLutsLink": "https://secure.wetafx.co.nz/pandora2025/luts",
                "showId": "AVATAR2025",
                "episode": "N/A",
                "sequence": "SEQ_010",
                "scene": "SC_010_020",
                "shotId": "AVT_010_020_0010",
                "plate": "hero_plate",
                "identifier": "main",
                "version": "v001"
            },
            "mediaReview": {
                "container": "QuickTime",
                "videoCodec": "ProRes 422 HQ",
                "resolution": "2048 x 1080",
                "aspectRatio": "2.39:1",
                "letterboxing": "Center Crop",
                "frameRate": "24fps",
                "colorSpace": "Rec.709",
                "slateOverlaysLink": "https://secure.wetafx.co.nz/pandora2025/slates"
            },
            "vfxDeliveries": {
                "showId": "AVATAR2025",
                "episode": "N/A",
                "sequence": "SEQ_010",
                "scene": "SC_010_020",
                "shotId": "AVT_010_020_0010",
                "task": "comp_final",
                "vendorCodeName": "WETA_PANDORA",
                "version": "v001"
            }
        }
    
    async def test_template_creation(self):
        """Test 1: Template Creation - POST /api/templates"""
        try:
            complex_data = self.create_complex_vfx_data()
            template_data = {
                "name": "Avatar 2025 VFX Template",
                "data": complex_data
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/templates",
                json=template_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    if "id" in result and "name" in result and "data" in result:
                        self.created_template_ids.append(result["id"])
                        self.log_test("Template Creation", True, f"Created template with ID: {result['id']}")
                        return result
                    else:
                        self.log_test("Template Creation", False, "Response missing required fields")
                        return None
                else:
                    error_text = await response.text()
                    self.log_test("Template Creation", False, f"HTTP {response.status}: {error_text}")
                    return None
        except Exception as e:
            self.log_test("Template Creation", False, f"Exception: {str(e)}")
            return None
    
    async def test_template_retrieval(self):
        """Test 2: Template Retrieval - GET /api/templates"""
        try:
            async with self.session.get(f"{BACKEND_URL}/templates") as response:
                if response.status == 200:
                    templates = await response.json()
                    if isinstance(templates, list):
                        template_count = len(templates)
                        has_created_templates = any(t["id"] in self.created_template_ids for t in templates)
                        self.log_test("Template Retrieval", True, f"Retrieved {template_count} templates, includes created: {has_created_templates}")
                        return templates
                    else:
                        self.log_test("Template Retrieval", False, "Response is not a list")
                        return None
                else:
                    error_text = await response.text()
                    self.log_test("Template Retrieval", False, f"HTTP {response.status}: {error_text}")
                    return None
        except Exception as e:
            self.log_test("Template Retrieval", False, f"Exception: {str(e)}")
            return None
    
    async def test_template_loading(self, template_id: str):
        """Test 3: Template Loading - GET /api/templates/{id}"""
        try:
            async with self.session.get(f"{BACKEND_URL}/templates/{template_id}") as response:
                if response.status == 200:
                    template = await response.json()
                    if "id" in template and "name" in template and "data" in template:
                        # Verify data integrity
                        data = template["data"]
                        has_letterhead = "letterheadInfo" in data
                        has_project_info = "projectInfo" in data
                        has_camera_formats = "cameraFormats" in data and len(data["cameraFormats"]) > 0
                        has_vfx_pulls = "vfxPulls" in data
                        has_media_review = "mediaReview" in data
                        has_vfx_deliveries = "vfxDeliveries" in data
                        
                        data_complete = all([has_letterhead, has_project_info, has_camera_formats, 
                                           has_vfx_pulls, has_media_review, has_vfx_deliveries])
                        
                        self.log_test("Template Loading", True, f"Loaded template {template_id}, data complete: {data_complete}")
                        return template
                    else:
                        self.log_test("Template Loading", False, "Template missing required fields")
                        return None
                else:
                    error_text = await response.text()
                    self.log_test("Template Loading", False, f"HTTP {response.status}: {error_text}")
                    return None
        except Exception as e:
            self.log_test("Template Loading", False, f"Exception: {str(e)}")
            return None
    
    async def test_template_deletion(self, template_id: str):
        """Test 4: Template Deletion - DELETE /api/templates/{id}"""
        try:
            async with self.session.delete(f"{BACKEND_URL}/templates/{template_id}") as response:
                if response.status == 200:
                    result = await response.json()
                    if "message" in result:
                        # Verify deletion by trying to get the template
                        async with self.session.get(f"{BACKEND_URL}/templates/{template_id}") as verify_response:
                            if verify_response.status == 404:
                                self.log_test("Template Deletion", True, f"Template {template_id} successfully deleted")
                                return True
                            else:
                                self.log_test("Template Deletion", False, "Template still exists after deletion")
                                return False
                    else:
                        self.log_test("Template Deletion", False, "Deletion response missing message")
                        return False
                else:
                    error_text = await response.text()
                    self.log_test("Template Deletion", False, f"HTTP {response.status}: {error_text}")
                    return False
        except Exception as e:
            self.log_test("Template Deletion", False, f"Exception: {str(e)}")
            return False
    
    async def test_data_integrity(self):
        """Test 5: Data Integrity Testing with Complex VFX Data"""
        try:
            # Create template with complex data
            complex_data = self.create_complex_vfx_data()
            template_data = {
                "name": "Data Integrity Test Template",
                "data": complex_data
            }
            
            # Create template
            async with self.session.post(
                f"{BACKEND_URL}/templates",
                json=template_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    created_template = await response.json()
                    template_id = created_template["id"]
                    self.created_template_ids.append(template_id)
                    
                    # Load template and verify data integrity
                    async with self.session.get(f"{BACKEND_URL}/templates/{template_id}") as load_response:
                        if load_response.status == 200:
                            loaded_template = await response.json()
                            loaded_data = loaded_template["data"]
                            
                            # Deep comparison of key fields
                            integrity_checks = [
                                loaded_data["letterheadInfo"]["userCompanyName"] == complex_data["letterheadInfo"]["userCompanyName"],
                                loaded_data["projectInfo"]["projectTitle"] == complex_data["projectInfo"]["projectTitle"],
                                len(loaded_data["cameraFormats"]) == len(complex_data["cameraFormats"]),
                                loaded_data["vfxPulls"]["fileFormat"] == complex_data["vfxPulls"]["fileFormat"],
                                loaded_data["mediaReview"]["videoCodec"] == complex_data["mediaReview"]["videoCodec"],
                                loaded_data["vfxDeliveries"]["shotId"] == complex_data["vfxDeliveries"]["shotId"]
                            ]
                            
                            all_checks_passed = all(integrity_checks)
                            self.log_test("Data Integrity", all_checks_passed, f"Integrity checks: {sum(integrity_checks)}/{len(integrity_checks)} passed")
                            return all_checks_passed
                        else:
                            self.log_test("Data Integrity", False, "Failed to load template for integrity check")
                            return False
                else:
                    self.log_test("Data Integrity", False, "Failed to create template for integrity test")
                    return False
        except Exception as e:
            self.log_test("Data Integrity", False, f"Exception: {str(e)}")
            return False
    
    async def test_edge_cases(self):
        """Test 6: Edge Cases"""
        edge_case_results = []
        
        # Test 6a: Empty data template
        try:
            minimal_template = {
                "name": "Minimal Template",
                "data": {}
            }
            async with self.session.post(
                f"{BACKEND_URL}/templates",
                json=minimal_template,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    self.created_template_ids.append(result["id"])
                    edge_case_results.append(True)
                    self.log_test("Edge Case - Empty Data", True, "Successfully created template with empty data")
                else:
                    edge_case_results.append(False)
                    self.log_test("Edge Case - Empty Data", False, f"Failed with status {response.status}")
        except Exception as e:
            edge_case_results.append(False)
            self.log_test("Edge Case - Empty Data", False, f"Exception: {str(e)}")
        
        # Test 6b: Special characters in template name
        try:
            special_char_template = {
                "name": "Template with Special Chars: @#$%^&*()_+-=[]{}|;':\",./<>?",
                "data": {"test": "data"}
            }
            async with self.session.post(
                f"{BACKEND_URL}/templates",
                json=special_char_template,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    result = await response.json()
                    self.created_template_ids.append(result["id"])
                    edge_case_results.append(True)
                    self.log_test("Edge Case - Special Characters", True, "Successfully created template with special characters")
                else:
                    edge_case_results.append(False)
                    self.log_test("Edge Case - Special Characters", False, f"Failed with status {response.status}")
        except Exception as e:
            edge_case_results.append(False)
            self.log_test("Edge Case - Special Characters", False, f"Exception: {str(e)}")
        
        # Test 6c: Invalid template ID
        try:
            async with self.session.get(f"{BACKEND_URL}/templates/invalid-id-12345") as response:
                if response.status == 404:
                    edge_case_results.append(True)
                    self.log_test("Edge Case - Invalid ID", True, "Correctly returned 404 for invalid template ID")
                else:
                    edge_case_results.append(False)
                    self.log_test("Edge Case - Invalid ID", False, f"Expected 404, got {response.status}")
        except Exception as e:
            edge_case_results.append(False)
            self.log_test("Edge Case - Invalid ID", False, f"Exception: {str(e)}")
        
        return all(edge_case_results)
    
    async def run_all_tests(self):
        """Run comprehensive template functionality tests"""
        print("🚀 Starting Template Functionality Testing")
        print("=" * 60)
        
        await self.setup()
        
        try:
            # Test 1: Template Creation
            created_template = await self.test_template_creation()
            
            # Test 2: Template Retrieval
            all_templates = await self.test_template_retrieval()
            
            # Test 3: Template Loading (if we have a created template)
            if created_template:
                await self.test_template_loading(created_template["id"])
            
            # Test 5: Data Integrity
            await self.test_data_integrity()
            
            # Test 6: Edge Cases
            await self.test_edge_cases()
            
            # Test 4: Template Deletion (test this last to clean up)
            if created_template:
                await self.test_template_deletion(created_template["id"])
                # Remove from cleanup list since we tested deletion
                if created_template["id"] in self.created_template_ids:
                    self.created_template_ids.remove(created_template["id"])
            
        finally:
            await self.cleanup()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed_tests = sum(1 for result in self.test_results if result["success"])
        total_tests = len(self.test_results)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if passed_tests == total_tests:
            print("\n🎉 ALL TEMPLATE TESTS PASSED!")
            return True
        else:
            print(f"\n⚠️  {total_tests - passed_tests} TESTS FAILED")
            print("\nFailed Tests:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['details']}")
            return False

async def main():
    """Main test execution"""
    tester = TemplateAPITester()
    success = await tester.run_all_tests()
    
    if success:
        print("\n✅ Template functionality is working correctly!")
        sys.exit(0)
    else:
        print("\n❌ Template functionality has issues that need attention!")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())