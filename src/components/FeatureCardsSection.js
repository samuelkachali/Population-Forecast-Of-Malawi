import React from 'react';
import { Box, Grid, Typography, Paper, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import DownloadIcon from '@mui/icons-material/Download';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: <SearchIcon sx={{ fontSize: 38, color: 'primary.main' }} />, 
    title: 'Analyze',
    desc: 'Get instant insights and forecasts for Malawi’s population.'
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 38, color: 'success.main' }} />, 
    title: 'Visualize',
    desc: 'Explore interactive charts and trends with ease.'
  },
  {
    icon: <DownloadIcon sx={{ fontSize: 38, color: 'secondary.main' }} />, 
    title: 'Download',
    desc: 'Export beautiful, ready-to-use reports for your needs.'
  },
];

const FeatureCardsSection = () => {
  const theme = useTheme();
  return (
    <Box sx={{ my: 8, px: { xs: 2, sm: 4, md: 0 } }}>
      <Typography variant="h4" fontWeight={800} align="center" mb={4} sx={{ color: 'rgba(40, 40, 53, 0.83)', letterSpacing: 1, fontSize: { xs: '1.3rem', sm: '1.7rem', md: '2.3rem' } }}>
        How it works
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {steps.map((step, idx) => (
          <Grid item xs={12} sm={6} md={4} key={step.title}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + idx * 0.12, duration: 0.6 }}
            >
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 4,
                  p: { xs: 3, md: 4 },
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: 'linear-gradient(120deg, #f5f7fa 0%, #e3eafc 100%)',
                  boxShadow: '0 2px 12px rgba(33,150,243,0.07)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.03)',
                    boxShadow: '0 8px 32px 0 rgba(33,150,243,0.13)',
                  },
                }}
              >
                <Box mb={1}>{step.icon}</Box>
                <Typography variant="subtitle1" fontWeight={700} mb={0.5} sx={{ color: 'primary.dark', fontSize: { xs: '1.1rem', md: '1.25rem' } }}>{step.title}</Typography>
                <Typography variant="body2" color="text.secondary">{step.desc}</Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeatureCardsSection; 
