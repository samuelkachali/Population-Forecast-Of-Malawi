import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Fade, List, ListItem, ListItemText, ListItemIcon, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNotification } from '../contexts/NotificationContext';
import { useUser } from '../contexts/UserContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://population-forecast-of-malawi.onrender.com";

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const { addNotification } = useNotification();
  const { user } = useUser();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/reports`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reports');
        return res.json();
      })
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load reports.');
        setLoading(false);
      });
  }, []);

  const filteredReports = (reports || []).filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.summary.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!reports) return;
    const notified = JSON.parse(localStorage.getItem('notified_reports') || '{}');
    const now = new Date();
    reports.forEach(report => {
      const reportDate = new Date(report.date);
      const daysDiff = (now - reportDate) / (1000 * 60 * 60 * 24);
      if (daysDiff <= 7 && !notified[report.title]) {
        addNotification({
          message: `New report: ${report.title}`,
          link: '/dashboard/reports',
        });
        notified[report.title] = true;
      }
    });
    localStorage.setItem('notified_reports', JSON.stringify(notified));
  }, [reports, addNotification]);

  const handleDeleteReport = async (filename) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports/${filename}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete report');
      setReports((prev) => prev.filter((r) => !r.url.includes(filename)));
      // Add notification for deletion
      addNotification({
        message: `Report deleted: ${filename}`,
        link: '/dashboard/reports',
      });
    } catch (err) {
      alert('Failed to delete report.');
    }
  };

  if (loading) return <Box textAlign="center" mt={4}><Typography>Loading reports...</Typography></Box>;
  if (error) return <Box textAlign="center" mt={4}><Typography color="error">{error}</Typography></Box>;

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
            Download or view detailed reports on Malawi's population, regions, education, and more.
          </Typography>
          <Box sx={{ mb: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'center' }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: { xs: '100%', sm: 320 },
                maxWidth: '100%'
              }}
            />
          </Box>
          <Card sx={{ 
            borderRadius: { xs: 3, md: 5 }, 
            background: 'rgba(227,234,252,0.7)', 
            boxShadow: '0 4px 24px 0 rgba(51,102,255,0.08)', 
            p: { xs: 1, md: 2 } 
          }}>
            <CardContent>
              <List>
                {filteredReports.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No reports found." />
                  </ListItem>
                )}
                {filteredReports.map((report, idx) => {
                  const filename = report.url.split('/').pop();
                  return (
                    <ListItem key={idx} alignItems="flex-start" divider>
                      <ListItemIcon>
                        {report.type === 'pdf' ? <PictureAsPdfIcon color="error" /> : <InsertDriveFileIcon color="primary" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={report.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.secondary">
                              {report.summary}
                            </Typography>
                            <br />
                            <Typography component="span" variant="caption" color="text.secondary">
                              {new Date(report.date).toLocaleDateString()}
                            </Typography>
                          </>
                        }
                      />
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        href={`${API_BASE_URL}/api${report.url}?t=${new Date(report.date).getTime()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ ml: { xs: 1, md: 2 }, minWidth: { xs: 80, md: 100 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                        startIcon={<InsertDriveFileIcon />}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        href={`${API_BASE_URL}/api${report.url}?t=${new Date(report.date).getTime()}`}
                        download
                        sx={{ ml: { xs: 1, md: 2 }, minWidth: { xs: 80, md: 100 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                        startIcon={report.type === 'pdf' ? <PictureAsPdfIcon /> : <InsertDriveFileIcon />}
                      >
                        Download
                      </Button>
                      {user && user.role === 'admin' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ ml: { xs: 1, md: 2 }, minWidth: { xs: 80, md: 100 }, fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                          onClick={() => handleDeleteReport(filename)}
                        >
                          Delete
                        </Button>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Box>
  );
};

export default Reports; 