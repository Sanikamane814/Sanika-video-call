import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  IconButton, 
  TextField, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Paper,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  styled
} from '@mui/material';
import {
  Restore as HistoryIcon,
  Videocam as VideoIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  ContentCopy as CopyIcon,
  Add as NewMeetingIcon
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom styled components with enhanced animations and effects
const GradientBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, #e0e5ec 100%)`,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(74, 107, 255, 0.08) 0%, transparent 50%)',
    zIndex: 0
  }
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.text.primary,
  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.drawer + 1,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  }
}));

const MainPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  borderRadius: theme.shape.borderRadius * 4,
  overflow: 'hidden',
  display: 'flex',
  height: '70vh',
  boxShadow: theme.shadows[10],
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 20px 40px -10px ${theme.palette.primary.light}`
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto'
  }
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.common.white,
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4)
  }
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(4),
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  [theme.breakpoints.down('md')]: {
    display: 'none'
  },
  '& img': {
    animation: 'float 6s infinite ease-in-out'
  }
}));

const JoinButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
  },
  '&:hover::after': {
    left: '100%',
    transition: 'all 0.6s ease'
  }
}));

const NewMeetingButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: theme.shape.borderRadius * 2,
  borderWidth: 2,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderWidth: 2,
    backgroundColor: 'transparent',
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 8px ${theme.palette.primary.light}`
  }
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  '&::before, &::after': {
    borderColor: theme.palette.divider
  },
  '& span': {
    padding: theme.spacing(0, 2),
    background: theme.palette.background.default,
    color: theme.palette.text.secondary,
    fontWeight: 600
  }
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  bgcolor: theme.palette.primary.main,
  width: 40,
  height: 40,
  fontSize: '1.2rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: `0 0 0 3px ${theme.palette.primary.light}`
  }
}));

const FloatingAnimation = styled(Box)({
  '@keyframes float': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
    '100%': { transform: 'translateY(0px)' }
  },
  animation: 'float 6s infinite ease-in-out'
});

// Custom theme with enhanced configurations
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6bff',
      light: '#6b87ff',
      dark: '#3a56cc'
    },
    secondary: {
      main: '#ff5c8d',
    },
    background: {
      default: '#f8faff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
      lineHeight: 1.3
    },
    body1: {
      lineHeight: 1.6
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        },
        contained: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.3s ease, transform 0.3s ease'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            transition: 'all 0.3s ease',
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(74, 107, 255, 0.2)'
            }
          }
        }
      }
    }
  }
});

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const { addToUserHistory, user } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) {
      showSnackbar('Please enter a meeting code', 'error');
      return;
    }
    
    try {
      await addToUserHistory(meetingCode);
      navigate(`/${meetingCode}`);
    } catch (error) {
      showSnackbar('Failed to join meeting', 'error');
      console.error("Join error:", error);
    }
  };

  const handleCreateNewMeeting = () => {
    const newMeetingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMeetingCode(newMeetingCode);
    showSnackbar('New meeting created! Copy the code to share', 'success');
  };

  const copyToClipboard = () => {
    if (!meetingCode) return;
    navigator.clipboard.writeText(meetingCode);
    showSnackbar('Meeting code copied to clipboard!', 'success');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
    showSnackbar('Logged out successfully');
  };

  return (
    <ThemeProvider theme={theme}>
      <GradientBackground>
        {/* App Bar */}
        <StyledAppBar position="static" elevation={0}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <VideoIcon color="primary" sx={{ 
                mr: 2, 
                fontSize: 32,
                borderRadius: '50%',
                padding: 1,
                backgroundColor: 'rgba(74, 107, 255, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(15deg)',
                  backgroundColor: 'rgba(74, 107, 255, 0.2)'
                }
              }} />
              <Typography variant="h6" component="div" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(90deg, #4a6bff 0%, #ff5c8d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}>
                Sanika Video Call
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                startIcon={<HistoryIcon />}
                onClick={() => navigate("/history")}
                sx={{ 
                  textTransform: 'none',
                  color: 'text.primary',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateY(-2px)',
                    color: 'primary.main'
                  }
                }}
              >
                History
              </Button>
              
              <IconButton 
                onClick={handleMenuOpen} 
                sx={{ 
                  p: 0,
                  '&:hover': {
                    transform: 'scale(1.1)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                <UserAvatar>
                  {user?.name?.charAt(0) || <PersonIcon />}
                </UserAvatar>
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 4,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    overflow: 'hidden',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '& .MuiMenuItem-root': {
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(74, 107, 255, 0.08)',
                        transform: 'translateX(4px)'
                      }
                    }
                  },
                }}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user?.name || 'User'}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem 
                  onClick={handleLogout} 
                  sx={{ 
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.04)'
                    }
                  }}
                >
                  <LogoutIcon sx={{ mr: 1.5 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </StyledAppBar>

        {/* Main Content */}
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
          zIndex: 1
        }}>
          <MainPaper>
            {/* Left Panel */}
            <LeftPanel>
              <Typography variant="h4" component="h1" gutterBottom sx={{
                '&:hover': {
                  background: 'linear-gradient(90deg, #4a6bff 0%, #ff5c8d 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transition: 'all 0.5s ease'
                }
              }}>
                Premium video meetings. Now free for everyone.
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                We re-engineered the video calling service to make it secure, reliable and accessible to everyone.
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Join or start a meeting
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter meeting code"
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                    InputProps={{
                      endAdornment: meetingCode && (
                        <IconButton 
                          onClick={copyToClipboard} 
                          size="small"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              color: 'primary.main',
                              transform: 'scale(1.2)'
                            }
                          }}
                        >
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      ),
                    }}
                    sx={{ maxWidth: 400 }}
                  />
                  
                  <JoinButton 
                    variant="contained" 
                    onClick={handleJoinVideoCall}
                    disabled={!meetingCode.trim()}
                    sx={{
                      '&:disabled': {
                        transform: 'none !important'
                      }
                    }}
                  >
                    Join
                  </JoinButton>
                </Box>
              </Box>
              
              <StyledDivider sx={{ my: 3 }}><span>OR</span></StyledDivider>
              
              <NewMeetingButton
                variant="outlined"
                color="primary"
                startIcon={<NewMeetingIcon />}
                onClick={handleCreateNewMeeting}
              >
                Create New Meeting
              </NewMeetingButton>
            </LeftPanel>
            
            {/* Right Panel */}
            <RightPanel>
              <FloatingAnimation>
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShuLZnqnsjjQ2gu1vZvOwG8K0GBz-RxL6SeCLf-f7f6NO5ZIS4iGuM5XN9L_5UZjkkxw0&usqp=CAU"
                  alt="Video Call Illustration" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto',
                    filter: 'drop-shadow(0px 10px 30px rgba(0, 0, 0, 0.2))',
                    transition: 'all 0.3s ease'
                  }} 
                />
              </FloatingAnimation>
            </RightPanel>
          </MainPaper>
        </Box>
      </GradientBackground>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.shadows[6],
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default withAuth(HomeComponent);
