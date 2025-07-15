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
      { label: 'Population Forecast Of Malawi', href: '#' },
      { label: 'Developer', href: '#' },
    ],
  },
  {
    title: 'Quick Statistics',
    links: [
      { label: 'Latest Census', href: '#' },
      { label: 'Population Growth', href: '#' },
      { label: 'Urbanization Rate', href: '#' },
      { label: 'Median Age', href: '#' },
    ],
  },
  {
    title: 'Government Resources',
    links: [
      { label: 'Ministry of Health', href: '#' },
      { label: 'Ministry of Education', href: '#' },
      { label: 'Ministry of Agriculture', href: '#' },
      { label: 'National Planning', href: '#' },
    ],
  },
  {
    title: 'External Resources',
    links: [
      { label: 'UN Population Division', href: '#' },
      { label: 'World Bank Data', href: '#' },
      { label: 'African Development Bank', href: '#' },
      { label: 'Open Data Portal', href: '#' },
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
            <Grid item xs={12} sm={6} md={3} key={col.title} sx={{ px: { xs: 1, sm: 3, md: 2 }, mt: { xs: idx === 0 ? 2 : 0, sm: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2, letterSpacing: 1 }}
              >
                {col.title}
              </Typography>
              {col.links.map((link) => (
                <Box key={link.label} sx={{ mb: 1 }}>
                  <Link
                    href={link.href}
                    underline="hover"
                    color="inherit"
                    sx={{ opacity: 0.85, fontSize: '1rem', '&:hover': { opacity: 1, color: 'primary.light' } }}
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
          <Link href="#" color="inherit" aria-label="Facebook" sx={{ opacity: 0.8, '&:hover': { color: 'primary.light', opacity: 1 } }}><FacebookIcon fontSize="medium" /></Link>
          <Link href="#" color="inherit" aria-label="LinkedIn" sx={{ opacity: 0.8, '&:hover': { color: 'primary.light', opacity: 1 } }}><LinkedInIcon fontSize="medium" /></Link>
          <Link href="#" color="inherit" aria-label="Instagram" sx={{ opacity: 0.8, '&:hover': { color: 'primary.light', opacity: 1 } }}><InstagramIcon fontSize="medium" /></Link>
          <Link href="#" color="inherit" aria-label="YouTube" sx={{ opacity: 0.8, '&:hover': { color: 'primary.light', opacity: 1 } }}><YouTubeIcon fontSize="medium" /></Link>
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