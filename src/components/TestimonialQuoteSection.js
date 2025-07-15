import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { motion } from 'framer-motion';

const testimonial = {
  name: 'Chikondi Banda',
  role: 'Urban Planner, Lilongwe',
  avatar: '/public/images/profile.jpg', // Use your own image or a placeholder
  quote:
    'PFOM has transformed how we plan for the future. The insights and forecasts help us make better decisions for our communities. Highly recommended for anyone working with population data in Malawi!',
};

const TestimonialQuoteSection = () => (
  <Box sx={{ my: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{ width: '100%' }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          p: { xs: 3, sm: 5 },
          borderRadius: 5,
          background: 'linear-gradient(120deg, #e3eafc 0%, #f5f7fa 100%)',
          boxShadow: '0 8px 32px 0 rgba(33,150,243,0.10)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <FormatQuoteIcon sx={{ fontSize: 48, color: 'primary.light', mb: 1 }} />
        <Typography variant="h6" fontWeight={500} sx={{ mb: 2, color: 'text.secondary', fontStyle: 'italic' }}>
          {testimonial.quote}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
          <Avatar
            src={testimonial.avatar}
            alt={testimonial.name}
            sx={{ width: 56, height: 56, mr: 2, border: '2px solid #257a5a' }}
          />
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'primary.main' }}>
              {testimonial.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {testimonial.role}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  </Box>
);

export default TestimonialQuoteSection; 