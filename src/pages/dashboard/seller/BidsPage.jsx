import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button, TextField, Modal, Fade,
  Backdrop, IconButton, Chip, LinearProgress, Tab, Tabs, Avatar, AvatarGroup,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  FileText, DollarSign, Calendar, Users, Zap, X, Plus, Send, CheckCircle,
  Clock, AlertCircle, TrendingUp, Star,
} from 'lucide-react';
import { useThemeColors } from '../../../utils/useThemeColors';
import projectRequestService from '../../../utils/projectRequestService';

const PRIMARY = '#FF8C00';
const SECONDARY = '#20B2AA';
const SUCCESS = '#16a34a';
const WARNING = '#f59e0b';
const DANGER = '#dc2626';

export default function BidsPage() {
  const themeColors = useThemeColors();
  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState([]);
  const [bids, setBids] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidForm, setBidForm] = useState({ price: '', deliveryTime: '', proposal: '' });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalBids: 0,
    pendingBids: 0,
    acceptedBids: 0,
    totalEarnings: 0,
  });

  // Get current user (demo: collaborator)
  const currentCollaboratorId = 'c1'; // Demo: Dr. Aisha Patel

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    try {
      // Get matching requests for this collaborator
      const matchingRequests = projectRequestService.getMatchingRequests(currentCollaboratorId);
      setRequests(matchingRequests);

      // Get all collaborator's bids
      const allRequests = projectRequestService.getAllRequests();
      const collaboratorBids = [];
      allRequests.forEach(r => {
        r.bids.forEach(b => {
          if (b.collaboratorId === currentCollaboratorId) {
            collaboratorBids.push({
              ...b,
              requestId: r.id,
              requestTitle: r.title,
              requestBudgetMin: r.budgetMin,
              requestBudgetMax: r.budgetMax,
              requestDeadline: r.deadline,
              buyerName: r.buyerName,
            });
          }
        });
      });
      setBids(collaboratorBids);

      // Get stats
      const collaboratorStats = projectRequestService.getCollaboratorStats(currentCollaboratorId);
      setStats(collaboratorStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidModalOpen = (request) => {
    setSelectedRequest(request);
    setBidForm({ price: '', deliveryTime: '', proposal: '' });
    setIsBidModalOpen(true);
  };

  const handleBidModalClose = () => {
    setIsBidModalOpen(false);
    setSelectedRequest(null);
    setBidForm({ price: '', deliveryTime: '', proposal: '' });
  };

  const handleSubmitBid = () => {
    if (!bidForm.price || !bidForm.deliveryTime || !bidForm.proposal) {
      alert('Please fill in all fields');
      return;
    }

    try {
      projectRequestService.submitBid(selectedRequest.id, {
        collaboratorId: currentCollaboratorId,
        collaboratorName: 'Dr. Aisha Patel',
        collaboratorAvatar: 'https://i.pravatar.cc/40?img=47',
        price: parseFloat(bidForm.price),
        deliveryTime: bidForm.deliveryTime,
        proposal: bidForm.proposal,
      });

      alert('Bid submitted successfully!');
      loadData();
      handleBidModalClose();
    } catch (error) {
      alert('Error submitting bid: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return { bg: '#fffbeb', color: WARNING, label: 'Pending' };
      case 'ACCEPTED':
        return { bg: '#f0fdf4', color: SUCCESS, label: 'Won' };
      case 'REJECTED':
        return { bg: '#fef2f2', color: DANGER, label: 'Lost' };
      default:
        return { bg: '#f9fafb', color: '#6b7280', label: status };
    }
  };

  const filteredBids = filter === 'all' ? bids : bids.filter(b => b.status.toLowerCase() === filter);

  const stats_cards = [
    { label: 'Active Bids', value: stats.pendingBids, icon: <Clock size={20} color={PRIMARY} /> },
    { label: 'Won Projects', value: stats.acceptedBids, icon: <CheckCircle size={20} color={SUCCESS} /> },
    { label: 'Total Bids', value: stats.totalBids, icon: <TrendingUp size={20} color={PRIMARY} /> },
    { label: 'Earnings', value: `$${stats.totalEarnings.toLocaleString()}`, icon: <DollarSign size={20} color={SECONDARY} /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: themeColors.bg, py: 4, transition: 'background-color 0.3s ease' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: themeColors.text, mb: 0.5, transition: 'color 0.3s ease' }}>
            Project Requests & Opportunities
          </Typography>
          <Typography sx={{ color: themeColors.textMuted, fontSize: '1rem', transition: 'color 0.3s ease' }}>
            Discover, request on, and win project requests from buyers
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
          {stats_cards.map((stat, idx) => (
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

        {/* Tabs */}
        <Box sx={{ mb: 3, borderBottom: `1px solid ${themeColors.border}`, transition: 'border-color 0.3s ease' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 'none' }} textColor="inherit">
            <Tab label="Available Opportunities" sx={{ textTransform: 'none', fontSize: '0.95rem', fontWeight: 600, color: themeColors.textMuted, '&.Mui-selected': { color: themeColors.text } }} />
            <Tab label="My Requests" sx={{ textTransform: 'none', fontSize: '0.95rem', fontWeight: 600, color: themeColors.textMuted, '&.Mui-selected': { color: themeColors.text } }} />
          </Tabs>
        </Box>

        {/* Tab 1: Available Opportunities */}
        {tabValue === 0 && (
          <Box>
            {loading ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography sx={{ color: themeColors.textMuted }}>Loading opportunities...</Typography>
              </Box>
            ) : requests.length === 0 ? (
              <Card sx={{ borderRadius: 2, border: `1px solid ${themeColors.border}`, boxShadow: 'none', p: 4, textAlign: 'center', backgroundColor: themeColors.card, transition: 'all 0.3s ease' }}>
                <AlertCircle size={48} color={themeColors.textMuted} style={{ margin: '0 auto 16px' }} />
                <Typography sx={{ color: themeColors.textMuted }}>
                  No matching opportunities found. Check back soon or update your profile!
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr' }, gap: 2.5 }}>
                {requests.map((request) => (
                  <OpportunityCard
                    key={request.id}
                    request={request}
                    onBid={() => handleBidModalOpen(request)}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Tab 2: My Requests */}
        {tabValue === 1 && (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
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
                label="Pending"
                onClick={() => setFilter('pending')}
                variant={filter === 'pending' ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: filter === 'pending' ? WARNING : themeColors.card,
                  color: filter === 'pending' ? '#fff' : themeColors.text,
                  borderColor: themeColors.border,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              />
              <Chip
                label="Won"
                onClick={() => setFilter('accepted')}
                variant={filter === 'accepted' ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: filter === 'accepted' ? SUCCESS : themeColors.card,
                  color: filter === 'accepted' ? '#fff' : themeColors.text,
                  borderColor: themeColors.border,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
              />
            </Box>

            {filteredBids.length === 0 ? (
              <Card sx={{ borderRadius: 2, border: `1px solid ${themeColors.border}`, boxShadow: 'none', p: 4, textAlign: 'center', backgroundColor: themeColors.card, transition: 'all 0.3s ease' }}>
                <FileText size={48} color={themeColors.textMuted} style={{ margin: '0 auto 16px' }} />
                <Typography sx={{ color: themeColors.textMuted }}>
                  No requests yet. Start requesting on opportunities!
                </Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr' }, gap: 2.5 }}>
                {filteredBids.map((bid) => (
                  <BidCard key={bid.id} bid={bid} />
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Request Modal */}
        <Modal
          open={isBidModalOpen}
          onClose={handleBidModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500, sx: { backgroundColor: 'rgba(17, 24, 39, 0.7)' } }}
        >
          <Fade in={isBidModalOpen}>
            <Box sx={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 }, bgcolor: themeColors.card, borderRadius: 3,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              p: 0, overflow: 'hidden', outline: 'none', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
              transition: 'background-color 0.3s ease'
            }}>
              {/* Modal Header */}
              <Box sx={{ px: 3, py: 2.5, backgroundColor: themeColors.bgSecondary, borderBottom: `1px solid ${themeColors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s ease' }}>
                <Box>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: themeColors.text, transition: 'color 0.3s ease' }}>
                    Submit Your Request
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: themeColors.textMuted, mt: 0.3, transition: 'color 0.3s ease' }}>
                    {selectedRequest?.title}
                  </Typography>
                </Box>
                <IconButton onClick={handleBidModalClose} size="small" sx={{ color: themeColors.textMuted, transition: 'color 0.3s ease' }}>
                  <X size={20} />
                </IconButton>
              </Box>

              {/* Modal Content */}
              <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
                {selectedRequest && (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3, p: 2, backgroundColor: themeColors.bgSecondary, borderRadius: 2, transition: 'background-color 0.3s ease' }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Budget Range</Typography>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: PRIMARY }}>
                        ${selectedRequest.budgetMin} - ${selectedRequest.budgetMax}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.75rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Deadline</Typography>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
                        {new Date(selectedRequest.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography sx={{ fontSize: '0.75rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Description</Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: themeColors.textMuted, lineHeight: 1.4, transition: 'color 0.3s ease' }}>
                        {selectedRequest.description.substring(0, 150)}...
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.text, mb: 0.8, transition: 'color 0.3s ease' }}>
                      Your Price Quote (USD) *
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      placeholder="e.g. 3500"
                      value={bidForm.price}
                      onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, color: themeColors.text, borderColor: themeColors.border }, '& .MuiOutlinedInput-notchedOutline': { borderColor: themeColors.border } }}
                    />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.text, mb: 0.8, transition: 'color 0.3s ease' }}>
                      Delivery Timeline *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g. 4 weeks"
                      value={bidForm.deliveryTime}
                      onChange={(e) => setBidForm({ ...bidForm, deliveryTime: e.target.value })}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, color: themeColors.text, borderColor: themeColors.border }, '& .MuiOutlinedInput-notchedOutline': { borderColor: themeColors.border } }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mt: 2.5 }}>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: themeColors.text, mb: 0.8, transition: 'color 0.3s ease' }}>
                    Your Proposal *
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Explain your approach, experience, and why you're the best fit for this project..."
                    value={bidForm.proposal}
                    onChange={(e) => setBidForm({ ...bidForm, proposal: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, color: themeColors.text, borderColor: themeColors.border }, '& .MuiOutlinedInput-notchedOutline': { borderColor: themeColors.border } }}
                  />
                </Box>
              </Box>

              {/* Modal Footer */}
              <Box sx={{ p: 2.5, backgroundColor: themeColors.bgSecondary, borderTop: `1px solid ${themeColors.border}`, display: 'flex', gap: 2, justifyContent: 'flex-end', transition: 'all 0.3s ease' }}>
                <Button onClick={handleBidModalClose} sx={{ px: 3, py: 1, color: themeColors.textMuted, fontWeight: 700, textTransform: 'none', transition: 'color 0.3s ease' }}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitBid}
                  variant="contained"
                  startIcon={<Send size={16} />}
                  disabled={!bidForm.price || !bidForm.deliveryTime || !bidForm.proposal}
                  sx={{
                    px: 4, py: 1, backgroundColor: PRIMARY, fontWeight: 700, textTransform: 'none',
                    boxShadow: 'none', borderRadius: 2, '&:hover': { backgroundColor: '#e67e00' }
                  }}
                >
                  Submit Request
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </Box>
  );
}

/**
 * Opportunity Card Component
 */
function OpportunityCard({ request, onBid }) {
  const themeColors = useThemeColors();

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
              {request.title}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: themeColors.textMuted, transition: 'color 0.3s ease' }}>
              Posted by {request.buyerName}
            </Typography>
          </Box>
          <Chip
            label={`Priority: ${request.priorityLevel}`}
            size="small"
            sx={{
              backgroundColor: request.priorityLevel === 'High' ? '#fee2e2' : '#fef3c7',
              color: request.priorityLevel === 'High' ? DANGER : WARNING,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          />
        </Box>

        <Typography sx={{ fontSize: '0.9rem', color: themeColors.textMuted, mb: 2, lineHeight: 1.5, transition: 'color 0.3s ease' }}>
          {request.description.substring(0, 120)}...
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3, p: 2, backgroundColor: themeColors.bgSecondary, borderRadius: 2, transition: 'background-color 0.3s ease' }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Budget</Typography>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: PRIMARY }}>
              ${request.budgetMin} - ${request.budgetMax}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Deadline</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              {new Date(request.deadline).toLocaleDateString()}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Data Type</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              {request.dataType}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Size</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              {request.datasetSize}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: `1fr auto`, gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', color: themeColors.textMuted, mb: 0.5, transition: 'color 0.3s ease' }}>Requests Submitted</Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              {request.bids?.length || 0} requests
            </Typography>
          </Box>
          <Button
            onClick={onBid}
            variant="contained"
            startIcon={<Plus size={16} />}
            sx={{
              backgroundColor: PRIMARY, color: '#fff', fontWeight: 700, textTransform: 'none',
              borderRadius: 1.5, alignSelf: 'flex-end', '&:hover': { backgroundColor: '#e67e00' }
            }}
          >
            Place Request
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Request Card Component
 */
function BidCard({ bid }) {
  const themeColors = useThemeColors();
  const statusColor = getStatusColorHelper(bid.status);

  return (
    <Card sx={{
      borderRadius: 2, border: `1px solid ${statusColor.border}`, boxShadow: 'none',
      backgroundColor: statusColor.bg,
      transition: 'all 0.3s ease'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: themeColors.text, mb: 0.5, transition: 'color 0.3s ease' }}>
              {bid.requestTitle}
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: themeColors.textMuted, transition: 'color 0.3s ease' }}>
              From {bid.buyerName}
            </Typography>
          </Box>
          <Chip
            label={bid.status === 'PENDING' ? 'Awaiting Response' : bid.status === 'ACCEPTED' ? 'Won' : 'Lost'}
            size="small"
            sx={{
              backgroundColor: statusColor.chipBg,
              color: statusColor.color,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Your Request</Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: PRIMARY }}>
              ${bid.price}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Budget Range</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              ${bid.requestBudgetMin} - ${bid.requestBudgetMax}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '0.7rem', color: themeColors.textMuted, mb: 0.3, transition: 'color 0.3s ease' }}>Delivery</Typography>
            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: themeColors.text, transition: 'color 0.3s ease' }}>
              {bid.deliveryTime}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2, backgroundColor: themeColors.bgSecondary, borderRadius: 1.5, mb: 2, transition: 'background-color 0.3s ease' }}>
          <Typography sx={{ fontSize: '0.85rem', color: themeColors.textMuted, lineHeight: 1.5, transition: 'color 0.3s ease' }}>
            <strong>Your Proposal:</strong> {bid.proposal}
          </Typography>
        </Box>

        <Typography sx={{ fontSize: '0.75rem', color: themeColors.textMuted, transition: 'color 0.3s ease' }}>
          Submitted {new Date(bid.submittedAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}

function getStatusColorHelper(status) {
  switch (status) {
    case 'PENDING':
      return {
        bg: '#fffbeb',
        color: '#f59e0b',
        border: '#fed7aa',
        chipBg: '#fef3c7',
      };
    case 'ACCEPTED':
      return {
        bg: '#f0fdf4',
        color: '#16a34a',
        border: '#bbf7d0',
        chipBg: '#dbeafe',
      };
    case 'REJECTED':
      return {
        bg: '#fef2f2',
        color: '#dc2626',
        border: '#fecaca',
        chipBg: '#fee2e2',
      };
    default:
      return {
        bg: '#f9fafb',
        color: '#6b7280',
        border: '#e5e7eb',
        chipBg: '#f3f4f6',
      };
  }
}
