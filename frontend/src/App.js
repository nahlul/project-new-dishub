import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

// Public Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import RoutesPage from "@/pages/RoutesPage";
import FacilitiesPage from "@/pages/FacilitiesPage";
import GalleryPage from "@/pages/GalleryPage";
import NewsPage from "@/pages/NewsPage";
import NewsDetailPage from "@/pages/NewsDetailPage";
import FAQPage from "@/pages/FAQPage";
import DownloadPage from "@/pages/DownloadPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminNews from "@/pages/admin/AdminNews";
import AdminGallery from "@/pages/admin/AdminGallery";
import AdminContact from "@/pages/admin/AdminContact";
import AdminSocialMedia from "@/pages/admin/AdminSocialMedia";
import AdminAbout from "@/pages/admin/AdminAbout";
import AdminChangePassword from "@/pages/admin/AdminChangePassword";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Header />
                <main><HomePage /></main>
                <Footer />
              </>
            } />
            <Route path="/tentang" element={
              <>
                <Header />
                <main><AboutPage /></main>
                <Footer />
              </>
            } />
            <Route path="/rute" element={
              <>
                <Header />
                <main><RoutesPage /></main>
                <Footer />
              </>
            } />
            <Route path="/fasilitas" element={
              <>
                <Header />
                <main><FacilitiesPage /></main>
                <Footer />
              </>
            } />
            <Route path="/galeri" element={
              <>
                <Header />
                <main><GalleryPage /></main>
                <Footer />
              </>
            } />
            <Route path="/berita" element={
              <>
                <Header />
                <main><NewsPage /></main>
                <Footer />
              </>
            } />
            <Route path="/berita/:id" element={<NewsDetailPage />} />
            <Route path="/faq" element={
              <>
                <Header />
                <main><FAQPage /></main>
                <Footer />
              </>
            } />
            <Route path="/download" element={
              <>
                <Header />
                <main><DownloadPage /></main>
                <Footer />
              </>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/news" element={
              <ProtectedRoute><AdminNews /></ProtectedRoute>
            } />
            <Route path="/admin/gallery" element={
              <ProtectedRoute><AdminGallery /></ProtectedRoute>
            } />
            <Route path="/admin/contact" element={
              <ProtectedRoute><AdminContact /></ProtectedRoute>
            } />
            <Route path="/admin/social-media" element={
              <ProtectedRoute><AdminSocialMedia /></ProtectedRoute>
            } />
            <Route path="/admin/about" element={
              <ProtectedRoute><AdminAbout /></ProtectedRoute>
            } />
            <Route path="/admin/change-password" element={
              <ProtectedRoute><AdminChangePassword /></ProtectedRoute>
            } />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
