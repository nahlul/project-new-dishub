#!/bin/bash
# Trans Koetaradja VPS Deployment Script

echo "🚀 Trans Koetaradja VPS Deployment"
echo "===================================="

# Create project directory
mkdir -p ~/trans-koetaradja
cd ~/trans-koetaradja

# Create frontend structure
mkdir -p frontend/src/{components,pages,components/ui}
mkdir -p frontend/public

# Create backend structure  
mkdir -p backend

echo "✅ Directory structure created!"
echo ""
echo "📥 Next: Upload files menggunakan SCP atau FTP"
echo "   Atau gunakan script auto-copy yang akan saya buat"
