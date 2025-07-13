# VFX Image Format Exchange Specs - Local Installation Guide

## 📦 Local Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)

### Quick Start

1. **Download the Project**
   ```bash
   # If using Git
   git clone <your-repository-url>
   cd vfx-image-format-specs
   
   # Or download and extract the ZIP file
   ```

2. **Setup Backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create .env file
   echo "MONGO_URL=mongodb://localhost:27017" > .env
   echo "DB_NAME=vfx_specs_db" >> .env
   
   # Start backend
   python server.py
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   yarn install
   
   # Create .env file
   echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
   
   # Start frontend
   yarn start
   ```

4. **Access Application**
   - Open browser to: `http://localhost:3000`
   - Backend API: `http://localhost:8001`

### Features Available Locally
✅ **Template Management** - Save and load form templates
✅ **PDF/DOCX Export** - Professional document generation
✅ **Logo Upload** - Company and project logos
✅ **Dark Theme** - Professional macOS-inspired UI
✅ **Filename Generation** - Industry-standard naming
✅ **Form Validation** - Complete VFX specification forms

### Project Structure
```
vfx-image-format-specs/
├── backend/                 # Python FastAPI backend
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   ├── constants.py        # Configuration
│   ├── server.py          # Main application
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # API services
│   │   └── App.js         # Main application
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
└── README.md              # This file
```

### Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `backend/.env`

**Port Conflicts:**
- Frontend runs on port 3000
- Backend runs on port 8001
- Change ports in respective config files if needed

**Dependencies Issues:**
- Delete `node_modules` and run `yarn install` again
- Use Python virtual environment for backend

### Production Deployment
- Use environment variables for production URLs
- Set up proper MongoDB instance
- Configure reverse proxy (nginx/Apache)
- Enable HTTPS for production use

### Support
For issues or questions, check the application logs or contact support.