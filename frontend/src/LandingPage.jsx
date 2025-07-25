import React from 'react';
import { Box, Container, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#F4F6FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm" sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          {/* SlideGenius Logo (matches app header) */}
          <Typography
            variant="h3"
            align="center"
            sx={{ fontFamily: 'Protest Strike, sans-serif', color: '#0C21C1', fontWeight: 700, mb: 1, letterSpacing: 1 }}
          >
            SlideGenius
          </Typography>
          {/* Intro Text */}
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 1, color: '#0C21C1', fontFamily: 'Protest Strike, sans-serif' }}>
            Turn ideas into Impactful Pitch Decks
          </Typography>
          <Typography align="center" sx={{ color: '#222', fontSize: 18, mb: 2, maxWidth: 420 }}>
            An AI-Powered tool that transforms your concepts into beautifully designed, persuasive pitch decks—in minutes.
          </Typography>
        </Box>

        {/* Divider/Spacing */}
        <Divider sx={{ width: '100%', mb: 4 }} />

        {/* Sign Up Section */}
        <Box sx={{ width: '100%', mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: '#0C21C1' }}>
            Ready to build your deck?
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 3, color: '#0C21C1' }}>
            Sign up and start creating today.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ borderRadius: '30px', fontWeight: 600, fontSize: 18, py: 1.2, mb: 3, backgroundColor: '#0C21C1', '&:hover': { backgroundColor: '#09177a' } }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Box>

        {/* Divider with "or" */}
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 3 }}>
          <Divider sx={{ flex: 1, borderColor: '#bbb' }} />
          <Typography sx={{ mx: 2, color: '#888', fontWeight: 500 }}>or</Typography>
          <Divider sx={{ flex: 1, borderColor: '#bbb' }} />
        </Box>

        {/* Sign In Section */}
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2, color: '#0C21C1' }}>
            Already have an account?
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ borderRadius: '30px', fontWeight: 600, fontSize: 18, py: 1.2, borderColor: '#0C21C1', color: '#0C21C1', '&:hover': { backgroundColor: '#E8EDFA', borderColor: '#0C21C1' } }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Box>
      </Container>
    </Box>
  );
} 