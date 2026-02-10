import React from 'react';
import { Box, Typography, Paper, useTheme, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import DownloadIcon from '@mui/icons-material/Download';
import { motion, AnimatePresence } from 'framer-motion';

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

const transition = { duration: 3, ease: 'easeInOut' };

const FeatureCardsSection = () => {
  const theme = useTheme();
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ my: 8, px: { xs: 3, sm: 4, md: 0 }, minHeight: 320 }}>
      <Typography variant="h4" fontWeight={800} align="center" mb={4} sx={{ color: 'rgba(40, 40, 53, 0.83)', letterSpacing: 1, fontSize: { xs: '1.3rem', sm: '1.7rem', md: '2.3rem' } }}>
        How it works
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 220 }}>
        <Box sx={{ width: '100%', maxWidth: 400, minHeight: 180, position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={transition}
              style={{ position: 'absolute', width: '100%' }}
            >
              <Paper
                elevation={3}
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
                  minHeight: 180,
                }}
              >
                <Box mb={1}>{steps[active].icon}</Box>
                <Typography variant="subtitle1" fontWeight={700} mb={0.5} sx={{ color: 'primary.dark', fontSize: { xs: '1.1rem', md: '1.25rem' } }}>{steps[active].title}</Typography>
                <Typography variant="body2" color="text.secondary">{steps[active].desc}</Typography>
              </Paper>
            </motion.div>
          </AnimatePresence>
        </Box>
        {/* Indicator dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
          {steps.map((_, idx) => (
            <Box
              key={idx}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: idx === active ? theme.palette.primary.main : '#cfd8dc',
                transition: 'background 0.3s',
                boxShadow: idx === active ? '0 0 6px 2px #90caf9' : 'none',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FeatureCardsSection; 
