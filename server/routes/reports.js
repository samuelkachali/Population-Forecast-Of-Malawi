const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const router = express.Router();

// Test route to confirm router is mounted
router.get('/test', (req, res) => {
  res.json({ message: 'Reports route is working!' });
});

const REPORTS_DIR = path.join(__dirname, '../utils/data/reports');
const REPORTS_META_FILE = path.join(REPORTS_DIR, 'reports.json');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
if (!fs.existsSync(REPORTS_META_FILE)) fs.writeFileSync(REPORTS_META_FILE, '[]');

// Helper to load/save reports metadata
function loadReports() {
  return JSON.parse(fs.readFileSync(REPORTS_META_FILE, 'utf8'));
}
function saveReports(reports) {
  fs.writeFileSync(REPORTS_META_FILE, JSON.stringify(reports, null, 2));
}

// POST /api/reports/generate
router.post('/generate', async (req, res) => {
  try {
    const { regressors, predictions, regressorsChartImage, populationChartImage, healthData, chartImage, explanation, reportType } = req.body;
    const timestamp = Date.now();
    let filename, filepath, doc, stream, newReport;
    if (reportType === 'growth-analysis') {
      // Generate Growth Analysis PDF
      filename = `growth_analysis_report_${timestamp}.pdf`;
      filepath = path.join(REPORTS_DIR, filename);
      doc = new PDFDocument();
      stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      doc.fontSize(20).text('Growth Analysis Report', { align: 'center' });
      doc.moveDown();
      if (req.body.growthData && req.body.growthData.yearRange) {
        doc.fontSize(14).text(`Years: ${req.body.growthData.yearRange}`, { align: 'center' });
        doc.moveDown();
      }
      if (req.body.chartImage) {
        const base64Data = req.body.chartImage.replace(/^data:image\/png;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');
        doc.image(imgBuffer, { fit: [450, 250], align: 'center' });
        doc.moveDown();
      }
      doc.fontSize(14).text('Growth Rate Data:', { underline: true });
      if (req.body.growthData && req.body.growthData.labels && Array.isArray(req.body.growthData.datasets)) {
        req.body.growthData.labels.forEach((label, i) => {
          const value = req.body.growthData.datasets[0].data[i];
          doc.text(`${label}: ${value}%`);
        });
        doc.moveDown();
      }
      if (req.body.explanation) {
        doc.fontSize(12).text('Explanation:', { underline: true });
        doc.fontSize(11).text(req.body.explanation, { align: 'left' });
      }
      doc.end();
      await new Promise(resolve => stream.on('finish', resolve));
      // Add to reports metadata
      const reports = loadReports();
      newReport = {
        title: `Growth Analysis Report (${new Date(timestamp).toLocaleString()})`,
        summary: 'Custom report of population growth analysis and explanation.',
        type: 'pdf',
        url: `/files/reports/${filename}`,
        date: new Date(timestamp).toISOString(),
      };
      reports.unshift(newReport);
      saveReports(reports);
      return res.json(newReport);
    }
    if (reportType === 'health-metrics') {
      // Generate Health Metrics PDF
      filename = `health_metrics_report_${timestamp}.pdf`;
      filepath = path.join(REPORTS_DIR, filename);
      doc = new PDFDocument();
      stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      doc.fontSize(20).text('Health Metrics Report', { align: 'center' });
      doc.moveDown();
      if (healthData && healthData.year) {
        doc.fontSize(14).text(`Year: ${healthData.year}`, { align: 'center' });
        doc.moveDown();
      }
      if (chartImage) {
        const base64Data = chartImage.replace(/^data:image\/png;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');
        doc.image(imgBuffer, { fit: [450, 250], align: 'center' });
        doc.moveDown();
      }
      doc.fontSize(14).text('Health Metrics Data:', { underline: true });
      if (healthData && healthData.labels && Array.isArray(healthData.datasets)) {
        healthData.labels.forEach((label, i) => {
          const value = healthData.datasets[0].data[i];
          doc.text(`${label}: ${value}`);
        });
        doc.moveDown();
      }
      if (explanation) {
        doc.fontSize(12).text('Explanation:', { underline: true });
        doc.fontSize(11).text(explanation, { align: 'left' });
      }
      doc.end();
      await new Promise(resolve => stream.on('finish', resolve));
      // Add to reports metadata
      const reports = loadReports();
      newReport = {
        title: `Health Metrics Report (${new Date(timestamp).toLocaleString()})`,
        summary: 'Custom report of health metrics and explanation.',
        type: 'pdf',
        url: `/files/reports/${filename}`,
        date: new Date(timestamp).toISOString(),
      };
      reports.unshift(newReport);
      saveReports(reports);
      return res.json(newReport);
    }
    if (reportType === 'historical-trend') {
      // Generate Historical Trend PDF
      filename = `historical_trend_report_${timestamp}.pdf`;
      filepath = path.join(REPORTS_DIR, filename);
      doc = new PDFDocument();
      stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      doc.fontSize(20).text('Historical Population Trend Report', { align: 'center' });
      doc.moveDown();
      if (req.body.populationTrend && req.body.populationTrend.labels && req.body.populationTrend.labels.length > 0) {
        doc.fontSize(14).text(`Years: ${req.body.populationTrend.labels[0]}–${req.body.populationTrend.labels[req.body.populationTrend.labels.length-1]}`, { align: 'center' });
        doc.moveDown();
      }
      if (req.body.chartImage) {
        const base64Data = req.body.chartImage.replace(/^data:image\/png;base64,/, '');
        const imgBuffer = Buffer.from(base64Data, 'base64');
        doc.image(imgBuffer, { fit: [450, 250], align: 'center' });
        doc.moveDown();
      }
      doc.fontSize(14).text('Population Trend Data:', { underline: true });
      if (req.body.populationTrend && req.body.populationTrend.labels && Array.isArray(req.body.populationTrend.datasets)) {
        req.body.populationTrend.labels.forEach((label, i) => {
          const value = req.body.populationTrend.datasets[0].data[i];
          doc.text(`${label}: ${value}`);
        });
        doc.moveDown();
      }
      if (req.body.explanation) {
        doc.fontSize(12).text('Explanation:', { underline: true });
        doc.fontSize(11).text(req.body.explanation, { align: 'left' });
      }
      doc.end();
      await new Promise(resolve => stream.on('finish', resolve));
      // Add to reports metadata
      const reports = loadReports();
      newReport = {
        title: `Historical Trend Report (${new Date(timestamp).toLocaleString()})`,
        summary: 'Custom report of historical population trend and explanation.',
        type: 'pdf',
        url: `/files/reports/${filename}`,
        date: new Date(timestamp).toISOString(),
      };
      reports.unshift(newReport);
      saveReports(reports);
      return res.json(newReport);
    }
    // Demographics Report
    if (req.body.demographicsData) {
      filename = `demographics_report_${timestamp}.pdf`;
      filepath = path.join(REPORTS_DIR, filename);
      doc = new PDFDocument();
      stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      doc.fontSize(20).text('Demographics Report', { align: 'center' });
      doc.moveDown();
      const { gender, pyramid } = req.body.demographicsData;
      if (gender && gender.year) {
        doc.fontSize(14).text(`Gender Distribution (Year: ${gender.year})`, { align: 'left' });
        doc.moveDown();
        gender.labels.forEach((label, i) => {
          doc.text(`${label}: ${gender.datasets[0].data[i]}%`);
        });
        doc.moveDown();
      }
      if (pyramid && pyramid.year) {
        doc.fontSize(14).text(`Population Pyramid (Year: ${pyramid.year})`, { align: 'left' });
        doc.moveDown();
        pyramid.labels.forEach((label, i) => {
          doc.text(`${label}: Male ${pyramid.datasets[0].data[i]}%, Female ${pyramid.datasets[1].data[i]}%`);
        });
        doc.moveDown();
      }
      doc.end();
      await new Promise(resolve => stream.on('finish', resolve));
      const reports = loadReports();
      newReport = {
        title: `Demographics Report (${new Date(timestamp).toLocaleString()})`,
        summary: 'Custom report of population structure, age groups, and gender distribution.',
        type: 'pdf',
        url: `/files/reports/${filename}`,
        date: new Date(timestamp).toISOString(),
      };
      reports.unshift(newReport);
      saveReports(reports);
      return res.json(newReport);
    }
    // Regional Data Report
    if (req.body.regionalData) {
      filename = `regional_report_${timestamp}.pdf`;
      filepath = path.join(REPORTS_DIR, filename);
      doc = new PDFDocument();
      stream = fs.createWriteStream(filepath);
      doc.pipe(stream);
      doc.fontSize(20).text('Regional Data Report', { align: 'center' });
      doc.moveDown();
      const { labels, datasets, year } = req.body.regionalData;
      if (year) {
        doc.fontSize(14).text(`Year: ${year}`, { align: 'left' });
        doc.moveDown();
      }
      if (labels && datasets && datasets[0] && datasets[0].data) {
        labels.forEach((label, i) => {
          doc.text(`${label}: ${datasets[0].data[i]}`);
        });
        doc.moveDown();
      }
      doc.end();
      await new Promise(resolve => stream.on('finish', resolve));
      const reports = loadReports();
      newReport = {
        title: `Regional Data Report (${new Date(timestamp).toLocaleString()})`,
        summary: 'Custom report of population and demographic breakdown by region.',
        type: 'pdf',
        url: `/files/reports/${filename}`,
        date: new Date(timestamp).toISOString(),
      };
      reports.unshift(newReport);
      saveReports(reports);
      return res.json(newReport);
    }
    // Default: Forecast report
    if (!regressors || !predictions) {
      return res.status(400).json({ error: 'Missing regressors or predictions' });
    }
    // Generate PDF
    filename = `report_${timestamp}.pdf`;
    filepath = path.join(REPORTS_DIR, filename);
    doc = new PDFDocument();
    stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    doc.fontSize(20).text('Forecast Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('PDF.', { align: 'left' });
    doc.moveDown();
    // Add regressors chart image if present
    if (regressorsChartImage) {
      const base64Data = regressorsChartImage.replace(/^data:image\/png;base64,/, '');
      const imgBuffer = Buffer.from(base64Data, 'base64');
      doc.image(imgBuffer, { fit: [450, 250], align: 'center' });
      doc.moveDown();
    }
    doc.fontSize(14).text('Generated Regressors:', { underline: true });
    regressors.forEach((row, i) => {
      doc.text(`${i + 1}. Date: ${row.ds}`);
      Object.keys(row).forEach(key => {
        if (key !== 'ds') doc.text(`   ${key}: ${row[key]}`);
      });
      doc.moveDown(0.5);
    });
    doc.moveDown();
    // Add population chart image if present
    if (populationChartImage) {
      const base64Data = populationChartImage.replace(/^data:image\/png;base64,/, '');
      const imgBuffer = Buffer.from(base64Data, 'base64');
      doc.image(imgBuffer, { fit: [450, 250], align: 'center' });
      doc.moveDown();
    }
    doc.fontSize(14).text('Population Predictions:', { underline: true });
    predictions.forEach((row, i) => {
      doc.text(`${i + 1}. Date: ${row.ds}`);
      Object.keys(row).forEach(key => {
        if (key !== 'ds') doc.text(`   ${key}: ${row[key]}`);
      });
      doc.moveDown(0.5);
    });
    doc.end();
    await new Promise(resolve => stream.on('finish', resolve));
    // Add to reports metadata
    const reports = loadReports();
    newReport = {
      title: `Forecast Report (${new Date(timestamp).toLocaleString()})`,
      summary: 'Custom report of generated regressors and predictions.',
      type: 'pdf',
      url: `/files/reports/${filename}`,
      date: new Date(timestamp).toISOString(),
    };
    reports.unshift(newReport);
    saveReports(reports);
    res.json(newReport);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate report.' });
  }
});

// GET /api/reports
router.get('/', (req, res) => {
  const reports = loadReports();
  res.json(reports);
});

// DELETE /api/reports/:filename
router.delete('/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(REPORTS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  // Remove file
  fs.unlinkSync(filePath);
  // Remove from reports.json
  const reports = loadReports();
  const updatedReports = reports.filter(r => !r.url.endsWith('/' + filename));
  saveReports(updatedReports);
  res.json({ message: 'Report deleted' });
});

// Serve train-predictions for Prophet model actual vs predicted
router.get('/train-predictions', (req, res) => {
  const filePath = path.join(__dirname, '../utils/data/train_predictions.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
  } else {
    res.status(404).json({ error: 'Training predictions not found' });
  }
});

module.exports = router; 