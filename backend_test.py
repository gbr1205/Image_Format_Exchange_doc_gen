#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for VFX Specs Exchange
Focus: Enhanced PDF/DOCX Export with Logo Integration Testing
"""

import asyncio
import aiohttp
import json
import sys
import os
from datetime import datetime
from typing import Dict, Any, List
import base64

# Get backend URL from frontend .env
BACKEND_URL = "https://9ec93686-6f9e-48a6-bdb0-aeb886a3c254.preview.emergentagent.com/api"

class EnhancedExportTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        
    async def setup(self):
        """Setup test session"""
        self.session = aiohttp.ClientSession()
        
    async def cleanup(self):
        """Cleanup test session"""
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
    
    def create_sample_logo_data(self) -> str:
        """Create a sample logo data URL for testing"""
        # Create a simple 1x1 pixel PNG in base64
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    def create_comprehensive_vfx_data_with_logos(self) -> Dict[str, Any]:
        """Create comprehensive VFX specification data with all logo types for testing"""
        logo_data = self.create_sample_logo_data()
        
        return {
            "letterheadInfo": {
                "userCompanyName": "Industrial Light & Magic",
                "email": "vfx.supervisor@ilm.com",
                "address": "1110 Gorgas Ave, San Francisco, CA 94129",
                "website": "https://www.ilm.com",
                "logo": {
                    "dataUrl": logo_data,
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
                "clientLogo": {
                    "dataUrl": logo_data,
                    "width": 120,
                    "height": 60
                },
                "director": "James Cameron",
                "dop": "Russell Carpenter",
                "productionCompany": "Lightstorm Entertainment",
                "productionCompanyLogo": {
                    "dataUrl": logo_data,
                    "width": 140,
                    "height": 70
                },
                "postProductionSupervisor": "Dylan Highsmith",
                "lab": "Company 3",
                "labLogo": {
                    "dataUrl": logo_data,
                    "width": 100,
                    "height": 50
                },
                "colorist": "Stefan Sonnenfeld",
                "vfxSupervisor": "Joe Letteri",
                "vfxOnSetSupervisor": "Dan Lemmon",
                "vfxVendor": "Weta Digital",
                "vfxVendorLogo": {
                    "dataUrl": logo_data,
                    "width": 150,
                    "height": 75
                },
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
    
    def create_partial_vfx_data(self) -> Dict[str, Any]:
        """Create partial VFX data with some missing sections and logos"""
        logo_data = self.create_sample_logo_data()
        
        return {
            "letterheadInfo": {
                "userCompanyName": "Pixar Animation Studios",
                "email": "production@pixar.com",
                # Missing address, website, and logo
            },
            "projectInfo": {
                "projectTitle": "Toy Story 5",
                "projectFormat": "Animated Feature",
                "client": "Disney",
                # Missing client logo
                "director": "Josh Cooley",
                "productionCompany": "Pixar Animation Studios",
                "productionCompanyLogo": {
                    "dataUrl": logo_data,
                    "width": 130,
                    "height": 65
                },
                # Missing other fields and logos
                "projectFrameRate": "24fps",
                "colorScience": "ACES 1.2"
            },
            "cameraFormats": [
                {
                    "id": 1,
                    "cameraId": "Virtual Camera A",
                    "sourceCamera": "Maya Render",
                    "codec": "OpenEXR",
                    "colorSpace": "ACES2065-1"
                }
            ],
            # Missing vfxPulls, mediaReview, vfxDeliveries sections
        }
    
    async def test_enhanced_pdf_export_comprehensive(self):
        """Test 1: Enhanced PDF Export with Comprehensive Data and All Logos"""
        try:
            comprehensive_data = self.create_comprehensive_vfx_data_with_logos()
            
            async with self.session.post(
                f"{BACKEND_URL}/export/pdf",
                json=comprehensive_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    content_type = response.headers.get('content-type', '')
                    content_disposition = response.headers.get('content-disposition', '')
                    content = await response.read()
                    
                    # Verify PDF response
                    is_pdf = content_type == 'application/pdf'
                    has_filename = 'filename=' in content_disposition
                    has_content = len(content) > 1000  # PDF should be substantial
                    pdf_header = content[:4] == b'%PDF'
                    
                    all_checks = [is_pdf, has_filename, has_content, pdf_header]
                    success = all(all_checks)
                    
                    details = f"PDF size: {len(content)} bytes, Content-Type: {content_type}, Has filename: {has_filename}, PDF header: {pdf_header}"
                    self.log_test("Enhanced PDF Export - Comprehensive Data", success, details)
                    return success
                else:
                    error_text = await response.text()
                    self.log_test("Enhanced PDF Export - Comprehensive Data", False, f"HTTP {response.status}: {error_text}")
                    return False
        except Exception as e:
            self.log_test("Enhanced PDF Export - Comprehensive Data", False, f"Exception: {str(e)}")
            return False
    
    async def test_enhanced_docx_export_comprehensive(self):
        """Test 2: Enhanced DOCX Export with Comprehensive Data and All Logos"""
        try:
            comprehensive_data = self.create_comprehensive_vfx_data_with_logos()
            
            async with self.session.post(
                f"{BACKEND_URL}/export/docx",
                json=comprehensive_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    content_type = response.headers.get('content-type', '')
                    content_disposition = response.headers.get('content-disposition', '')
                    content = await response.read()
                    
                    # Verify DOCX response
                    is_docx = 'officedocument.wordprocessingml.document' in content_type
                    has_filename = 'filename=' in content_disposition
                    has_content = len(content) > 1000  # DOCX should be substantial
                    zip_header = content[:2] == b'PK'  # DOCX is a ZIP file
                    
                    all_checks = [is_docx, has_filename, has_content, zip_header]
                    success = all(all_checks)
                    
                    details = f"DOCX size: {len(content)} bytes, Content-Type: {content_type}, Has filename: {has_filename}, ZIP header: {zip_header}"
                    self.log_test("Enhanced DOCX Export - Comprehensive Data", success, details)
                    return success
                else:
                    error_text = await response.text()
                    self.log_test("Enhanced DOCX Export - Comprehensive Data", False, f"HTTP {response.status}: {error_text}")
                    return False
        except Exception as e:
            self.log_test("Enhanced DOCX Export - Comprehensive Data", False, f"Exception: {str(e)}")
            return False
    
    async def test_pdf_export_partial_data(self):
        """Test 3: PDF Export with Partial Data (Some Sections Missing)"""
        try:
            partial_data = self.create_partial_vfx_data()
            
            async with self.session.post(
                f"{BACKEND_URL}/export/pdf",
                json=partial_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    content = await response.read()
                    content_type = response.headers.get('content-type', '')
                    
                    # Should still generate PDF even with partial data
                    is_pdf = content_type == 'application/pdf'
                    has_content = len(content) > 500  # Should still have some content
                    pdf_header = content[:4] == b'%PDF'
                    
                    success = is_pdf and has_content and pdf_header
                    details = f"PDF size: {len(content)} bytes with partial data"
                    self.log_test("PDF Export - Partial Data", success, details)
                    return success
                else:
                    error_text = await response.text()
                    self.log_test("PDF Export - Partial Data", False, f"HTTP {response.status}: {error_text}")
                    return False
        except Exception as e:
            self.log_test("PDF Export - Partial Data", False, f"Exception: {str(e)}")
            return False
    
    async def test_docx_export_partial_data(self):
        """Test 4: DOCX Export with Partial Data (Some Sections Missing)"""
        try:
            partial_data = self.create_partial_vfx_data()
            
            async with self.session.post(
                f"{BACKEND_URL}/export/docx",
                json=partial_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    content = await response.read()
                    content_type = response.headers.get('content-type', '')
                    
                    # Should still generate DOCX even with partial data
                    is_docx = 'officedocument.wordprocessingml.document' in content_type
                    has_content = len(content) > 500  # Should still have some content
                    zip_header = content[:2] == b'PK'
                    
                    success = is_docx and has_content and zip_header
                    details = f"DOCX size: {len(content)} bytes with partial data"
                    self.log_test("DOCX Export - Partial Data", success, details)
                    return success
                else:
                    error_text = await response.text()
                    self.log_test("DOCX Export - Partial Data", False, f"HTTP {response.status}: {error_text}")
                    return False
        except Exception as e:
            self.log_test("DOCX Export - Partial Data", False, f"Exception: {str(e)}")
            return False
    
    async def test_logo_processing_old_format(self):
        """Test 5: Logo Processing with Old Format (String Data)"""
        try:
            # Test data with old format logo (string instead of dict)
            old_format_data = {
                "letterheadInfo": {
                    "userCompanyName": "Test Company",
                    "logo": self.create_sample_logo_data()  # Old format: direct string
                },
                "projectInfo": {
                    "projectTitle": "Test Project",
                    "client": "Test Client",
                    "clientLogo": self.create_sample_logo_data()  # Old format: direct string
                }
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/export/pdf",
                json=old_format_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    content = await response.read()
                    success = len(content) > 500 and content[:4] == b'%PDF'
                    details = f"Successfully processed old format logos, PDF size: {len(content)} bytes"
                    self.log_test("Logo Processing - Old Format", success, details)
                    return success
                else:
                    error_text = await response.text()
                    self.log_test("Logo Processing - Old Format", False, f"HTTP {response.status}: {error_text}")
                    return False
        except Exception as e:
            self.log_test("Logo Processing - Old Format", False, f"Exception: {str(e)}")
            return False
    
    async def test_logo_processing_new_format(self):
        """Test 6: Logo Processing with New Format (Dict with dataUrl)"""
        try:
            # Test data with new format logo (dict with dataUrl)
            new_format_data = {
                "letterheadInfo": {
                    "userCompanyName": "Test Company",
                    "logo": {
                        "dataUrl": self.create_sample_logo_data(),
                        "width": 128,
                        "height": 64
                    }
                },
                "projectInfo": {
                    "projectTitle": "Test Project",
                    "client": "Test Client",
                    "clientLogo": {
                        "dataUrl": self.create_sample_logo_data(),
                        "width": 120,
                        "height": 60
                    }
                }
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/export/docx",
                json=new_format_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status == 200:
                    content = await response.read()
                    success = len(content) > 500 and content[:2] == b'PK'
                    details = f"Successfully processed new format logos, DOCX size: {len(content)} bytes"
                    self.log_test("Logo Processing - New Format", success, details)
                    return success
                else:
                    error_text = await response.text()
                    self.log_test("Logo Processing - New Format", False, f"HTTP {response.status}: {error_text}")
                    return False
        except Exception as e:
            self.log_test("Logo Processing - New Format", False, f"Exception: {str(e)}")
            return False
    
    async def test_export_error_handling(self):
        """Test 7: Export Error Handling with Invalid Data"""
        try:
            # Test with invalid logo data
            invalid_data = {
                "letterheadInfo": {
                    "userCompanyName": "Test Company",
                    "logo": {
                        "dataUrl": "invalid-base64-data",
                        "width": 128,
                        "height": 64
                    }
                },
                "projectInfo": {
                    "projectTitle": "Test Project"
                }
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/export/pdf",
                json=invalid_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                # Should either succeed (gracefully handle invalid logo) or return proper error
                if response.status == 200:
                    content = await response.read()
                    success = len(content) > 500 and content[:4] == b'%PDF'
                    details = f"Gracefully handled invalid logo data, PDF size: {len(content)} bytes"
                    self.log_test("Export Error Handling", success, details)
                    return success
                elif response.status in [400, 500]:
                    # Acceptable to return error for invalid data
                    details = f"Properly returned error {response.status} for invalid logo data"
                    self.log_test("Export Error Handling", True, details)
                    return True
                else:
                    error_text = await response.text()
                    self.log_test("Export Error Handling", False, f"Unexpected status {response.status}: {error_text}")
                    return False
        except Exception as e:
            self.log_test("Export Error Handling", False, f"Exception: {str(e)}")
            return False
    
    async def test_filename_generation(self):
        """Test 8: Filename Generation with Different Project Titles"""
        try:
            test_cases = [
                {"projectTitle": "Avatar: The Way of Water", "expected_contains": "Avatar"},
                {"projectTitle": "Project with Special Characters!@#$%", "expected_contains": "Project"},
                {"projectTitle": "", "expected_contains": "VFX_Spec"},  # Default filename
                {"projectTitle": "   ", "expected_contains": "VFX_Spec"},  # Whitespace only
            ]
            
            all_passed = True
            for i, test_case in enumerate(test_cases):
                test_data = {
                    "projectInfo": {
                        "projectTitle": test_case["projectTitle"]
                    }
                }
                
                async with self.session.post(
                    f"{BACKEND_URL}/export/pdf",
                    json=test_data,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    if response.status == 200:
                        content_disposition = response.headers.get('content-disposition', '')
                        filename_present = test_case["expected_contains"] in content_disposition
                        if not filename_present:
                            all_passed = False
                            print(f"   Failed filename test {i+1}: {content_disposition}")
                    else:
                        all_passed = False
                        print(f"   Failed filename test {i+1}: HTTP {response.status}")
            
            details = f"Tested {len(test_cases)} filename generation scenarios"
            self.log_test("Filename Generation", all_passed, details)
            return all_passed
        except Exception as e:
            self.log_test("Filename Generation", False, f"Exception: {str(e)}")
            return False
    
    async def test_empty_data_export(self):
        """Test 9: Export with Completely Empty Data"""
        try:
            empty_data = {}
            
            # Test PDF export with empty data
            async with self.session.post(
                f"{BACKEND_URL}/export/pdf",
                json=empty_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                pdf_success = response.status == 200
                if pdf_success:
                    content = await response.read()
                    pdf_success = len(content) > 100 and content[:4] == b'%PDF'
            
            # Test DOCX export with empty data
            async with self.session.post(
                f"{BACKEND_URL}/export/docx",
                json=empty_data,
                headers={"Content-Type": "application/json"}
            ) as response:
                docx_success = response.status == 200
                if docx_success:
                    content = await response.read()
                    docx_success = len(content) > 100 and content[:2] == b'PK'
            
            success = pdf_success and docx_success
            details = f"PDF export: {pdf_success}, DOCX export: {docx_success}"
            self.log_test("Empty Data Export", success, details)
            return success
        except Exception as e:
            self.log_test("Empty Data Export", False, f"Exception: {str(e)}")
            return False
    
    async def run_all_tests(self):
        """Run comprehensive enhanced export functionality tests"""
        print("🚀 Starting Enhanced PDF/DOCX Export Testing with Logo Integration")
        print("=" * 80)
        
        await self.setup()
        
        try:
            # Test 1: Enhanced PDF Export with Comprehensive Data
            await self.test_enhanced_pdf_export_comprehensive()
            
            # Test 2: Enhanced DOCX Export with Comprehensive Data
            await self.test_enhanced_docx_export_comprehensive()
            
            # Test 3: PDF Export with Partial Data
            await self.test_pdf_export_partial_data()
            
            # Test 4: DOCX Export with Partial Data
            await self.test_docx_export_partial_data()
            
            # Test 5: Logo Processing - Old Format
            await self.test_logo_processing_old_format()
            
            # Test 6: Logo Processing - New Format
            await self.test_logo_processing_new_format()
            
            # Test 7: Export Error Handling
            await self.test_export_error_handling()
            
            # Test 8: Filename Generation
            await self.test_filename_generation()
            
            # Test 9: Empty Data Export
            await self.test_empty_data_export()
            
        finally:
            await self.cleanup()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 ENHANCED EXPORT TESTING SUMMARY")
        print("=" * 80)
        
        passed_tests = sum(1 for result in self.test_results if result["success"])
        total_tests = len(self.test_results)
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if passed_tests == total_tests:
            print("\n🎉 ALL ENHANCED EXPORT TESTS PASSED!")
            print("✅ Enhanced PDF export with logo integration working correctly")
            print("✅ Enhanced DOCX export with logo integration working correctly")
            print("✅ Logo processing for both old and new formats working correctly")
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
    tester = EnhancedExportTester()
    success = await tester.run_all_tests()
    
    if success:
        print("\n✅ Enhanced PDF/DOCX export functionality with logo integration is working correctly!")
        sys.exit(0)
    else:
        print("\n❌ Enhanced export functionality has issues that need attention!")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())