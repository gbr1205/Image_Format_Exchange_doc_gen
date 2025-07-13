# 📁 File Paths & Storage Guide

## Download and Save Locations for VFX Specs Application

### 🔵 **PDF/DOCX Downloads**

**Download Location:** Browser's default download folder

**Default Paths by Operating System:**
- **Windows**: `C:\Users\[Username]\Downloads\`
- **macOS**: `/Users/[Username]/Downloads/`
- **Linux**: `/home/[Username]/Downloads/`

**Filename Format:**
```
[ProjectTitle]_VFX_Spec_[YYYYMMDD_HHMMSS].[pdf|docx]

Examples:
- Avengers_Project_VFX_Spec_20241215_143052.pdf
- Marvel_Movie_VFX_Spec_20241215_143052.docx
- VFX_Spec_20241215_143052.pdf (if no project title)
```

**How Downloads Work:**
1. User clicks "Export PDF" or "Export DOCX"
2. Backend generates file in memory
3. File is streamed to browser
4. Browser automatically downloads to default download folder
5. No server-side file storage (security best practice)

---

### 🔵 **Templates Storage**

**Storage Type:** MongoDB Database

**Database Configuration:**
- **Host**: `localhost:27017` (local) or MongoDB Atlas URL (cloud)
- **Database**: `test_database` (configurable in `backend/.env`)
- **Collection**: `templates`

**Storage Path (Database):**
```
MongoDB Database: test_database
├── Collection: templates
│   ├── Document 1: {id, name, data, createdAt}
│   ├── Document 2: {id, name, data, createdAt}
│   └── Document N: {id, name, data, createdAt}
└── Collection: vfx_specs (if saving specs)
```

**Template Document Structure:**
```json
{
  "_id": "ObjectId('...')",
  "name": "Studio Standard Setup",
  "data": {
    "letterheadInfo": {...},
    "projectInfo": {...},
    "cameraFormats": [...],
    "vfxPulls": {...},
    "mediaReview": {...},
    "vfxDeliveries": {...}
  },
  "createdAt": "2024-12-15T14:30:52.123Z"
}
```

---

### 🔵 **Configuration Files**

**Backend Environment (`.env` file):**
```bash
Location: /app/backend/.env

MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
```

**Frontend Environment (`.env` file):**
```bash
Location: /app/frontend/.env

REACT_APP_BACKEND_URL=http://localhost:8001
```

---

### 🔵 **Changing Download/Save Locations**

#### **📂 Change PDF/DOCX Download Location**

**Browser Settings Method:**
1. **Chrome**: Settings → Advanced → Downloads → Change location
2. **Firefox**: Settings → General → Downloads → Save files to
3. **Safari**: Preferences → General → File download location
4. **Edge**: Settings → Downloads → Change location

**Programmatic Method (Advanced):**
- Downloads are handled by browser - cannot be changed programmatically
- Files are streamed from backend with `Content-Disposition: attachment` header
- Browser's download settings determine final location

#### **📂 Change Template Storage Location**

**Option 1: Different MongoDB Database**
```bash
# Edit backend/.env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="vfx_production_db"  # Change database name
```

**Option 2: Cloud MongoDB (MongoDB Atlas)**
```bash
# Edit backend/.env
MONGO_URL="mongodb+srv://username:password@cluster.mongodb.net/"
DB_NAME="vfx_templates"
```

**Option 3: Different MongoDB Server**
```bash
# Edit backend/.env
MONGO_URL="mongodb://your-server:27017"
DB_NAME="vfx_specs"
```

#### **📂 Change Logo Upload Storage**

**Current**: Logos are stored as base64 in database (embedded in templates/specs)

**Alternative File Storage** (requires code changes):
```python
# In backend/server.py - modify logo processing
UPLOAD_DIR = "./uploads/logos/"  # Local file storage
# or
UPLOAD_DIR = "/shared/storage/logos/"  # Network storage
```

---

### 🔵 **File Size & Storage Limits**

**PDF/DOCX Files:**
- **No local storage** (files generated in memory)
- **Download size**: Typically 50KB - 500KB per document
- **Browser limit**: Usually 2GB+ (depends on available RAM)

**Templates in MongoDB:**
- **Document size limit**: 16MB per template (MongoDB limit)
- **Typical template size**: 2KB - 20KB
- **Logo storage**: Base64 encoded (increases size ~33%)
- **Database size**: Unlimited (depends on storage)

**Logo Files:**
- **Max upload size**: 5MB (configurable in `constants.py`)
- **Processed size**: Resized to 128px height
- **Storage format**: Base64 in database

---

### 🔵 **Backup & Export Template Data**

**Export All Templates:**
```bash
# MongoDB command line
mongoexport --db test_database --collection templates --out templates_backup.json

# Or using MongoDB Compass GUI
```

**Import Templates:**
```bash
# MongoDB command line
mongoimport --db test_database --collection templates --file templates_backup.json
```

**Backup Entire Database:**
```bash
mongodump --db test_database --out ./backup/
```

---

### 🔵 **Production Considerations**

**For Production Deployment:**

1. **File Storage:**
   - Use cloud storage (AWS S3, Google Cloud Storage)
   - Implement file versioning
   - Set up automated backups

2. **Database:**
   - Use MongoDB Atlas or dedicated MongoDB server
   - Enable authentication and encryption
   - Set up automated backups

3. **Downloads:**
   - Consider CDN for large files
   - Implement download analytics
   - Add virus scanning for uploads

4. **Security:**
   - Validate all uploads
   - Implement rate limiting
   - Use HTTPS for all transfers

---

### 🔵 **Quick Reference**

| Item | Location | Configurable |
|------|----------|--------------|
| **PDF Downloads** | Browser download folder | ✅ (browser settings) |
| **DOCX Downloads** | Browser download folder | ✅ (browser settings) |
| **Templates** | MongoDB database | ✅ (backend/.env) |
| **Logos** | MongoDB (base64) | ✅ (code changes needed) |
| **Config Files** | backend/.env, frontend/.env | ✅ |
| **App Logs** | Console/terminal | ✅ (logging config) |

**Need to change paths?** Edit the respective `.env` files and restart the services.