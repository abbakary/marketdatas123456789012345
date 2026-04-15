import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, TextField, InputAdornment, Card, CardContent,
  Chip, Avatar, Tab, Tabs, LinearProgress, Select, MenuItem, Modal, Fade, Backdrop,
  IconButton, Button,
} from "@mui/material";
import {
  Search, BarChart3, TrendingUp, TrendingDown, Download, ChevronUp,
  Calendar, FileIcon, HardDrive, MoreVertical, Activity, Eye, Star,
  SlidersHorizontal, ArrowUpRight, ArrowDownRight,
  Grid3x3, List, Plus, X,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import { categoriesData } from "../components/CategorySidebar";
import { useThemeColors } from "../../../utils/useThemeColors";

const reportDatasets = [
  { id: 1, title: "Global Climate Trend Report 2024", author: "ClimateResearch Lab", category: "Agriculture and Environment", usability: "10.0", updated: "Updated 1 day ago", files: "5 Files (PDF, CSV)", size: "3.2 GB", downloads: "2,841 downloads", votes: 72, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80", price: "349.00", trend: "+18%", trendUp: true, views: 9420, rating: 4.9, description: "Comprehensive climate trend report with predictive models and historical comparisons." },
  { id: 2, title: "Financial Market Volatility Report", author: "QuantAnalytics", category: "Finance and Investment", usability: "9.8", updated: "Updated 3 days ago", files: "3 Files (PDF, CSV)", size: "1.4 GB", downloads: "1,562 downloads", votes: 58, image: "https://images.unsplash.com/photo-1460925895917-adf4e5d1baaa?auto=format&fit=crop&w=900&q=80", price: "599.00", trend: "+24%", trendUp: true, views: 7830, rating: 4.8, description: "Real-time volatility metrics and risk assessment for global financial markets." },
  { id: 3, title: "Healthcare Outcomes Statistical Report", author: "MedAnalytics", category: "Social Services", usability: "9.7", updated: "Updated 2 days ago", files: "4 Files (PDF, JSON)", size: "2.8 GB", downloads: "987 downloads", votes: 44, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80", price: "799.00", trend: "+12%", trendUp: true, views: 5210, rating: 4.7, description: "Statistical report on patient outcomes across 50+ healthcare facilities." },
  { id: 4, title: "AI Model Performance Report", author: "AIResearch Hub", category: "Computer Science", usability: "10.0", updated: "Updated 5 hours ago", files: "6 Files (PDF, JSON)", size: "8.1 GB", downloads: "3,214 downloads", votes: 89, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80", price: "899.00", trend: "+31%", trendUp: true, views: 12400, rating: 4.9, description: "Comprehensive report on 200+ AI models across NLP, vision, and reasoning tasks." },
  { id: 5, title: "Urban Traffic Pattern Report", author: "CityMetrics", category: "Infrastructure and Transport", usability: "9.5", updated: "Updated 4 days ago", files: "3 Files (PDF, CSV)", size: "1.9 GB", downloads: "743 downloads", votes: 33, image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?auto=format&fit=crop&w=900&q=80", price: "449.00", trend: "-5%", trendUp: false, views: 3890, rating: 4.5, description: "Traffic flow report and congestion prediction for 20 major cities." },
  { id: 6, title: "E-Commerce Conversion Report", author: "RetailData Pro", category: "Trade and Industry", usability: "9.6", updated: "Updated 6 days ago", files: "2 Files (PDF, CSV)", size: "920 MB", downloads: "1,102 downloads", votes: 47, image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=900&q=80", price: "299.00", trend: "+9%", trendUp: true, views: 6120, rating: 4.6, description: "Conversion funnel report and customer journey mapping for online retail." },
];

const categoryStats = [
  { name: "Computer Science", datasets: 84, growth: 31, color: "#3b82f6" },
  { name: "Finance", datasets: 62, growth: 18, color: "#10b981" },
  { name: "Healthcare", datasets: 55, growth: 12, color: "#f59e0b" },
  { name: "Agriculture", datasets: 48, growth: 8, color: "#22c55e" },
  { name: "Infrastructure", datasets: 41, growth: 15, color: "#8b5cf6" },
  { name: "Trade", datasets: 37, growth: 9, color: "#ef4444" },
];

export default function ReportPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewType, setViewType] = useState("grid"); // grid | list
  const [sortBy, setSortBy] = useState("hotness");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    reportType: "Market Analysis",
    scope: "National",
    budget: "",
    deadline: "",
    specifications: "",
    priorityLevel: "Medium",
  });
  const themeColors = useThemeColors();
  const PRIMARY = themeColors.teal;

  const topMetrics = [
    { label: "Total Reports Published", value: "1,245", change: "+12%", up: true, icon: <BarChart3 size={22} color={PRIMARY} /> },
    { label: "Avg Report Quality", value: "9.4", change: "+0.3", up: true, icon: <Star size={22} color={PRIMARY} /> },
    { label: "Total Downloads", value: "48.2K", change: "+24%", up: true, icon: <Download size={22} color={PRIMARY} /> },
    { label: "Active Researchers", value: "3,200", change: "+8%", up: true, icon: <Activity size={22} color={PRIMARY} /> },
  ];

  const categories = ["All", ...categoriesData.map(c => c.name)];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm({
      title: "",
      description: "",
      category: "",
      reportType: "Market Analysis",
      scope: "National",
      budget: "",
      deadline: "",
      specifications: "",
      priorityLevel: "Medium",
    });
  };

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.budget || !form.deadline) {
      alert("Please fill in all required fields");
      return;
    }

    const newRequest = {
      id: `rr_${Date.now()}`,
      ...form,
      userId: localStorage.getItem('dali-user') ? JSON.parse(localStorage.getItem('dali-user')).id : 'user-1',
      userName: localStorage.getItem('dali-user') ? JSON.parse(localStorage.getItem('dali-user')).name : 'You',
      status: 'PENDING',
      createdAt: new Date(),
      responses: [],
    };

    const existingRequests = JSON.parse(sessionStorage.getItem('reportRequests') || '[]');
    existingRequests.push(newRequest);
    sessionStorage.setItem('reportRequests', JSON.stringify(existingRequests));

    alert('Report request created successfully! You will receive proposals from research teams.');
    handleCloseModal();
  };

  const sortOptions = [
    { value: "hotness", label: "Hotness" },
    { value: "most-downloaded", label: "Most Downloaded" },
    { value: "most-viewed", label: "Most Viewed" },
    { value: "top-rated", label: "Top Rated" },
    { value: "most-voted", label: "Most Votes" },
  ];

  const filtered = useMemo(() => {
    let rows = reportDatasets.filter((d) => {
      const ms =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.author.toLowerCase().includes(search.toLowerCase());
      const mc = selectedCategory === "All" || d.category === selectedCategory;
      return ms && mc;
    });

    // Tab-based filtering (kept simple and predictable)
    if (tab === 1) rows = rows.filter((d) => d.trendUp);
    if (tab === 2) rows = [...rows].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (tab === 3) rows = [...rows].sort((a, b) => parseInt(String(b.downloads).replace(/[^0-9]/g, "")) - parseInt(String(a.downloads).replace(/[^0-9]/g, "")));

    // Sort dropdown
    rows = [...rows].sort((a, b) => {
      const aDownloads = parseInt(String(a.downloads).replace(/[^0-9]/g, ""));
      const bDownloads = parseInt(String(b.downloads).replace(/[^0-9]/g, ""));
      switch (sortBy) {
        case "most-downloaded":
          return bDownloads - aDownloads;
        case "most-viewed":
          return (b.views || 0) - (a.views || 0);
        case "top-rated":
          return (b.rating || 0) - (a.rating || 0);
        case "most-voted":
          return (b.votes || 0) - (a.votes || 0);
        case "hotness":
        default: {
          const heatA = (a.votes || 0) * parseFloat(a.usability || 0) + (a.views || 0) / 1000;
          const heatB = (b.votes || 0) * parseFloat(b.usability || 0) + (b.views || 0) / 1000;
          return heatB - heatA;
        }
      }
    });

    return rows;
  }, [search, selectedCategory, tab, sortBy]);

  return (
    <PageLayout>
      <Box sx={{ minHeight: "100vh", backgroundColor: "var(--bg-gray)", py: 4, transition: "background-color 0.3s ease" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, mb: 4, flexWrap: { xs: "wrap", md: "nowrap" }, gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <BarChart3 size={28} color={PRIMARY} />
                <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-dark)", transition: "color 0.3s ease" }}>
                  Analysed Reports
                </Typography>
              </Box>
              <Typography sx={{ color: "var(--text-muted)", fontSize: "1rem", transition: "color 0.3s ease" }}>
                Access comprehensive reports, research findings, and market intelligence from industry experts
              </Typography>
            </Box>
            <Box onClick={handleOpenModal} sx={{ px: 2.5, py: 1.2, backgroundColor: PRIMARY, borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 1, whiteSpace: "nowrap", flexShrink: 0, "&:hover": { backgroundColor: "rgba(32, 178, 170, 0.85)" }, transition: "all 0.3s ease" }}>
              <Plus size={16} color="#fff" />
              <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>Request Custom Report</Typography>
            </Box>
          </Box>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search reports, research, market insights..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            variant="outlined"
            sx={{ mb: 4, backgroundColor: "var(--card-bg)", borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 50 }, transition: "background-color 0.3s ease" }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={20} color="var(--text-muted)" /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><Box sx={{ display: "flex", alignItems: "center", gap: 1, color: PRIMARY, cursor: "pointer" }}><SlidersHorizontal size={18} /><Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: PRIMARY }}>Filters</Typography></Box></InputAdornment>,
            }}
          />

          {/* Metrics Row */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 2, mb: 4 }}>
            {topMetrics.map(m => (
              <Card key={m.label} sx={{ borderRadius: 2, border: "1px solid var(--border-color)", boxShadow: "none", transition: "all 0.3s ease" }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography sx={{ fontSize: "0.8rem", color: "var(--text-muted)", mb: 0.5, transition: "color 0.3s ease" }}>{m.label}</Typography>
                      <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-dark)", transition: "color 0.3s ease" }}>{m.value}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                        {m.up ? <ArrowUpRight size={14} color="#16a34a" /> : <ArrowDownRight size={14} color="#dc2626" />}
                        <Typography sx={{ fontSize: "0.8rem", color: m.up ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{m.change}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 1.2, borderRadius: 2, backgroundColor: "rgba(32, 178, 170, 0.1)" }}>{m.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Category Performance */}
          <Card sx={{ borderRadius: 2, border: "1px solid var(--border-color)", boxShadow: "none", mb: 4, transition: "all 0.3s ease" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-dark)", mb: 2.5, transition: "color 0.3s ease" }}>Category Performance</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)", lg: "repeat(3,1fr)" }, gap: 2 }}>
                {categoryStats.map(cat => (
                  <Box key={cat.name} sx={{ p: 2, borderRadius: 2, border: "1px solid var(--border-color)", backgroundColor: "var(--bg-secondary)", transition: "all 0.3s ease" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-dark)", transition: "color 0.3s ease" }}>{cat.name}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TrendingUp size={14} color="#16a34a" />
                        <Typography sx={{ fontSize: "0.8rem", color: "#16a34a", fontWeight: 600 }}>+{cat.growth}%</Typography>
                      </Box>
                    </Box>
                    <LinearProgress variant="determinate" value={(cat.datasets / 84) * 100} sx={{ height: 6, borderRadius: 3, backgroundColor: themeColors.border, "& .MuiLinearProgress-bar": { backgroundColor: cat.color, borderRadius: 3 } }} />
                    <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)", mt: 0.8, transition: "color 0.3s ease" }}>{cat.datasets} datasets</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Category Filter Chips */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {categories.slice(0, 8).map(cat => (
              <Chip key={cat} label={cat} onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "filled" : "outlined"}
                sx={{ borderRadius: "6px", fontSize: "0.82rem", height: 30, backgroundColor: selectedCategory === cat ? PRIMARY : "var(--card-bg)", color: selectedCategory === cat ? "#fff" : "var(--text-dark)", borderColor: "var(--border-color)", "&:hover": { backgroundColor: selectedCategory === cat ? PRIMARY : "var(--bg-secondary)" }, transition: "all 0.3s ease" }}
              />
            ))}
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: "1px solid var(--border-color)", mb: 3, transition: "border-color 0.3s ease" }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.9rem", color: "var(--text-muted)", transition: "color 0.3s ease" }, "& .MuiTabs-indicator": { backgroundColor: PRIMARY } }}>
              <Tab label="All Reports" />
              <Tab label="Trending" />
              <Tab label="Top Rated" />
              <Tab label="Most Downloaded" />
            </Tabs>
          </Box>

          {/* Controls: sort + view (always visible) */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.8,
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
                cursor: "pointer",
                border: `1px solid var(--border-color)`,
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-dark)",
                minWidth: 160,
                height: 40,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover": { backgroundColor: "var(--hover-bg)" },
                "& .MuiSvgIcon-root": { color: "var(--text-muted)" },
              }}
            >
              {sortOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ display: "flex", gap: 0.5, backgroundColor: "var(--bg-secondary)", borderRadius: "8px", padding: "4px", border: `1px solid var(--border-color)` }}>
              <Box
                onClick={() => setViewType("grid")}
                sx={{
                  p: 0.8,
                  borderRadius: "6px",
                  backgroundColor: viewType === "grid" ? "var(--card-bg)" : "transparent",
                  border: viewType === "grid" ? `1px solid var(--border-color)` : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "var(--hover-bg)" },
                }}
                title="Grid View"
              >
                <Grid3x3 size={18} color={viewType === "grid" ? PRIMARY : "var(--text-muted)"} />
              </Box>
              <Box
                onClick={() => setViewType("list")}
                sx={{
                  p: 0.8,
                  borderRadius: "6px",
                  backgroundColor: viewType === "list" ? "var(--card-bg)" : "transparent",
                  border: viewType === "list" ? `1px solid var(--border-color)` : "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": { backgroundColor: "var(--hover-bg)" },
                }}
                title="List View"
              >
                <List size={18} color={viewType === "list" ? PRIMARY : "var(--text-muted)"} />
              </Box>
            </Box>
          </Box>

          {/* Dataset Cards Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: viewType === "grid" ? { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" } : "1fr",
              gap: 3,
            }}
          >
            {filtered.map(d => (
              <ReportCard key={d.id} dataset={d} onOpen={() => navigate(`/dataset-info/${d.id}`, { state: { dataset: d } })} themeColors={themeColors} PRIMARY={PRIMARY} />
            ))}
          </Box>

          {filtered.length === 0 && (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <BarChart3 size={48} color={themeColors.border} style={{ margin: "0 auto 16px" }} />
              <Typography sx={{ color: "var(--text-muted)" }}>No reports found</Typography>
            </Box>
          )}

          {/* Report Request Modal */}
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500, sx: { backgroundColor: "rgba(17, 24, 39, 0.7)" } }}
          >
            <Fade in={isModalOpen}>
              <Box sx={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 650, md: 750 }, bgcolor: "var(--card-bg)", borderRadius: 3,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                p: 0, overflow: "hidden", outline: "none", maxHeight: "90vh", display: "flex", flexDirection: "column"
              }}>
                {/* Modal Header */}
                <Box sx={{ px: 3, py: 2.5, backgroundColor: themeColors.isDarkMode ? "rgba(30, 41, 59, 0.5)" : "#f9fafb", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ p: 1, backgroundColor: "rgba(32, 178, 170, 0.1)", borderRadius: 1.5, display: "flex" }}>
                      <Plus size={20} color={PRIMARY} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-dark)" }}>Request Custom Report</Typography>
                      <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Request a tailored research report to meet your specific business needs</Typography>
                    </Box>
                  </Box>
                  <IconButton onClick={handleCloseModal} size="small" sx={{ color: themeColors.textMuted, "&:hover": { color: "var(--text-dark)", backgroundColor: themeColors.hoverBg } }}>
                    <X size={20} />
                  </IconButton>
                </Box>

                <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
                  {/* Section 1: Report Overview */}
                  <Box sx={{ mb: 3.5 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY, mb: 2.5, borderBottom: `2px solid ${PRIMARY}`, pb: 1 }}>
                      📋 Report Details
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                          Report Title *
                        </Typography>
                        <TextField fullWidth placeholder="e.g. Global E-commerce Market Trends 2024" value={form.title} onChange={handleInputChange("title")} required
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Box>

                      <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                          Category *
                        </Typography>
                        <TextField fullWidth select value={form.category} onChange={handleInputChange("category")} required
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                          {categories.filter(c => c !== "All").map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2.5 }}>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                        Report Description *
                      </Typography>
                      <TextField fullWidth multiline rows={3} placeholder="Describe the research topic, key questions to address, target audience, and desired format..." value={form.description} onChange={handleInputChange("description")} required
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                    </Box>
                  </Box>

                  {/* Section 2: Report Specifications */}
                  <Box sx={{ mb: 3.5 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY, mb: 2.5, borderBottom: `2px solid ${PRIMARY}`, pb: 1 }}>
                      🎯 Report Scope
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 2.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                          Report Type *
                        </Typography>
                        <TextField fullWidth select value={form.reportType} onChange={handleInputChange("reportType")} required
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                          <MenuItem value="Market Analysis">Market Analysis</MenuItem>
                          <MenuItem value="Competitive Research">Competitive Research</MenuItem>
                          <MenuItem value="Industry Report">Industry Report</MenuItem>
                          <MenuItem value="Trend Analysis">Trend Analysis</MenuItem>
                          <MenuItem value="Custom Research">Custom Research</MenuItem>
                        </TextField>
                      </Box>

                      <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                          Geographic Scope *
                        </Typography>
                        <TextField fullWidth select value={form.scope} onChange={handleInputChange("scope")} required
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                          <MenuItem value="Local">Local</MenuItem>
                          <MenuItem value="National">National</MenuItem>
                          <MenuItem value="Regional">Regional</MenuItem>
                          <MenuItem value="Global">Global</MenuItem>
                        </TextField>
                      </Box>

                      <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                          Additional Specifications
                        </Typography>
                        <TextField fullWidth placeholder="e.g. Page count, format preferences, data sources" value={form.specifications} onChange={handleInputChange("specifications")}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Box>
                    </Box>
                  </Box>

                  {/* Section 3: Budget & Timeline */}
                  <Box sx={{ mb: 3.5 }}>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY, mb: 2.5, borderBottom: `2px solid ${PRIMARY}`, pb: 1 }}>
                      💼 Budget & Timeline
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                          Budget (USD) *
                        </Typography>
                        <TextField fullWidth placeholder="e.g. 5000" type="number" value={form.budget} onChange={handleInputChange("budget")} required
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Box>

                      <Box>
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                          Deadline *
                        </Typography>
                        <TextField fullWidth type="date" value={form.deadline} onChange={handleInputChange("deadline")} required
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                      </Box>
                    </Box>
                  </Box>

                  {/* Section 4: Priority */}
                  <Box>
                    <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY, mb: 2.5, borderBottom: `2px solid ${PRIMARY}`, pb: 1 }}>
                      ⚡ Priority
                    </Typography>
                    <Box>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                        Priority Level
                      </Typography>
                      <TextField fullWidth select value={form.priorityLevel} onChange={handleInputChange("priorityLevel")}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Urgent">Urgent</MenuItem>
                      </TextField>
                    </Box>
                  </Box>
                </Box>

                {/* Modal Footer */}
                <Box sx={{ p: 2.5, backgroundColor: themeColors.isDarkMode ? "rgba(30, 41, 59, 0.5)" : "#f9fafb", borderTop: "1px solid var(--border-color)", display: "flex", gap: 2, justifyContent: "flex-end" }}>
                  <Button onClick={handleCloseModal} sx={{ px: 3, py: 1, color: "var(--text-muted)", fontWeight: 700, textTransform: "none" }}>Cancel</Button>
                  <Button onClick={handleSubmit} variant="contained" disabled={!form.title || !form.category || !form.budget || !form.deadline}
                    sx={{ px: 4, py: 1, backgroundColor: PRIMARY, "&:hover": { backgroundColor: "rgba(32, 178, 170, 0.85)" }, fontWeight: 700, textTransform: "none", boxShadow: "none", borderRadius: 2 }}>
                    Submit Report Request
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Modal>
        </Container>
      </Box>
    </PageLayout>
  );
}

function ReportCard({ dataset, onOpen, themeColors, PRIMARY }) {
  return (
    <Card sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-color)", boxShadow: "none", transition: "all 0.3s ease", cursor: "pointer", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 10px 24px rgba(97,197,195,0.12)", borderColor: PRIMARY } }} onClick={onOpen}>
      {/* Image */}
      <Box sx={{ height: 160, backgroundImage: `url(${dataset.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, left: 8, px: 1, py: 0.4, borderRadius: 1, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", gap: 0.5 }}>
          {dataset.trendUp ? <TrendingUp size={12} color="#4ade80" /> : <TrendingDown size={12} color="#f87171" />}
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: dataset.trendUp ? "#4ade80" : "#f87171" }}>{dataset.trend}</Typography>
        </Box>
        <Box sx={{ position: "absolute", top: 8, right: 8, px: 1, py: 0.4, borderRadius: 1, backgroundColor: "rgba(0,0,0,0.6)" }}>
          <Typography sx={{ fontSize: "0.72rem", color: "#fff" }}>{dataset.category}</Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        {/* Title */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1, mb: 1 }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-dark)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dataset.title}</Typography>
          <MoreVertical size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
        </Box>

        <Typography sx={{ fontSize: "0.85rem", color: "var(--text-dark)", fontWeight: 500, mb: 1 }}>{dataset.author}</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.5, fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <Typography sx={{ fontSize: "inherit" }}>Usability <b style={{ color: "var(--text-dark)" }}>{dataset.usability}</b></Typography>
          <Box sx={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: themeColors.border }} />
          <Calendar size={12} />
          <Typography sx={{ fontSize: "inherit" }}>{dataset.updated}</Typography>
        </Box>

        {/* Stats row */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 1.5, fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><Eye size={12} /><span>{dataset.views.toLocaleString()} views</span></Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><Star size={12} color="#f59e0b" /><span>{dataset.rating}</span></Box>
        </Box>

        {/* File Details */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0.8, mb: 2, pb: 2, borderBottom: "1px solid var(--border-color)" }}>
          {[{ icon: <FileIcon size={13} color={PRIMARY} />, label: dataset.files }, { icon: <HardDrive size={13} color={PRIMARY} />, label: dataset.size }, { icon: <Download size={13} color={PRIMARY} />, label: dataset.downloads }].map((item, i) => (
            <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.4, p: 0.8, borderRadius: 1.5, backgroundColor: "var(--bg-secondary)" }}>
              {item.icon}
              <Typography sx={{ fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.3 }}>{item.label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "6px", overflow: "hidden" }}>
            <Box sx={{ px: 1, py: 0.4, borderRight: "1px solid var(--border-color)", display: "flex", alignItems: "center" }}><ChevronUp size={13} /></Box>
            <Box sx={{ px: 1.2, py: 0.3 }}><Typography sx={{ fontSize: "0.78rem", fontWeight: 700 }}>{dataset.votes}</Typography></Box>
          </Box>
          <Box sx={{ px: 1.5, py: 0.6, backgroundColor: "rgba(32, 178, 170, 0.1)", borderRadius: "6px" }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: PRIMARY }}>${dataset.price} USD</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
