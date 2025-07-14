import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Fade, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

const reportCategories = [
  {
    key: 'demographics',
    title: 'Demographics Report',
    icon: <PeopleIcon color="primary" />, 
    summary: 'Overview of Malawi’s population structure, age groups, and gender distribution.'
  },
  {
    key: 'forecasts',
    title: 'Forecasts Report',
    icon: <TimelineIcon color="secondary" />, 
    summary: 'Population forecasts for coming years based on current trends and models.'
  },
  {
    key: 'regional',
    title: 'Regional Data Report',
    icon: <MapIcon color="success" />, 
    summary: 'Population and demographic breakdown by region.'
  },
  {
    key: 'growth',
    title: 'Growth Analysis Report',
    icon: <TrendingUpIcon color="action" />, 
    summary: 'Analysis of annual population growth rates and trends.'
  },
  {
    key: 'health',
    title: 'Health Metrics Report',
    icon: <HealthAndSafetyIcon color="error" />, 
    summary: 'Key health indicators and metrics impacting population dynamics.'
  },
];

const reportPreviews = {
  demographics: (
    <Box>
      <Typography variant="h6">Demographics Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Malawi’s population is predominantly young, with over 50% under the age of 18. The gender ratio is nearly balanced. Urbanization is increasing, but most people still live in rural areas.
      </Typography>
    </Box>
  ),
  forecasts: (
    <Box>
      <Typography variant="h6">Forecasts Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        The population is projected to reach 25 million by 2030, with continued growth expected in both urban and rural areas. Fertility rates are gradually declining.
      </Typography>
    </Box>
  ),
  regional: (
    <Box>
      <Typography variant="h6">Regional Data Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        The Southern region is the most populous, followed by the Central and Northern regions. Urban centers like Lilongwe and Blantyre are experiencing the fastest growth.
      </Typography>
    </Box>
  ),
  growth: (
    <Box>
      <Typography variant="h6">Growth Analysis Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Annual growth rates have remained steady at around 2.7%. Monitoring these trends is vital for planning in health, education, and infrastructure.
      </Typography>
    </Box>
  ),
  health: (
    <Box>
      <Typography variant="h6">Health Metrics Report (Preview)</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Life expectancy is improving, but challenges remain in infant mortality and access to basic sanitation. Continued investment in healthcare is needed.
      </Typography>
    </Box>
  ),
};

const Reports = () => {
  const [selected, setSelected] = useState(null);

  return (
    <Box sx={{ mt: { xs: 1, md: 2 }, mb: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      <Fade in timeout={900}>
        <Box>
          <Typography 
            variant="h3" 
            fontWeight={800} 
            gutterBottom 
            sx={{ 
              letterSpacing: 1, 
              color: '#212B36', 
              textAlign: 'center', 
              mb: { xs: 1, md: 2 },
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
            }}
          >
            <AssessmentIcon sx={{ 
              fontSize: { xs: 32, md: 40 }, 
              color: '#3366FF', 
              mb: -1, 
              mr: 1 
            }} />
            Reports
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: { xs: 2, md: 3 }, 
              color: '#637381', 
              textAlign: 'center', 
              fontWeight: 400,
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              px: { xs: 1, md: 0 }
            }}
          >
            Browse different categories of reports. Click a category to preview its summary.
          </Typography>
          <Card sx={{ 
            borderRadius: { xs: 3, md: 5 }, 
            background: 'rgba(227,234,252,0.7)', 
            boxShadow: '0 4px 24px 0 rgba(51,102,255,0.08)', 
            p: { xs: 1, md: 2 } 
          }}>
            <CardContent>
              <List>
                {reportCategories.map((cat) => (
                  <ListItem
                    key={cat.key}
                    button
                    selected={selected === cat.key}
                    onClick={() => setSelected(cat.key)}
                    alignItems="flex-start"
                    divider
                  >
                    <ListItemIcon>{cat.icon}</ListItemIcon>
                    <ListItemText
                      primary={cat.title}
                      secondary={cat.summary}
                    />
                  </ListItem>
                ))}
              </List>
              {selected && (
                <Box sx={{ mt: 3, p: 2, background: '#f5f7fa', borderRadius: 3 }}>
                  {reportPreviews[selected]}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Box>
  );
};

export default Reports; 