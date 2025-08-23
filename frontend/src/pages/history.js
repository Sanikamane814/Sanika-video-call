// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import {
//   Card,
//   CardContent,
//   Typography,
//   IconButton,
//   Box,
//   CircularProgress,
//   Container,
//   Alert
// } from '@mui/material';
// import HomeIcon from '@mui/icons-material/Home';

// export default function History() {
//   const { getHistoryOfUser } = useContext(AuthContext);
//   const [meetings, setMeetings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         setLoading(true);
//         const response = await getHistoryOfUser();
        
//         // Handle both direct array and object with history property
//         const historyData = Array.isArray(response) 
//           ? response 
//           : response?.history || [];
        
//         if (!Array.isArray(historyData)) {
//           throw new Error('Invalid data format received');
//         }
        
//         setMeetings(historyData);
//       } catch (err) {
//         console.error('Failed to fetch history:', err);
//         setError(err.message || 'Failed to load meeting history');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [getHistoryOfUser]);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date not available';
    
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Invalid date';
      
//       return date.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (e) {
//       console.error('Date formatting error:', e);
//       return 'Invalid date format';
//     }
//   };

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={4}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Container maxWidth="md">
//         <Alert severity="error" sx={{ mt: 3 }}>
//           {error}
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md">
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
//         <IconButton onClick={() => navigate('/home')} sx={{ mr: 1 }}>
//           <HomeIcon />
//         </IconButton>
//         <Typography variant="h5">Meeting History</Typography>
//       </Box>

//       {meetings.length === 0 ? (
//         <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
//           No meetings found in your history
//         </Typography>
//       ) : (
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//           {meetings.map((meeting, index) => (
//             <Card key={index} variant="outlined">
//               <CardContent>
//                 <Typography variant="h6" component="div">
//                   Meeting Code: {meeting.meetingCode || 'N/A'}
//                 </Typography>
//                 <Typography color="text.secondary" sx={{ mt: 1 }}>
//                   Date: {formatDate(meeting.date)}
//                 </Typography>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>
//       )}
//     </Container>
//   );
// }


import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Container,
  Alert,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import EventIcon from '@mui/icons-material/Event';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getHistoryOfUser();
        
        // Handle both direct array and object with history property
        const historyData = Array.isArray(response) 
          ? response 
          : response?.history || [];
        
        if (!Array.isArray(historyData)) {
          throw new Error('Invalid data format received');
        }
        
        setMeetings(historyData);
      } catch (err) {
        console.error('Failed to fetch history:', err);
        setError(err.message || 'Failed to load meeting history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date format';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
          {error}
          <Box mt={1}>
            <IconButton onClick={() => window.location.reload()} color="inherit" size="small">
              <Typography variant="body2">Try Again</Typography>
            </IconButton>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4, 
          p: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          boxShadow: 2
        }}>
          <IconButton 
            onClick={() => navigate('/home')} 
            sx={{ 
              mr: 2,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <HistoryIcon fontSize="large" color="primary" />
            Meeting History
          </Typography>
        </Box>

        {meetings.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            mt: 8,
            p: 4,
            borderRadius: 2,
            backgroundColor: 'background.paper'
          }}>
            <EventIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No meetings found in your history
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Your attended meetings will appear here
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {meetings.map((meeting, index) => (
              <Card key={index} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2,
                    gap: 2
                  }}>
                    <Avatar sx={{ 
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40
                    }}>
                      <MeetingRoomIcon />
                    </Avatar>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {meeting.meetingCode || 'N/A'}
                    </Typography>
                    <Chip 
                      label={`#${index + 1}`} 
                      size="small" 
                      sx={{ 
                        ml: 'auto',
                        backgroundColor: 'secondary.main',
                        color: 'white'
                      }} 
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2,
                    gap: 1
                  }}>
                    <EventIcon color="action" />
                    <Typography variant="body1" color="text.secondary">
                      {formatDate(meeting.date)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}