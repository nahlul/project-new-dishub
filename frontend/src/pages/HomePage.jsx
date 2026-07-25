import React from 'react';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import HomeNewsPreview from '../components/HomeNewsPreview';
import HomeGalleryPreview from '../components/HomeGalleryPreview';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <HomeNewsPreview />
      <HomeGalleryPreview />
    </div>
  );
};

export default HomePage;
