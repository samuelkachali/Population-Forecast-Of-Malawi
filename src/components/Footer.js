import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const columns = [
  {
    title: 'About',
    links: [
      { label: 'Population Forecast Of Malawi', href: '/about' },
      { label: 'Developer', href: 'https://github.com/samuelkachali/Population-Forecast-Of-Malawi' },
    ],
  },
  {
    title: 'Quick Statistics',
    links: [
      { label: 'Latest Census', href: '/dashboard' },
      { label: 'Population Growth', href: '/dashboard' },
      { label: 'Urbanization Rate', href: '/dashboard' },
      { label: 'Median Age', href: '/dashboard' },
    ],
  },
  {
    title: 'Government Resources',
    links: [
      { label: 'Ministry of Health', href: 'https://www.health.gov.mw' },
      { label: 'Ministry of Education', href: 'https://www.education.gov.mw' },
      { label: 'Ministry of Agriculture', href: 'https://www.agriculture.gov.mw' },
      { label: 'National Planning', href: 'https://www.npcc.mw' },
    ],
  },
  {
    title: 'External Resources',
    links: [
      { label: 'UN Population Division', href: 'https://population.un.org' },
      { label: 'World Bank Data', href: 'https://data.worldbank.org/country/malawi' },
      { label: 'African Development Bank', href: 'https://www.afdb.org/en/countries/southern-africa/malawi' },
      { label: 'Open Data Portal', href: 'https://opendata.gov.mw' },
    ],
  },
];

const Footer = () => (
  <Box component="footer" sx={{ mt: 8 }}>
    {/* Top section: links/columns */}
    <Box sx={{ background: 'linear-gradient(180deg, #181c24 0%, #474d58 100%)', color: '#fff', py: 6, px: { xs: 2, sm: 0 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, sm: 4 }} alignItems="flex-start" justifyContent={{ xs: 'center', md: 'space-between' }}>
          {columns.map((col, idx) => (
            <Grid item xs={12} sm={6} md={3} key={col.title} sx={{ px: { xs: 1, sm: 3, md: 2 }, mt: { xs: idx === 0 ? 2 : 0, sm: 0 }, textAlign: 'left' }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2, letterSpacing: 1, fontSize: { xs: '1.08rem', sm: '1.15rem' } }}
              >
                {col.title}
              </Typography>
              {col.links.map((link) => (
                <Box key={link.label} sx={{ mb: 1 }}>
                  <Link
                    href={link.href}
                    underline="hover"
                    color="inherit"
                    sx={{ opacity: 0.85, fontSize: { xs: '0.98rem', sm: '1rem' }, '&:hover': { opacity: 1, color: 'primary.light' } }}
                  >
                    {link.label}
                  </Link>
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
    {/* Divider and bottom section */}
    <Box sx={{ background: '#474d58', color: '#fff', pt: 4, pb: 2 }}>
      <Container maxWidth="lg">
        <Box sx={{ borderTop: '1px solid #23272f', width: '100%', mb: 3, opacity: 0.2 }} />
        {/* Social icons row */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
          <Link href="https://www.facebook.com" color="inherit" aria-label="Facebook" sx={{ opacity: 0.8, '&:hover': { color: 'primary.light', opacity: 1 } }}><FacebookIcon fontSize="medium" /></Link>
          <Link href="https://www.linkedin.com" color="inherit" aria-label="LinkedIn" sx={{ opacity: 0.8, '&:hover': { color: 'primary.light', opacity: 1 } }}><LinkedInIcon fontSize="medium" /></Link>
          <Link href="https://www.instagram.com" color="inherit" aria-label="Instagram" sx={{ opacity: 0.8, '&:hover': { color: 'primary.light', opacity: 1 } }}><InstagramIcon fontSize="medium" /></Link>
          <Link href="https://www.youtube.com" color="inherit" aria-label="YouTube" sx={{ opacity: 0.8, '&:hover': { color: 'primary.light', opacity: 1 } }}><YouTubeIcon fontSize="medium" /></Link>
        </Box>
        {/* Copyright */}
        <Box sx={{ textAlign: 'center', opacity: 0.7, fontSize: 14 }}>
          &copy; {new Date().getFullYear()} Population Forecast Of Malawi (PFOM). All rights reserved.
        </Box>
      </Container>
    </Box>
  </Box>
);

export default Footer; 