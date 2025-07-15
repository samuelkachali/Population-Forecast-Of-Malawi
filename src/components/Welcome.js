import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import MobileHeroSection from './MobileHeroSection';
import FeatureCardsSection from './FeatureCardsSection';
import Footer from './Footer';
import PopulationChallengesSection from './PopulationChallengesSection';
import DashboardCTASection from './DashboardCTASection';
import TestimonialQuoteSection from './TestimonialQuoteSection';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';

const Welcome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      {/* Only show Header on desktop */}
      {!isMobile && <Header />}
      {isMobile ? <MobileHeroSection /> : <HeroSection />}
      <FeatureCardsSection />
      <PopulationChallengesSection />
      <Box sx={{ mt: 6 }}>
        <Container maxWidth="lg">
          {/* Place your releases, challenges, or other main content here */}
        </Container>
      </Box>
      <TestimonialQuoteSection />
      <DashboardCTASection />
      <Footer />
    </>
  );
};

export default Welcome; 