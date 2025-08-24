import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import {
  IconButton,
  Box,
  Chip,
  CircularProgress,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import VideocamIcon from '@mui/icons-material/Videocam';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';

export default function History() {
    const { getHistoryOfUser, deleteMeeting } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const [filteredMeetings, setFilteredMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [meetingToDelete, setMeetingToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
    const itemsPerPage = 6;
    
    const routeTo = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        filterAndSortMeetings();
    }, [meetings, searchTerm, sortBy, sortOrder]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const history = await getHistoryOfUser();
            setMeetings(history);
        } catch (error) {
            showSnackbar('Failed to load meeting history', 'error');
        } finally {
            setLoading(false);
        }
    };

    const refreshHistory = async () => {
        await fetchHistory();
        showSnackbar('Meeting history refreshed', 'success');
    };

    const filterAndSortMeetings = () => {
        let result = [...meetings];
        
        // Filter by search term
        if (searchTerm) {
            result = result.filter(meeting => 
                meeting.meetingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (meeting.date && meeting.date.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        // Sort meetings
        result.sort((a, b) => {
            let aValue, bValue;
            
            switch(sortBy) {
                case 'date':
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case 'code':
                    aValue = a.meetingCode;
                    bValue = b.meetingCode;
                    break;
                default:
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        setFilteredMeetings(result);
        setPage(1); // Reset to first page when filters change
    };

    const handleDeleteClick = (meeting) => {
        setMeetingToDelete(meeting);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteMeeting(meetingToDelete.id);
            setMeetings(meetings.filter(m => m.id !== meetingToDelete.id));
            showSnackbar('Meeting deleted successfully', 'success');
        } catch (error) {
            showSnackbar('Failed to delete meeting', 'error');
        } finally {
            setDeleteDialogOpen(false);
            setMeetingToDelete(null);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showSnackbar('Copied to clipboard', 'success');
    };

    const shareMeeting = (meeting) => {
        if (navigator.share) {
            navigator.share({
                title: `Meeting: ${meeting.meetingCode}`,
                text: `Check out this meeting from ${formatDate(meeting.date)}`,
                url: window.location.href,
            }).catch(() => {
                copyToClipboard(meeting.meetingCode);
            });
        } else {
            copyToClipboard(meeting.meetingCode);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSortMenuClick = (event) => {
        setSortMenuAnchor(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setSortMenuAnchor(null);
    };

    const handleSortSelect = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        handleSortMenuClose();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Calculate pagination
    const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);
    const paginatedMeetings = filteredMeetings.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <div className="min-vh-100 d-flex flex-column" style={{
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            {/* Header */}
            <nav className="navbar navbar-dark px-3 py-2" style={{
                background: "linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
            }}>
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <Box display="flex" alignItems="center">
                        <VideocamIcon sx={{ mr: 1, fontSize: 28 }} />
                        <h3 className="text-white m-0" style={{ fontWeight: 600 }}>Meeting History</h3>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            background: 'rgba(255,255,255,0.2)', 
                            borderRadius: '20px',
                            px: 1,
                            mr: 1,
                            [theme.breakpoints.down('sm')]: { display: 'none' }
                        }}>
                            <SearchIcon sx={{ color: 'white', mr: 0.5 }} />
                            <TextField
                                variant="standard"
                                placeholder="Search meetings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                    style: { color: 'white' }
                                }}
                                sx={{ 
                                    input: { 
                                        color: 'white',
                                        '&::placeholder': { color: 'rgba(255,255,255,0.7)' }
                                    },
                                    width: 150
                                }}
                            />
                        </Box>
                        <IconButton
                            sx={{ 
                                mr: 1,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                            }}
                            onClick={handleSortMenuClick}
                            title="Sort meetings"
                        >
                            <SortIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <IconButton
                            sx={{ 
                                mr: 1,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                            }}
                            onClick={refreshHistory}
                            title="Refresh history"
                        >
                            <RefreshIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <IconButton
                            sx={{ 
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                            }}
                            onClick={() => routeTo("/home")}
                            title="Back to Home"
                        >
                            <HomeIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Box>
                </div>
            </nav>

            {/* Sort Menu */}
            <Menu
                anchorEl={sortMenuAnchor}
                open={Boolean(sortMenuAnchor)}
                onClose={handleSortMenuClose}
            >
                <MenuItem onClick={() => handleSortSelect('date')}>
                    <ListItemIcon>
                        <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText>
                        Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSortSelect('code')}>
                    <ListItemIcon>
                        <VideocamIcon />
                    </ListItemIcon>
                    <ListItemText>
                        Meeting Code {sortBy === 'code' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </ListItemText>
                </MenuItem>
            </Menu>

            {/* Mobile Search */}
            {isMobile && (
                <Box sx={{ p: 2, background: 'rgba(255,255,255,0.5)' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search meetings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                        size="small"
                    />
                </Box>
            )}

            {/* Content */}
            <div className="container my-5 flex-grow-1">
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                        <CircularProgress size={60} thickness={4} sx={{ color: '#4776E6' }} />
                    </Box>
                ) : filteredMeetings.length !== 0 ? (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="body2" color="text.secondary">
                                Showing {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''}
                                {searchTerm && ` for "${searchTerm}"`}
                            </Typography>
                            {searchTerm && (
                                <Button 
                                    size="small" 
                                    onClick={() => setSearchTerm('')}
                                    color="primary"
                                >
                                    Clear search
                                </Button>
                            )}
                        </Box>
                        
                        <div className="row g-4">
                            {paginatedMeetings.map((e, i) => (
                                <div key={i} className="col-md-6 col-lg-4">
                                    <Card
                                        variant="outlined"
                                        className="h-100"
                                        sx={{
                                            borderRadius: "16px",
                                            transition: "all 0.3s ease",
                                            background: "rgba(255, 255, 255, 0.8)",
                                            backdropFilter: "blur(10px)",
                                            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                                            border: "1px solid rgba(255, 255, 255, 0.5)",
                                            '&:hover': {
                                                transform: "translateY(-8px)",
                                                boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{ 
                                                        fontWeight: 700,
                                                        background: "linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)",
                                                        WebkitBackgroundClip: "text",
                                                        WebkitTextFillColor: "transparent"
                                                    }}
                                                >
                                                    {e.meetingCode}
                                                </Typography>
                                                <Chip 
                                                    icon={<GroupsIcon />} 
                                                    label={e.participants || "N/A"} 
                                                    size="small" 
                                                    color="secondary" 
                                                    variant="outlined"
                                                />
                                            </Box>
                                            
                                            <Box display="flex" alignItems="center" mt={2} color="text.secondary">
                                                <CalendarMonthIcon sx={{ fontSize: 20, mr: 1 }} />
                                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                    {formatDate(e.date)}
                                                </Typography>
                                            </Box>
                                            
                                            {e.startTime && (
                                                <Box display="flex" alignItems="center" mt={1} color="text.secondary">
                                                    <AccessTimeIcon sx={{ fontSize: 20, mr: 1 }} />
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {formatTime(e.startTime)}
                                                        {e.endTime && ` - ${formatTime(e.endTime)}`}
                                                    </Typography>
                                                </Box>
                                            )}
                                            
                                            {e.duration && (
                                                <Box mt={2}>
                                                    <Chip 
                                                        label={`Duration: ${e.duration}`} 
                                                        size="small" 
                                                        color="primary" 
                                                        variant="filled"
                                                    />
                                                </Box>
                                            )}
                                            
                                            <Box mt={3} display="flex" justifyContent="space-between">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => shareMeeting(e)}
                                                    title="Share meeting"
                                                >
                                                    <ShareIcon />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => copyToClipboard(e.meetingCode)}
                                                    title="Copy meeting code"
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => handleDeleteClick(e)}
                                                    title="Delete meeting"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                        
                        {totalPages > 1 && (
                            <Box display="flex" justifyContent="center" mt={4}>
                                <Pagination 
                                    count={totalPages} 
                                    page={page} 
                                    onChange={(e, value) => setPage(value)} 
                                    color="primary" 
                                />
                            </Box>
                        )}
                    </>
                ) : (
                    <Box className="text-center py-5" sx={{ 
                        background: "rgba(255, 255, 255, 0.7)", 
                        borderRadius: "16px",
                        backdropFilter: "blur(10px)",
                        maxWidth: 500,
                        margin: "0 auto",
                        p: 4
                    }}>
                        <Box fontSize="4rem" mb={2}>📭</Box>
                        <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                            {searchTerm ? 'No meetings found' : 'No meetings yet'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {searchTerm 
                                ? `No meetings match your search for "${searchTerm}"` 
                                : 'Your meeting history will appear here once you have scheduled meetings.'}
                        </Typography>
                        {searchTerm ? (
                            <Button 
                                variant="outlined" 
                                onClick={() => setSearchTerm('')}
                                sx={{
                                    borderRadius: "8px",
                                    px: 3,
                                    py: 1,
                                    fontWeight: 600
                                }}
                            >
                                Clear Search
                            </Button>
                        ) : (
                            <Button 
                                variant="contained" 
                                onClick={() => routeTo("/home")}
                                sx={{
                                    background: "linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)",
                                    borderRadius: "8px",
                                    px: 3,
                                    py: 1,
                                    fontWeight: 600
                                }}
                            >
                                Schedule a Meeting
                            </Button>
                        )}
                    </Box>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Meeting</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the meeting with code "{meetingToDelete?.meetingCode}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Footer */}
            <footer className="py-3 text-center border-top mt-auto" style={{
                background: "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(10px)"
            }}>
                <small className="text-muted">
                    © {new Date().getFullYear()} Sanika Video Call. All rights reserved.
                </small>
            </footer>

            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={3000} 
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSnackbar({...snackbar, open: false})} 
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Add some custom styles */}
            <style>
                {`
                body {
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
                    background-attachment: fixed;
                }
                `}
            </style>
        </div>
    );
}