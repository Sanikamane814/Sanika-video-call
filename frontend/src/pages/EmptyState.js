import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h6" color="text.secondary">
        No history found.
      </Typography>
      <Button 
        variant="outlined" 
        sx={{ mt: 2 }} 
        onClick={() => navigate('/home')}
      >
        Start a Meeting
      </Button>
    </Box>
  );
};

export default EmptyState;
