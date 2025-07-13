# VFX Image Format Exchange Specs - Local Package

## 📦 What's Included

This package contains a complete, production-ready VFX specification management system that you can run locally on your machine.

### ✅ **Core Features**
- **Template Management** - Save and load form templates for reuse
- **Professional Export** - Generate PDF and DOCX documents
- **Dark Theme UI** - Apple-inspired professional interface
- **Logo Management** - Upload and process company/project logos
- **Industry Standards** - VFX-specific dropdowns and validations
- **Filename Generation** - Industry-standard naming conventions

### 📋 **System Requirements**
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **Node.js**: Version 16 or higher
- **Python**: Version 3.8 or higher
- **MongoDB**: Local installation or cloud service (MongoDB Atlas)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 1GB free space

## 🚀 **Quick Start**

### **Option 1: Automatic Setup (Recommended)**

**Windows:**
```bash
# Run the setup script
setup.bat

# Start the application
start.bat
```

**macOS/Linux:**
```bash
# Make script executable and run setup
chmod +x setup.sh
./setup.sh

# Start the application
./start.sh
```

### **Option 2: Manual Setup**

1. **Setup Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file
   echo "MONGO_URL=mongodb://localhost:27017" > .env
   echo "DB_NAME=vfx_specs_db" >> .env
   
   # Start backend
   python server.py
   ```

2. **Setup Frontend (in new terminal):**
   ```bash
   cd frontend
   yarn install
   
   # Create .env file
   echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
   
   # Start frontend
   yarn start
   ```

3. **Access Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001

## 📁 **Project Structure**

```
vfx-image-format-specs/
├── 📁 backend/                    # Python FastAPI backend
│   ├── 📁 models/                # Data models and schemas
│   ├── 📁 services/              # Business logic services
│   ├── 📄 constants.py           # Application constants
│   ├── 📄 server.py             # Main FastAPI application
│   ├── 📄 requirements.txt      # Python dependencies
│   └── 📄 .env                  # Environment variables
├── 📁 frontend/                   # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/        # UI components
│   │   ├── 📁 services/          # API and utility services
│   │   ├── 📄 App.js            # Main React application
│   │   └── 📄 index.css         # Global styles
│   ├── 📁 public/
│   │   ├── 📁 images/           # Static images
│   │   └── 📄 index.html        # HTML template
│   ├── 📄 package.json          # Node.js dependencies
│   └── 📄 .env                  # Environment variables
├── 📄 README.md                  # This documentation
├── 📄 setup.sh / setup.bat       # Setup scripts
└── 📄 start.sh / start.bat       # Start scripts
```

## 🎯 **Using the Application**

### **Creating VFX Specifications**
1. **Fill out the form sections:**
   - Letterhead Information (company details, logo)
   - Project Information (director, client, technical specs)
   - Camera Formats (multiple cameras supported)
   - VFX Pulls (technical specifications)
   - Media Review (delivery formats)
   - VFX Deliveries (naming conventions)

2. **Save as Template:**
   - Click "Save Template" 
   - Enter a template name
   - Reuse for future projects

3. **Export Documents:**
   - Click "Export PDF" for professional PDF
   - Click "Export DOCX" for Word document
   - Documents include logos and exclude empty fields

### **Template Management**
- **Save Templates:** Store common configurations for reuse
- **Load Templates:** Apply saved templates to new projects
- **Template Library:** View all saved templates at bottom of page

## 🔧 **Configuration**

### **Database Options**

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally
# Update backend/.env:
MONGO_URL=mongodb://localhost:27017
DB_NAME=vfx_specs_db
```

**Option 2: MongoDB Atlas (Cloud)**
```bash
# Sign up at https://mongodb.com/atlas
# Update backend/.env:
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=vfx_specs_db
```

### **Port Configuration**
```bash
# Frontend (default: 3000)
# Backend (default: 8001)
# Change ports in respective .env files if needed
```

## 🔍 **Troubleshooting**

### **Common Issues**

**"MongoDB connection failed"**
- Ensure MongoDB is running: `mongod`
- Check connection string in `backend/.env`
- Try MongoDB Atlas cloud service

**"Port already in use"**
- Kill processes: `lsof -ti:3000 | xargs kill`
- Change ports in .env files

**"Dependencies not found"**
- Delete node_modules: `rm -rf frontend/node_modules`
- Reinstall: `cd frontend && yarn install`
- For Python: `pip install -r backend/requirements.txt`

**"Template not saving"**
- Check backend logs for errors
- Ensure MongoDB is connected
- Verify API endpoints are working

### **Getting Help**
- Check console logs in browser (F12)
- Check backend logs in terminal
- Ensure all services are running

## 📈 **Production Deployment**

For production deployment:
1. Use environment variables for all configuration
2. Set up proper MongoDB instance with authentication
3. Configure reverse proxy (nginx/Apache)
4. Enable HTTPS
5. Set up proper logging and monitoring

## 📊 **Technical Specifications**

- **Frontend**: React 18, Tailwind CSS, Radix UI
- **Backend**: FastAPI (Python), Motor (MongoDB async)
- **Database**: MongoDB
- **Export**: ReportLab (PDF), python-docx (DOCX)
- **File Processing**: Pillow (Python)
- **API**: RESTful API with JSON responses
- **Theme**: Dark macOS-inspired professional UI

## 🏆 **Features Highlight**

✅ **Industry-Standard Dropdowns** - All VFX-specific options  
✅ **Professional Export** - PDF/DOCX with conditional formatting  
✅ **Template System** - Save and reuse configurations  
✅ **Logo Processing** - Upload and resize logos automatically  
✅ **Responsive Design** - Works on desktop and tablets  
✅ **Form Validation** - Required fields and data validation  
✅ **Filename Generation** - Industry-standard naming conventions  
✅ **Dark Theme** - Professional, easy-on-eyes interface  

---

**Need Support?** Check the troubleshooting section or contact your technical team.