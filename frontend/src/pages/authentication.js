import * as React from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Fade,
  Divider,
  Link,
  IconButton,
  InputAdornment,
  Modal,
  Backdrop,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',
    },
    secondary: {
      main: '#004E89',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
          textTransform: 'none',
          fontWeight: 600,
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.375rem',
            '& fieldset': {
              borderColor: '#dee2e6',
            },
            '&:hover fieldset': {
              borderColor: '#FF6B35',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
    },
  },
});

const styles = {
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'linear-gradient(135deg, #FF6B35 0%, #004E89 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    margin: '1rem',
    backgroundColor: '#FF6B35',
    width: '64px',
    height: '64px',
  },
  form: {
    width: '100%',
    marginTop: '1rem',
  },
  submit: {
    margin: '1.5rem 0 1rem',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
    },
  },
  toggleButton: {
    borderRadius: '8px',
    fontWeight: '600',
    padding: '0.5rem',
    transition: 'all 0.2s ease',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  localVideo: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    width: '25%',
    minWidth: '200px',
    height: '25%',
    minHeight: '150px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    border: '2px solid white',
    zIndex: 100,
  },
  callControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    gap: '1rem',
  },
  controlButton: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  callHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#FF6B35',
    color: 'white',
  },
  demoButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 78, 137, 0.3)',
    },
  },
  statsBox: {
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    minWidth: '120px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  divider: {
    margin: '1.5rem 0',
    '&::before, &::after': {
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
  },
  link: {
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#FF6B35',
      textDecoration: 'underline',
    },
  },
  backdrop: {
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'relative',
    width: '90vw',
    height: '90vh',
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    outline: 'none',
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  passwordToggle: {
    color: '#666',
    '&:hover': {
      color: '#FF6B35',
    },
  },
  rememberMe: {
    '& .MuiTypography-root': {
      fontSize: '0.875rem',
      color: '#666',
    },
    '& .MuiCheckbox-root': {
      padding: '4px',
      color: '#666',
      '&.Mui-checked': {
        color: '#FF6B35',
      },
    },
  },
};

export default function Authentication() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState(0);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  
  // Video call states
  const [videoCallOpen, setVideoCallOpen] = React.useState(false);
  const [localStream, setLocalStream] = React.useState(null);
  const [remoteStream, setRemoteStream] = React.useState(null);
  const [videoEnabled, setVideoEnabled] = React.useState(true);
  const [audioEnabled, setAudioEnabled] = React.useState(true);
  const [screenSharing, setScreenSharing] = React.useState(false);
  const [callStatus, setCallStatus] = React.useState('disconnected');
  const [roomId, setRoomId] = React.useState('');
  const [callDuration, setCallDuration] = React.useState(0);
  const [callTimer, setCallTimer] = React.useState(null);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);
  const localVideoRef = React.useRef(null);
  const remoteVideoRef = React.useRef(null);

  // Initialize media stream
  const initMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      setError('Could not access camera/microphone');
      console.error('Media error:', err);
      return null;
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    try {
      if (screenSharing) {
        // Stop screen share and return to camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } else {
        // Start screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Handle when user stops screen sharing
        stream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
      }
      setScreenSharing(!screenSharing);
    } catch (err) {
      setError('Screen sharing error');
      console.error('Screen share error:', err);
    }
  };

  // Start a call
  const startCall = async () => {
    const stream = await initMediaStream();
    if (!stream) return;
    
    setCallStatus('connecting');
    setVideoCallOpen(true);
    
    // Simulate connecting to a room
    setTimeout(() => {
      setCallStatus('connected');
      // Generate random room ID
      const id = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomId(id);
      
      // Start call timer
      let seconds = 0;
      const timer = setInterval(() => {
        seconds++;
        setCallDuration(seconds);
      }, 1000);
      setCallTimer(timer);
      
      // Simulate remote stream after 2 seconds
      setTimeout(() => {
        // In a real app, this would be the remote user's stream
        setRemoteStream(stream.clone());
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream.clone();
        }
      }, 2000);
    }, 1500);
  };

  // End the call
  const endCall = () => {
    if (callTimer) clearInterval(callTimer);
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    setCallStatus('disconnected');
    setVideoCallOpen(false);
    setLocalStream(null);
    setRemoteStream(null);
    setCallDuration(0);
    setRoomId('');
  };

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAuth = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      if (formState === 0) {
        await handleLogin(username, password, rememberMe);
      } else {
        const result = await handleRegister(name, username, password);
        setUsername('');
        setPassword('');
        setName('');
        setFormState(0);
        setMessage(result);
        setOpenSnackbar(true);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAuth();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
      }
      if (callTimer) clearInterval(callTimer);
    };
  }, [localStream, remoteStream, callTimer]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={styles.root}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={6}
          md={7}
          sx={{
            ...styles.image,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 5,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'rotate 20s linear infinite',
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }} />
          
          <Box sx={{ 
            maxWidth: '600px',
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
          }}>
            <Typography variant="h2" sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }}>
              Experience Seamless Video Calling
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              my: 5,
              flexWrap: 'wrap',
            }}>
              <Box sx={styles.statsBox}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>10K+</Typography>
                <Typography variant="subtitle1">Daily Users</Typography>
              </Box>
              <Box sx={styles.statsBox}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>99.9%</Typography>
                <Typography variant="subtitle1">Uptime</Typography>
              </Box>
              <Box sx={styles.statsBox}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>50+</Typography>
                <Typography variant="subtitle1">Countries</Typography>
              </Box>
            </Box>
            
            <Typography variant="h5" sx={{ 
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}>
              Join thousands of users enjoying crystal clear video calls with end-to-end encryption
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4,
            }}>
              <Button 
                variant="outlined" 
                color="inherit"
                sx={{ borderWidth: 2 }}
              >
                Learn More
              </Button>
              <Button 
                variant="contained" 
                color="inherit"
                sx={{ 
                  color: 'primary.main',
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
                onClick={startCall}
              >
                Try Demo Call
              </Button>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={5} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Paper elevation={6} sx={{
            width: '100%',
            p: { xs: 3, sm: 4 },
            m: 3,
            maxWidth: '500px',
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Avatar sx={styles.avatar}>
                <LockOutlinedIcon fontSize="large" />
              </Avatar>

              <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                {formState === 0 ? 'Sign In to Your Account' : 'Create New Account'}
              </Typography>

              <Box sx={{
                display: 'flex',
                gap: 2,
                mb: 4,
                width: '100%',
              }}>
                <Button
                  fullWidth
                  variant={formState === 0 ? 'contained' : 'outlined'}
                  onClick={() => setFormState(0)}
                  sx={{ borderRadius: '12px' }}
                >
                  Sign In
                </Button>
                <Button
                  fullWidth
                  variant={formState === 1 ? 'contained' : 'outlined'}
                  onClick={() => setFormState(1)}
                  sx={{ borderRadius: '12px' }}
                >
                  Sign Up
                </Button>
              </Box>

              <Box 
                component="form" 
                noValidate 
                sx={styles.form}
                onKeyPress={handleKeyPress}
              >
                {formState === 1 && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus={formState === 1}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 3 }}
                  />
                )}

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus={formState === 0}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete={formState === 0 ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={styles.passwordToggle}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {formState === 0 && (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                  }}>
                    <Box sx={styles.rememberMe}>
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="rememberMe">
                        Remember me
                      </label>
                    </Box>
                  </Box>
                )}

                {error && (
                  <Fade in>
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  </Fade>
                )}

                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={styles.submit}
                  onClick={handleAuth}
                  disabled={isLoading || !username || !password || (formState === 1 && !name)}
                >
                  {isLoading ? 'Processing...' : formState === 0 ? 'Sign In' : 'Sign Up'}
                </Button>

                <Divider sx={styles.divider}>OR</Divider>

                <Typography variant="body2" sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                }}>
                  {formState === 0 ? 
                    "Don't have an account? " : 
                    "Already have an account? "}
                  <Link 
                    href="#" 
                    onClick={() => setFormState(formState === 0 ? 1 : 0)}
                    sx={styles.link}
                  >
                    {formState === 0 ? 'Sign Up' : 'Sign In'}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Video Call Modal */}
      <Modal
        open={videoCallOpen}
        onClose={endCall}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: styles.backdrop,
        }}
      >
        <Fade in={videoCallOpen}>
          <Box sx={styles.modalContent}>
            {/* Call header */}
            <Box sx={styles.callHeader}>
              <Typography variant="h6">
                {callStatus === 'connecting' ? 'Connecting...' : `Room: ${roomId}`}
              </Typography>
              <Typography variant="subtitle1">
                {callStatus === 'connected' && formatDuration(callDuration)}
              </Typography>
              <IconButton onClick={endCall} sx={{ color: 'white' }}>
                <Typography variant="body1">End Call</Typography>
              </IconButton>
            </Box>
            
            {/* Video content */}
            <Box sx={styles.videoContainer}>
              {/* Remote video */}
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.900',
                }}>
                  {callStatus === 'connecting' ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <CircularProgress color="primary" />
                      <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
                        Connecting to call...
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      Waiting for participant to join...
                    </Typography>
                  )}
                </Box>
              )}
              
              {/* Local video */}
              {localStream && (
                <Box sx={styles.localVideo}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'rotateY(180deg)',
                    }}
                  />
                </Box>
              )}
            </Box>
            
            {/* Call controls */}
            <Box sx={styles.callControls}>
              <IconButton
                onClick={toggleAudio}
                sx={{
                  ...styles.controlButton,
                  bgcolor: audioEnabled ? 'grey.300' : 'error.main',
                  '&:hover': { bgcolor: audioEnabled ? 'grey.400' : 'error.dark' },
                }}
              >
                {audioEnabled ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
              
              <IconButton
                onClick={toggleVideo}
                sx={{
                  ...styles.controlButton,
                  bgcolor: videoEnabled ? 'grey.300' : 'error.main',
                  '&:hover': { bgcolor: videoEnabled ? 'grey.400' : 'error.dark' },
                }}
              >
                {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
              
              <IconButton
                onClick={toggleScreenShare}
                sx={{
                  ...styles.controlButton,
                  bgcolor: screenSharing ? 'primary.main' : 'grey.300',
                  color: screenSharing ? 'white' : 'inherit',
                  '&:hover': { bgcolor: screenSharing ? 'primary.dark' : 'grey.400' },
                }}
              >
                {screenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
              </IconButton>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}









