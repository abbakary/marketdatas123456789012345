import { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton,
} from '@mui/material';
import {
  Folder, Eye, AlertCircle, TrendingUp, Trash2, FileText,
} from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';

const PRIMARY = '#FF8C00';
const SECONDARY = '#20B2AA';
const SUCCESS = '#16a34a';

export default function AdminProjectsPage() {
  const themeColors = useThemeColors();
  const [projects, setProjects] = useState([
    {
      id: 'proj1',
      title: 'AI Dataset Annotation Project',
      description: 'Large-scale annotation of images for AI model training',
      owner: 'Jane Buyer',
      createdAt: new Date('2024-09-01'),
      status: 'Active',
      collaborators: 5,
    },
    {
      id: 'proj2',
      title: 'Market Research Data Collection',
      description: 'Collecting market research data across multiple regions',
      owner: 'John Smith',
      createdAt: new Date('2024-08-25'),
      status: 'Active',
      collaborators: 3,
    },
  ]);
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#f0fdf4', color: SUCCESS, label: 'Active' };
      case 'Completed':
        return { bg: '#e6f7f6', color: SECONDARY, label: 'Completed' };
      default:
        return { bg: '#f9fafb', color: '#6b7280', label: status };
    }
  };

  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.status.toLowerCase() === filter.toLowerCase());

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'Active').length,
    totalCollaborators: projects.reduce((sum, p) => sum + p.collaborators, 0),
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: themeColors.bg, py: 4, transition: 'background-color 0.3s ease' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: themeColors.text, mb: 0.5, transition: 'color 0.3s ease' }}>
            Custom Projects Management
          </Typography>
          <Typography sx={{ color: themeColors.textMuted, fontSize: '1rem', transition: 'color 0.3s ease' }}>
            Manage and monitor all custom projects
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 4 }}>
          {[
            { label: 'Total Projects', value: stats.total, icon: <Folder size={20} color={PRIMARY} /> },
            { label: 'Active', value: stats.active, icon: <TrendingUp size={20} color={SUCCESS} /> },
            { label: 'Collaborators', value: stats.totalCollaborators, icon: <FileText size={20} color={SECONDARY} /> },
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
            label="Active"
            onClick={() => setFilter('active')}
            variant={filter === 'active' ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: filter === 'active' ? SUCCESS : themeColors.card,
              color: filter === 'active' ? '#fff' : themeColors.text,
              borderColor: themeColors.border,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          />
          <Chip
            label="Completed"
            onClick={() => setFilter('completed')}
            variant={filter === 'completed' ? 'filled' : 'outlined'}
            sx={{
              backgroundColor: filter === 'completed' ? SECONDARY : themeColors.card,
              color: filter === 'completed' ? '#fff' : themeColors.text,
              borderColor: themeColors.border,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
          />
        </Box>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <Card sx={{ borderRadius: 2, border: `1px solid ${themeColors.border}`, boxShadow: 'none', p: 4, textAlign: 'center', backgroundColor: themeColors.card, transition: 'all 0.3s ease' }}>
            <AlertCircle size={48} color={themeColors.textMuted} style={{ margin: '0 auto 16px' }} />
            <Typography sx={{ color: themeColors.textMuted }}>
              No projects found
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr' }, gap: 2.5 }}>
            {filteredProjects.map((project) => (
              <AdminProjectCard
                key={project.id}
                project={project}
                themeColors={themeColors}
                onView={() => {
                  setSelectedProject(project);
                  setDetailsOpen(true);
                }}
                onDelete={() => alert('Project deleted')}
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
          {selectedProject && (
            <>
              <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', color: themeColors.text, transition: 'color 0.3s ease' }}>
                Project Details
              </DialogTitle>
              <DialogContent sx={{ py: 3, color: themeColors.text, transition: 'color 0.3s ease' }}>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.textMuted, mb: 0.5 }}>Title</Typography>
                    <Typography sx={{ fontSize: '1rem', color: themeColors.text }}>{selectedProject.title}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.textMuted, mb: 0.5 }}>Description</Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: themeColors.text }}>{selectedProject.description}</Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.textMuted, mb: 0.5 }}>Owner</Typography>
                      <Typography sx={{ fontSize: '1rem', color: themeColors.text }}>{selectedProject.owner}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.textMuted, mb: 0.5 }}>Collaborators</Typography>
                      <Typography sx={{ fontSize: '1rem', color: themeColors.text }}>{selectedProject.collaborators}</Typography>
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
 * Admin Project Card Component
 */
function AdminProjectCard({ project, themeColors, onView, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#f0fdf4', color: '#16a34a', label: 'Active' };
      case 'Completed':
        return { bg: '#e6f7f6', color: '#20B2AA', label: 'Completed' };
      default:
        return { bg: '#f9fafb', color: '#6b7280', label: status };
    }
  };

  const statusColor = getStatusColor(project.status);

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
              {project.title}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: themeColors.textMuted, transition: 'color 0.3s ease' }}>
              By {project.owner}
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
          {project.description.substring(0, 120)}...
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 3, p: 2, backgroundColor: themeColors.bgSecondary, borderRadius: 2, transition: 'background-color 0.3s ease' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Created</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              {project.createdAt.toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Collaborators</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#FF8C00' }}>
              {project.collaborators}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Status</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              {project.status}
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
