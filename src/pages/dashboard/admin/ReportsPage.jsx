import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import {
  FileText, Eye, X, AlertCircle, TrendingUp, Trash2, Download,
} from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';

const PRIMARY = '#FF8C00';
const SECONDARY = '#20B2AA';
const SUCCESS = '#16a34a';

export default function AdminReportsPage() {
  const themeColors = useThemeColors();
  const [reports, setReports] = useState([
    {
      id: 'rep1',
      title: 'Q3 Market Analysis Report',
      description: 'Comprehensive analysis of market trends and insights for Q3',
      category: 'Market Analysis',
      createdAt: new Date('2024-09-15'),
      requestedBy: 'Jane Buyer',
      status: 'Published',
      views: 1250,
    },
    {
      id: 'rep2',
      title: 'Data Science Trends 2024',
      description: 'Latest trends and innovations in data science field',
      category: 'Industry Trends',
      createdAt: new Date('2024-09-10'),
      requestedBy: 'John Smith',
      status: 'Published',
      views: 890,
    },
  ]);
  const [filter, setFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published':
        return { bg: '#f0fdf4', color: SUCCESS, label: 'Published' };
      case 'Draft':
        return { bg: '#fffbeb', color: '#f59e0b', label: 'Draft' };
      default:
        return { bg: '#f9fafb', color: '#6b7280', label: status };
    }
  };

  const filteredReports = filter === 'all' ? reports : reports.filter(r => r.status.toLowerCase() === filter.toLowerCase());

  const stats = {
    total: reports.length,
    published: reports.filter(r => r.status === 'Published').length,
    totalViews: reports.reduce((sum, r) => sum + r.views, 0),
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: themeColors.bg, py: 4, transition: 'background-color 0.3s ease' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: themeColors.text, mb: 0.5, transition: 'color 0.3s ease' }}>
            Custom Reports Management
          </Typography>
          <Typography sx={{ color: themeColors.textMuted, fontSize: '1rem', transition: 'color 0.3s ease' }}>
            Manage and monitor all custom reports
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
          {[
            { label: 'Total Reports', value: stats.total, icon: <FileText size={20} color={PRIMARY} /> },
            { label: 'Published', value: stats.published, icon: <TrendingUp size={20} color={SUCCESS} /> },
            { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: <Eye size={20} color={SECONDARY} /> },
          ].map((stat, idx) => (
            <Card key={idx} sx={{ borderRadius: 2, border: `1px solid ${themeColors.border}`, boxShadow: 'none', backgroundColor: themeColors.card, transition: 'all 0.3s ease' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.8rem', color: themeColors.textMuted, mb: 0.5, transition: 'color 0.3s ease' }}>
                      {stat.label}
                    </Typography>
                    <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: themeColors.text, transition: 'color 0.3s ease' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1, backgroundColor: `${SECONDARY}20`, borderRadius: 2, display: 'flex' }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Filter Chips */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="All"
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: filter === 'all' ? PRIMARY : themeColors.card,
              color: filter === 'all' ? '#fff' : themeColors.text,
              borderColor: themeColors.border,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          />
          <Chip
            label="Published"
            onClick={() => setFilter('published')}
            variant={filter === 'published' ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: filter === 'published' ? SUCCESS : themeColors.card,
              color: filter === 'published' ? '#fff' : themeColors.text,
              borderColor: themeColors.border,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          />
        </Box>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <Card sx={{ borderRadius: 2, border: `1px solid ${themeColors.border}`, boxShadow: 'none', p: 4, textAlign: 'center', backgroundColor: themeColors.card, transition: 'all 0.3s ease' }}>
            <AlertCircle size={48} color={themeColors.textMuted} style={{ margin: '0 auto 16px' }} />
            <Typography sx={{ color: themeColors.textMuted }}>
              No reports found
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr' }, gap: 2.5 }}>
            {filteredReports.map((report) => (
              <AdminReportCard
                key={report.id}
                report={report}
                themeColors={themeColors}
                onView={() => {
                  setSelectedReport(report);
                  setDetailsOpen(true);
                }}
                onDelete={() => alert('Report deleted')}
              />
            ))}
          </Box>
        )}

        {/* Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { backgroundColor: themeColors.card, transition: 'background-color 0.3s ease' } }}
        >
          {selectedReport && (
            <>
              <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', color: themeColors.text, transition: 'color 0.3s ease' }}>
                Report Details
              </DialogTitle>
              <DialogContent sx={{ py: 3, color: themeColors.text, transition: 'color 0.3s ease' }}>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.textMuted, mb: 0.5 }}>Title</Typography>
                    <Typography sx={{ fontSize: '1rem', color: themeColors.text }}>{selectedReport.title}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.textMuted, mb: 0.5 }}>Description</Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: themeColors.text }}>{selectedReport.description}</Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.textMuted, mb: 0.5 }}>Created</Typography>
                      <Typography sx={{ fontSize: '1rem', color: themeColors.text }}>{selectedReport.createdAt.toLocaleDateString()}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.textMuted, mb: 0.5 }}>Views</Typography>
                      <Typography sx={{ fontSize: '1rem', color: themeColors.text }}>{selectedReport.views}</Typography>
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={() => setDetailsOpen(false)} sx={{ color: themeColors.textMuted, fontWeight: 700 }}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}

/**
 * Admin Report Card Component
 */
function AdminReportCard({ report, themeColors, onView, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Published':
        return { bg: '#f0fdf4', color: '#16a34a', label: 'Published' };
      case 'Draft':
        return { bg: '#fffbeb', color: '#f59e0b', label: 'Draft' };
      default:
        return { bg: '#f9fafb', color: '#6b7280', label: status };
    }
  };

  const statusColor = getStatusColor(report.status);

  return (
    <Card sx={{
      borderRadius: 2, border: `1px solid ${themeColors.border}`, boxShadow: 'none', backgroundColor: themeColors.card,
      transition: 'all 0.3s ease', '&:hover': {
        transform: 'translateY(-2px)', boxShadow: '0 10px 24px rgba(97,197,195,0.12)',
        borderColor: PRIMARY
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: themeColors.text, mb: 0.5, transition: 'color 0.3s ease' }}>
              {report.title}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: themeColors.textMuted, transition: 'color 0.3s ease' }}>
              {report.category} • By {report.requestedBy}
            </Typography>
          </Box>
          <Chip
            label={statusColor.label}
            size="small"
            sx={{
              backgroundColor: statusColor.bg,
              color: statusColor.color,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          />
        </Box>

        <Typography sx={{ fontSize: '0.9rem', color: themeColors.textMuted, mb: 2, lineHeight: 1.5, transition: 'color 0.3s ease' }}>
          {report.description.substring(0, 120)}...
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3, p: 2, backgroundColor: themeColors.bgSecondary, borderRadius: 2, transition: 'background-color 0.3s ease' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Category</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              {report.category}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Created</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              {report.createdAt.toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Views</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#FF8C00' }}>
              {report.views}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={onView}
            variant="contained"
            startIcon={<Eye size={16} />}
            sx={{
              backgroundColor: '#FF8C00', color: '#fff', fontWeight: 700, textTransform: 'none',
              borderRadius: 1.5, flex: 1, '&:hover': { backgroundColor: '#e67e00' }
            }}
          >
            View Details
          </Button>
          <IconButton
            onClick={onDelete}
            sx={{
              color: '#dc2626', borderRadius: 1.5,
              '&:hover': { backgroundColor: '#fef2f2' }
            }}
          >
            <Trash2 size={18} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
