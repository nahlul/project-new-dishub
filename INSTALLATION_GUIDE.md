# Trans Koetaradja - Installation Guide

## Prerequisites
- Node.js 18+ 
- Python 3.9+
- MongoDB
- Yarn

## Installation Steps

### 1. Clone/Setup Project
```bash
mkdir trans-koetaradja
cd trans-koetaradja
```

### 2. Frontend Setup
```bash
# Install dependencies
cd frontend
yarn install

# Environment variables
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env
echo "WDS_SOCKET_PORT=443" >> .env
echo "ENABLE_HEALTH_CHECK=false" >> .env

# Run development
yarn start
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment variables
echo 'MONGO_URL="mongodb://localhost:27017"' > .env
echo 'DB_NAME="trans_koetaradja"' >> .env
echo 'CORS_ORIGINS="*"' >> .env

# Run server
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### 4. MongoDB Setup
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

## File Structure
Lihat FILE_STRUCTURE.md untuk detail lengkap

## Deployment (Vercel/Netlify)

### Frontend (Vercel)
1. Push code ke GitHub
2. Connect GitHub ke Vercel
3. Set environment variable: REACT_APP_BACKEND_URL
4. Deploy!

### Backend (Railway/Render)
1. Push code ke GitHub  
2. Connect ke Railway/Render
3. Set environment variables
4. Deploy!

## Key Files to Download
- package.json
- All files in src/
- requirements.txt
- server.py
- mockData.js

## Support
Contact: +62 811 6712349
Email: info@transkutaraja.acehprov.go.id
