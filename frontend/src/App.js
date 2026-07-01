import React from "react";
import "@/App.css";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import RoutesSection from "@/components/RoutesSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import GallerySection from "@/components/GallerySection";
import NewsSection from "@/components/NewsSection";
import DownloadSection from "@/components/DownloadSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <RoutesSection />
        <FacilitiesSection />
        <GallerySection />
        <NewsSection />
        <DownloadSection />
        <FAQSection />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
