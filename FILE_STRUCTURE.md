# Trans Koetaradja Website - File Structure

## Frontend (React)
```
/app/frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx (Logo batik, navigasi, animasi)
│   │   ├── Footer.jsx (Kontak, sosmed: IG, FB, X)
│   │   ├── HeroSection.jsx (Hero dengan CTA download)
│   │   ├── AboutSection.jsx (Tentang + Sejarah 2016-2025)
│   │   ├── StatsSection.jsx (Statistik dalam angka)
│   │   ├── RoutesSection.jsx (14 rute dengan filter)
│   │   ├── FacilitiesSection.jsx (6 fasilitas)
│   │   ├── GallerySection.jsx (6 foto)
│   │   ├── NewsSection.jsx (4 berita + link Instagram)
│   │   ├── FAQSection.jsx (15 FAQ)
│   │   ├── DownloadSection.jsx (CTA download app)
│   │   └── ui/ (Shadcn components)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── RoutesPage.jsx
│   │   ├── FacilitiesPage.jsx
│   │   ├── GalleryPage.jsx
│   │   ├── NewsPage.jsx
│   │   ├── FAQPage.jsx
│   │   └── DownloadPage.jsx
│   ├── mockData.js (Data rute, berita, FAQ, galeri)
│   ├── App.js (Router utama)
│   ├── App.css (Global styles + responsive fixes)
│   └── index.css (Tailwind + theme colors)
├── package.json (Dependencies + framer-motion)
└── public/

## Backend (FastAPI + MongoDB)
/app/backend/
├── server.py (Main FastAPI server)
├── requirements.txt (Python dependencies)
└── .env (Environment variables)

## Key Features
1. Multi-page routing (bukan single page scroll)
2. Mobile responsive (tested 375px, 768px, 1920px)
3. Animasi smooth dengan framer-motion
4. Logo batik biru (tidak gepeng)
5. 14 rute Trans Koetaradja lengkap
6. Sejarah kebangkitan 2016-2025
7. Kontak: WhatsApp, Email (mailto), Sosmed
8. Download links: Android (Play Store), iOS (App Store)

## Social Media Links
- Instagram: @trans.koetaradja
- Facebook: transkoetaradja
- X (Twitter): @dishub_aceh
- WhatsApp: +62 811 6712349
- Email: info@transkutaraja.acehprov.go.id

## Color Theme
- Primary: sky-600 (biru nyantai)
- Secondary: blue-600
- Accent: sky-700

## Status: ✅ PRODUCTION READY
Website siap untuk PKL presentasi & hosting!
