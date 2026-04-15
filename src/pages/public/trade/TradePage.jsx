import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Box,
  Container,
  IconButton,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  Zoom,
  Modal,
  Fade,
  Backdrop,
  Button,
} from "@mui/material";
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  MoreVertical,
  ChevronUp,
  Calendar,
  FileIcon,
  HardDrive,
  Download,
  X,
  Grid3x3,
  List,
  BarChart3,
  ArrowUpRight,
  Globe,
  Plus,
} from "lucide-react";
import PageLayout from "../components/PageLayout";
import { useThemeColors } from "../../../utils/useThemeColors";

export default function TradePage() {
  const navigate = useNavigate();
  const themeColors = useThemeColors();
  const PRIMARY_COLOR = themeColors.teal;

  const [search, setSearch] = useState("");
  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState("trending");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [loadedCount, setLoadedCount] = useState(12);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tradeType: "Export Data",
    regions: [],
    budget: "",
    deadline: "",
    specifications: "",
    priorityLevel: "Medium",
  });
  const itemsPerLoad = 12;
  const loadMoreRef = useRef(null);
  const tradesTopRef = useRef(null);

  const sortOptions = [
    { value: "trending", label: "Trending" },
    { value: "most-active", label: "Most Active" },
    { value: "highest-volume", label: "Highest Volume" },
    { value: "newest", label: "Newest" },
    { value: "most-popular", label: "Most Popular" },
  ];

  const tradeRegions = [
    "All Regions",
    "North America",
    "Europe",
    "Asia Pacific",
    "Middle East & Africa",
    "Latin America",
  ];

  const tradeCategories = [
    "All Categories",
    "Export Markets",
    "Import Data",
    "Trade Compliance",
    "Market Analysis",
    "Trade Statistics",
    "Commerce Trends",
  ];

  const generateTradeDatasets = () => {
    const titles = [
      "Global Export Market Analysis",
      "International Trade Flow Data",
      "Cross-Border Commerce Trends",
      "Tariff and Trade Policy Database",
      "Global Shipping Analytics",
      "Trade Partner Performance Metrics",
      "Customs and Compliance Dataset",
      "Market Entry Strategy Data",
      "Trade Route Analytics",
      "International Business Intelligence",
      "Supply Chain Trade Data",
      "Commerce Partnership Database",
      "Regional Trade Agreements",
      "Trade Risk Assessment Data",
      "Import Export Regulations",
    ];

    const authors = [
      "Trade Analytics Lab",
      "Global Commerce Institute",
      "International Business Research",
      "Trade Data Consortium",
      "Commerce Intelligence Hub",
      "Global Markets Research",
      "International Trade Bureau",
      "Supply Chain Analytics",
    ];

    const regions = [
      "Asia Pacific",
      "Europe",
      "North America",
      "Middle East & Africa",
      "Latin America",
      "Middle East & Africa",
    ];

    const categories = [
      "Export Markets",
      "Import Data",
      "Trade Compliance",
      "Market Analysis",
      "Trade Statistics",
      "Commerce Trends",
      "Export Markets",
    ];

    const images = [
      "https://cdn.builder.io/api/v1/image/assets%2Fb3c38b43918148e48d3c3b0542eac5cf%2F5c9d84c9d41140fa99d6023c4dbc0942?format=webp&width=800&height=1200",
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1460925895917-adf4e5d1baaa?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1553531088-e57697a83eb8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    ];

    let id = 1;
    const trades = [];

    for (let i = 0; i < 60; i++) {
      const title = titles[(id - 1) % titles.length];
      const author = authors[(id - 1) % authors.length];
      const image = images[(id - 1) % images.length];
      const region = regions[(id - 1) % regions.length];

      trades.push({
        id,
        title: `${title} - ${region}`,
        author,
        region,
        usability: (9 + (id % 10) / 10).toFixed(1),
        updated: `Updated ${(id % 30) + 1} days ago`,
        files: `${((id % 5) + 1)} File${((id % 5) + 1) > 1 ? "s" : ""} (CSV)`,
        size: `${(id * 47) % 500 + 10} MB`,
        downloads: `${parseInt(1000 + id * 100)} downloads`,
        volume: `$${(id * 15000) % 500000 + 50000}M`,
        votes: (id * 3) % 150 + 10,
        image,
        category: categories[(id - 1) % categories.length],
        price: ((id * 29) % 999 + 100).toFixed(2),
        trend: `+${(id % 25) + 5}%`,
        trendUp: true,
        avatars: [
          `https://i.pravatar.cc/40?img=${(id % 150) + 1}`,
          `https://i.pravatar.cc/40?img=${((id + 1) % 150) + 1}`,
        ],
      });
      id++;
    }

    return trades;
  };

  // Generate once (theme toggles shouldn't regenerate large arrays)
  const tradeDatasets = useMemo(() => generateTradeDatasets(), []);

  useEffect(() => {
    setLoadedCount(itemsPerLoad);
  }, [search, sortBy, selectedRegion, selectedCategory]);

  const handleLoadMore = () => {
    setLoadedCount((prev) => prev + itemsPerLoad);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm({
      title: "",
      description: "",
      category: "",
      tradeType: "Export Data",
      regions: [],
      budget: "",
      deadline: "",
      specifications: "",
      priorityLevel: "Medium",
    });
  };

  const handleInputChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleRegionToggle = (region) => {
    setForm({
      ...form,
      regions: form.regions.includes(region)
        ? form.regions.filter(r => r !== region)
        : [...form.regions, region]
    });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.category || !form.budget || !form.deadline) {
      alert("Please fill in all required fields");
      return;
    }

    const newRequest = {
      id: `tr_${Date.now()}`,
      ...form,
      userId: localStorage.getItem('dali-user') ? JSON.parse(localStorage.getItem('dali-user')).id : 'user-1',
      userName: localStorage.getItem('dali-user') ? JSON.parse(localStorage.getItem('dali-user')).name : 'You',
      status: 'PENDING',
      createdAt: new Date(),
      proposals: [],
    };

    const existingRequests = JSON.parse(sessionStorage.getItem('tradeRequests') || '[]');
    existingRequests.push(newRequest);
    sessionStorage.setItem('tradeRequests', JSON.stringify(existingRequests));

    alert('Trade request created successfully! You will receive proposals from trade data providers.');
    handleCloseModal();
  };

  const filteredTrades = tradeDatasets
    .filter((trade) => {
      const matchesSearch =
        trade.title.toLowerCase().includes(search.toLowerCase()) ||
        trade.author.toLowerCase().includes(search.toLowerCase()) ||
        trade.region.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = selectedRegion === "All Regions" || trade.region === selectedRegion;
      const matchesCategory = selectedCategory === "All Categories" || trade.category === selectedCategory;
      return matchesSearch && matchesRegion && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "most-active":
          return b.votes - a.votes;
        case "highest-volume": {
          const aVolume = parseInt(a.volume.replace(/[$M,]/g, ""));
          const bVolume = parseInt(b.volume.replace(/[$M,]/g, ""));
          return bVolume - aVolume;
        }
        case "newest":
          return b.id - a.id;
        case "most-popular":
          return parseFloat(b.usability) - parseFloat(a.usability);
        case "trending":
        default:
          const heatA = a.votes * parseFloat(a.usability);
          const heatB = b.votes * parseFloat(b.usability);
          return heatB - heatA;
      }
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadedCount < filteredTrades.length) {
          setLoadedCount((prev) => prev + itemsPerLoad);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadedCount, filteredTrades.length]);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 380);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleBackToTop = () => {
    if (tradesTopRef.current) {
      tradesTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageLayout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "var(--bg-gray)",
          py: 4,
          position: "relative",
        }}
      >
        <Container maxWidth="xl">
          <Box
            ref={tradesTopRef}
            sx={{
              position: "relative",
              width: "100%",
            }}
          >
            {/* Header Section */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, mb: 4, flexWrap: { xs: "wrap", md: "nowrap" }, gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Globe size={28} color="var(--text-dark)" strokeWidth={2.5} />
                  <Typography
                    sx={{
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      color: "var(--text-dark)",
                    }}
                  >
                    Global Trade Marketplace
                  </Typography>
                </Box>
                <Typography sx={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "600px" }}>
                  Explore comprehensive trade and commerce datasets covering global market trends, import/export data, and international business intelligence.
                </Typography>
              </Box>
              <Box onClick={handleOpenModal} sx={{ px: 2.5, py: 1.2, backgroundColor: PRIMARY_COLOR, borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 1, whiteSpace: "nowrap", flexShrink: 0, "&:hover": { backgroundColor: "rgba(32, 178, 170, 0.85)" }, transition: "all 0.3s ease" }}>
                <Plus size={16} color="#fff" />
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>Request Custom Trade Data</Typography>
              </Box>
            </Box>

            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search trade datasets, markets, partners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                variant="outlined"
                sx={{
                  backgroundColor: "var(--bg-white)",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    height: 50,
                    fontSize: "0.95rem",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="var(--text-dark)" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Filter Chips */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                mb: 4,
                alignItems: "center",
              }}
            >
              {/* Region Chips */}
              <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                {tradeRegions.map((region) => {
                  const active = selectedRegion === region;
                  return (
                    <Chip
                      key={region}
                      label={region}
                      onClick={() => setSelectedRegion(region)}
                      variant="outlined"
                      sx={{
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        height: 32,
                        px: 1.5,
                        cursor: "pointer",
                        backgroundColor: active ? `${PRIMARY_COLOR}15` : "var(--bg-white)",
                        color: active ? PRIMARY_COLOR : "var(--text-dark)",
                        borderColor: active ? PRIMARY_COLOR : "var(--border-color)",
                        fontWeight: active ? 700 : 500,
                        "&:hover": { backgroundColor: active ? `${PRIMARY_COLOR}20` : "var(--hover-bg)" },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Trade Category Chips */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                mb: 4,
              }}
            >
              {tradeCategories.map((category) => {
                const active = selectedCategory === category;
                return (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => setSelectedCategory(category)}
                    variant="outlined"
                    sx={{
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      height: 30,
                      px: 1.5,
                      cursor: "pointer",
                      backgroundColor: active ? `${PRIMARY_COLOR}15` : "var(--bg-white)",
                      color: active ? PRIMARY_COLOR : "var(--text-muted)",
                      borderColor: active ? PRIMARY_COLOR : "var(--border-color)",
                      fontWeight: active ? 700 : 500,
                      "&:hover": { backgroundColor: active ? `${PRIMARY_COLOR}20` : "var(--hover-bg)" },
                    }}
                  />
                );
              })}
            </Box>

            {/* Controls */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 4,
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <BarChart3 size={24} color="var(--text-dark)" strokeWidth={2.5} />
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--text-dark)",
                  }}
                >
                  Trade Datasets
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                {/* Sorting Dropdown */}
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
                    transition: "all 0.2s",
                    minWidth: "140px",
                    height: 40,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover": {
                      backgroundColor: "var(--hover-bg)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "var(--hover-bg)",
                      outline: "none",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "var(--text-muted)",
                    },
                  }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>

                {/* View Toggle */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    backgroundColor: "var(--bg-secondary)",
                    borderRadius: "8px",
                    padding: "4px",
                    border: `1px solid var(--border-color)`,
                  }}
                >
                  <Box
              onClick={() => setViewType("grid")}
              sx={{
                p: 0.8,
                borderRadius: "6px",
                backgroundColor: viewType === "grid" ? `${PRIMARY_COLOR}15` : "transparent",
                border: viewType === "grid" ? `1px solid ${PRIMARY_COLOR}` : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: `${PRIMARY_COLOR}10`,
                },
              }}
              title="Grid View"
            >
              <Grid3x3 size={18} color={viewType === "grid" ? PRIMARY_COLOR : "var(--text-muted)"} />
            </Box>
                  <Box
              onClick={() => setViewType("list")}
              sx={{
                p: 0.8,
                borderRadius: "6px",
                backgroundColor: viewType === "list" ? `${PRIMARY_COLOR}15` : "transparent",
                border: viewType === "list" ? `1px solid ${PRIMARY_COLOR}` : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: `${PRIMARY_COLOR}10`,
                },
              }}
              title="List View"
            >
              <List size={18} color={viewType === "list" ? PRIMARY_COLOR : "var(--text-muted)"} />
            </Box>
                </Box>
              </Box>
            </Box>

            {/* Trade Cards Grid/List */}
            <Box
              sx={{
                display: viewType === "grid" ? "grid" : "flex",
                gridTemplateColumns:
                  viewType === "grid"
                    ? {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                      }
                    : undefined,
                flexDirection: viewType === "list" ? "column" : undefined,
                gap: 3,
              }}
            >
              {filteredTrades.length > 0 ? (
                filteredTrades.slice(0, loadedCount).map((trade) => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    viewType={viewType}
                  />
                ))
              ) : (
                <Box
                  sx={{
                    gridColumn: viewType === "grid" ? "1 / -1" : undefined,
                    textAlign: "center",
                    py: 6,
                    width: "100%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    No trade datasets found
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Load More Button */}
            {filteredTrades.length > loadedCount && (
              <Box
                ref={loadMoreRef}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 5,
                  mb: 2,
                }}
              >
                <Box
                  onClick={handleLoadMore}
                  sx={{
                    px: 3.5,
                    py: 1.2,
                    backgroundColor: PRIMARY_COLOR,
                    color: "#fff",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: `2px solid ${PRIMARY_COLOR}`,
                    "&:hover": {
                      filter: "brightness(0.95)",
                      transform: "translateY(-2px)",
                      boxShadow: `0 6px 16px ${PRIMARY_COLOR}33`,
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                  }}
                >
                  Load More
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Trade Request Modal */}
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
                <Box sx={{ p: 1, backgroundColor: `${PRIMARY_COLOR}20`, borderRadius: 1.5, display: "flex" }}>
                  <Plus size={20} color={PRIMARY_COLOR} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-dark)" }}>Request Custom Trade Data</Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Get specialized trade datasets tailored to your business requirements</Typography>
                </Box>
              </Box>
              <IconButton onClick={handleCloseModal} size="small" sx={{ color: themeColors.textMuted, "&:hover": { color: "var(--text-dark)", backgroundColor: themeColors.hoverBg } }}>
                <X size={20} />
              </IconButton>
            </Box>

            <Box sx={{ p: 3, overflowY: "auto", flex: 1 }}>
              {/* Section 1: Trade Request Overview */}
              <Box sx={{ mb: 3.5 }}>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY_COLOR, mb: 2.5, borderBottom: `2px solid ${PRIMARY_COLOR}`, pb: 1 }}>
                  📋 Request Details
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                      Request Title *
                    </Typography>
                    <TextField fullWidth placeholder="e.g. Southeast Asian Export Data" value={form.title} onChange={handleInputChange("title")} required
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                      Category *
                    </Typography>
                    <TextField fullWidth select value={form.category} onChange={handleInputChange("category")} required
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                      {tradeCategories.filter(c => c !== "All Categories").map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Box>

                <Box sx={{ mt: 2.5 }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                    Description *
                  </Typography>
                  <TextField fullWidth multiline rows={3} placeholder="Describe the trade data you need, products/services, trading partners, time period..." value={form.description} onChange={handleInputChange("description")} required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                </Box>
              </Box>

              {/* Section 2: Trade Specifications */}
              <Box sx={{ mb: 3.5 }}>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY_COLOR, mb: 2.5, borderBottom: `2px solid ${PRIMARY_COLOR}`, pb: 1 }}>
                  🌍 Trade Scope
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5, mb: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                      Trade Type *
                    </Typography>
                    <TextField fullWidth select value={form.tradeType} onChange={handleInputChange("tradeType")} required
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}>
                      <MenuItem value="Export Data">Export Data</MenuItem>
                      <MenuItem value="Import Data">Import Data</MenuItem>
                      <MenuItem value="Trade Routes">Trade Routes</MenuItem>
                      <MenuItem value="Tariff Analysis">Tariff Analysis</MenuItem>
                      <MenuItem value="Market Entry">Market Entry Data</MenuItem>
                    </TextField>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                      Additional Specifications
                    </Typography>
                    <TextField fullWidth placeholder="e.g. HS codes, product types, timeframe" value={form.specifications} onChange={handleInputChange("specifications")}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
                  </Box>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 1.2 }}>
                    Target Regions (Optional)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {tradeRegions.filter(r => r !== "All Regions").map(region => (
                      <Chip
                        key={region}
                        label={region}
                        onClick={() => handleRegionToggle(region)}
                        variant={form.regions.includes(region) ? "filled" : "outlined"}
                        sx={{
                          borderRadius: "6px",
                          fontSize: "0.82rem",
                          height: 30,
                          backgroundColor: form.regions.includes(region) ? PRIMARY_COLOR : "var(--card-bg)",
                          color: form.regions.includes(region) ? "#fff" : "var(--text-dark)",
                          borderColor: "var(--border-color)",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: form.regions.includes(region) ? PRIMARY_COLOR : "var(--bg-secondary)" }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Section 3: Budget & Timeline */}
              <Box sx={{ mb: 3.5 }}>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY_COLOR, mb: 2.5, borderBottom: `2px solid ${PRIMARY_COLOR}`, pb: 1 }}>
                  💼 Budget & Timeline
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-dark)", mb: 0.8 }}>
                      Budget (USD) *
                    </Typography>
                    <TextField fullWidth placeholder="e.g. 3000" type="number" value={form.budget} onChange={handleInputChange("budget")} required
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
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: PRIMARY_COLOR, mb: 2.5, borderBottom: `2px solid ${PRIMARY_COLOR}`, pb: 1 }}>
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
                sx={{ px: 4, py: 1, backgroundColor: PRIMARY_COLOR, "&:hover": { backgroundColor: "rgba(32, 178, 170, 0.85)" }, fontWeight: 700, textTransform: "none", boxShadow: "none", borderRadius: 2 }}>
                Submit Trade Request
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Zoom in={showBackToTop}>
        <Box
          onClick={handleBackToTop}
          role="button"
          aria-label="Back to top"
          sx={{
            position: "fixed",
            right: { xs: 16, md: 24 },
            bottom: { xs: 18, md: 28 },
            width: 52,
            height: 52,
            borderRadius: "50%",
            backgroundColor: PRIMARY_COLOR,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1300,
            boxShadow: `0 10px 24px ${PRIMARY_COLOR}44`,
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
            animation: "floatPulse 2.1s ease-in-out infinite",
            "@keyframes floatPulse": {
              "0%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-4px)" },
              "100%": { transform: "translateY(0)" },
            },
            "&:hover": {
              transform: "translateY(-3px) scale(1.06)",
              boxShadow: `0 14px 30px ${PRIMARY_COLOR}55`,
            },
          }}
        >
          <ChevronUp size={22} />
        </Box>
      </Zoom>
    </PageLayout>
  );
}

function TradeCard({ trade, viewType = "grid" }) {
  const navigate = useNavigate();
  const { teal: PRIMARY_COLOR } = useThemeColors();

  const handleOpenTrade = () => {
    navigate(`/dataset-info/${trade.id}`, {
      state: {
        dataset: trade,
      },
    });
  };

  // List view layout
  if (viewType === "list") {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          padding: 2.5,
          backgroundColor: "var(--card-bg)",
          border: `1px solid var(--border-color)`,
          borderRadius: "12px",
          transition: "all 0.3s ease",
          alignItems: "stretch",
          "&:hover": {
            boxShadow: "0 10px 24px rgba(97, 197, 195, 0.12)",
            borderColor: PRIMARY_COLOR,
          },
        }}
      >
        {/* Image Thumbnail */}
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "8px",
            backgroundImage: `url(${trade.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          }}
          onClick={handleOpenTrade}
        />

        {/* Content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Title and Info */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
              <Typography
                onClick={handleOpenTrade}
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--text-dark)",
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                  flex: 1,
                  "&:hover": {
                    color: PRIMARY_COLOR,
                  },
                }}
              >
                {trade.title}
              </Typography>
              <IconButton size="small" sx={{ minWidth: 32 }}>
                <MoreVertical size={16} />
              </IconButton>
            </Box>

            <Typography sx={{ fontSize: "0.85rem", color: "var(--text-muted)", mb: 1 }}>
              {trade.author} · {trade.region}
            </Typography>

            <Typography sx={{ fontSize: "0.8rem", color: "var(--text-dark)" }}>
              Visibility <b>{trade.usability}</b> · Trade Volume: <b>{trade.volume}</b>
            </Typography>
          </Box>

          {/* Footer Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1, justifyContent: "space-between" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.3,
                padding: "4px 8px",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "4px",
                fontSize: "0.8rem",
              }}
            >
              <ChevronUp size={14} />
              <span>{trade.votes}</span>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                padding: "6px 12px",
                backgroundColor: `${PRIMARY_COLOR}15`,
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: PRIMARY_COLOR,
              }}
            >
              <span>${trade.price} USD</span>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Grid view layout
  return (
    <Card
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "var(--card-bg)",
        border: `1px solid var(--border-color)`,
        boxShadow: "none",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 24px rgba(97, 197, 195, 0.12)",
          borderColor: PRIMARY_COLOR,
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          height: 130,
          backgroundImage: `url(${trade.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0)",
            transition: "backgroundColor 0.2s ease",
          },
          "&:hover::after": {
            backgroundColor: "rgba(0,0,0,0.1)",
          },
        }}
      >
        {/* Trending Badge */}
        {trade.trend && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "rgba(22, 22, 22, 0.85)",
              backdropFilter: "blur(4px)",
              padding: "4px 10px",
              borderRadius: "20px",
              zIndex: 2,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <TrendingUp size={14} color="#4ade80" />
            <Box
              sx={{
                width: "1.5px",
                height: "12px",
                backgroundColor: "#4ade80",
                mx: 0.2,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#4ade80",
                letterSpacing: "0.02em",
              }}
            >
              {trade.trend}
            </Typography>
          </Box>
        )}

        {/* Region Badge */}
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            backgroundColor: "rgba(97, 197, 195, 0.9)",
            backdropFilter: "blur(4px)",
            padding: "4px 10px",
            borderRadius: "20px",
            zIndex: 2,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Globe size={12} color="#fff" />
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {trade.region}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title and Menu */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
            mb: 1.5,
          }}
        >
          <Typography
            onClick={handleOpenTrade}
            sx={{
              fontSize: "0.98rem",
              fontWeight: 700,
              lineHeight: 1.4,
              color: "var(--text-dark)",
              cursor: "pointer",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              transition: "color 0.2s ease",
              "&:hover": {
                color: PRIMARY_COLOR,
              },
            }}
          >
            {trade.title}
          </Typography>

          <IconButton size="small" sx={{ mt: -0.5, minWidth: 32 }}>
            <MoreVertical size={16} />
          </IconButton>
        </Box>

        {/* Author and Region */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
          <Typography
            sx={{
              fontSize: "0.85rem",
              color: "var(--text-dark)",
              fontWeight: 500,
            }}
          >
            {trade.author}
          </Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "var(--border-color)" }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.3,
              fontSize: "0.8rem",
              color: PRIMARY_COLOR,
              fontWeight: 600,
            }}
          >
            <Globe size={12} />
            {trade.region}
          </Box>
        </Box>

        {/* Visibility and Updated */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
            mb: 1.5,
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          <Typography sx={{ fontSize: "inherit" }}>
            Visibility <b style={{ color: "var(--text-dark)" }}>{trade.usability}</b>
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Calendar size={14} />
            <Typography sx={{ fontSize: "inherit" }}>{trade.updated}</Typography>
          </Box>
        </Box>

        {/* Trade Volume - Flattened to one line */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            mb: 1.5,
            pb: 1.5,
            borderBottom: `1px solid var(--border-color)`,
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <BarChart3 size={14} color={PRIMARY_COLOR} />
            <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
              Volume: {trade.volume}
            </Typography>
          </Box>
          <Box sx={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "var(--border-color)", flexShrink: 0 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <Download size={14} color={PRIMARY_COLOR} />
            <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500 }}>
              {trade.downloads}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Footer */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: `1px solid var(--border-color)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: `1px solid var(--border-color)`,
            borderRadius: "6px",
            overflow: "hidden",
            backgroundColor: "var(--bg-white)",
          }}
        >
          <Box
            sx={{
              px: 1,
              py: 0.4,
              display: "flex",
              alignItems: "center",
              borderRight: `1px solid var(--border-color)`,
            }}
          >
            <ChevronUp size={14} />
          </Box>

          <Box sx={{ px: 1.2, py: 0.3 }}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {trade.votes}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
            padding: "6px 12px",
            backgroundColor: `${PRIMARY_COLOR}15`,
            borderRadius: "6px",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: PRIMARY_COLOR,
          }}
        >
          <span>${trade.price} USD</span>
        </Box>
      </Box>
    </Card>
  );
}
