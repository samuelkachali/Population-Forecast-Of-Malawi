import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const imageChallenges = [
  {
    img: '/images/medical.png',
    title: 'Healthcare Strain',
    desc: 'Overcrowded hospitals and limited resources challenge the healthcare system as population grows rapidly.'
  },
  {
    img: '/images/outdoor.jpg',
    title: 'Education Pressure',
    desc: 'More children mean crowded classrooms and a need for more schools and teachers.'
  },
  {
    img: '/images/overcrowded.jpg',
    title: 'Urban Overcrowding',
    desc: 'Cities face congestion, housing shortages, and infrastructure stress due to rapid urbanization.'
  },
  {
    img: '/images/water.jpg',
    title: 'Resource Scarcity',
    desc: 'Access to clean water and other vital resources becomes more difficult as demand increases.'
  },
];

const PopulationChallengesSection = () => (
  <Box sx={{ my: 8, py: 6, background: '#f5faff', borderRadius: 4 }}>
    <Typography variant="h4" fontWeight={700} align="center" mb={4} sx={{ fontSize: { xs: '1.4rem', sm: '2rem', md: '2.5rem' } }}>
      Challenges of Population Growth
    </Typography>
    <Grid container spacing={4} justifyContent="center">
      {imageChallenges.map((ch, idx) => (
        <Grid item xs={12} sm={6} md={3} key={ch.title}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + idx * 0.12, duration: 0.6 }}
          >
            <Paper
              elevation={5}
              sx={{
                p: 0,
                borderRadius: 4,
                overflow: 'hidden',
                minHeight: 320,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 24px 0 rgba(25,118,210,0.10)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                background: '#fff',
                '&:hover': { transform: 'translateY(-6px) scale(1.04)', boxShadow: 8 },
              }}
            >
              <Box sx={{ position: 'relative', height: 180, width: '100%' }}>
                <img
                  src={ch.img}
                  alt={ch.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(24,28,36,0.38) 60%, rgba(24,28,36,0.72) 100%)',
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    left: 0,
                    width: '100%',
                    color: '#fff',
                    textAlign: 'center',
                    zIndex: 2,
                    textShadow: '0 2px 8px rgba(24,28,36,0.28)',
                  }}
                >
                  {ch.title}
                </Typography>
              </Box>
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>{ch.desc}</Typography>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default PopulationChallengesSection; 