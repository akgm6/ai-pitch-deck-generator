import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/app');
    } catch (err) {
      let msg = err.message.replace('Firebase: ', '');
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in or use a different email.';
      }
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#F4F6FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 4, width: '100%', maxWidth: 420, boxShadow: '0px 4px 24px rgba(12,33,193,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo/Headline */}
        <Typography align="center" variant="h3" sx={{ fontFamily: 'Protest Strike, sans-serif', color: '#0C21C1', fontWeight: 700, mb: 2 }}>
          SlideGenius
        </Typography>
        {/* Illustration (optional) */}
        <Box sx={{ width: 100, height: 100, bgcolor: '#E8EDFA', borderRadius: '50%', mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ color: '#0C21C1', fontWeight: 700, fontFamily: 'Protest Strike, sans-serif' }}>SG</Typography>
        </Box>
        <Typography variant="h5" sx={{ color: '#0C21C1', fontWeight: 700, mb: 1, fontFamily: 'Protest Strike, sans-serif', textAlign: 'center' }}>
          Welcome to SlideGenius
        </Typography>
        <Typography sx={{ color: '#222', fontSize: 16, maxWidth: 340, mx: 'auto', mb: 3, textAlign: 'center' }}>
          Create, edit, and present stunning pitch decks with the power of AI. Sign up to get started!
        </Typography>
        {/* Login prompt */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 16, color: '#222' }}>
            If you already have an account,{' '}
            <Button component={Link} to="/login" variant="text" sx={{ color: '#0C21C1', fontWeight: 600, fontSize: 16, textTransform: 'none', p: 0, minWidth: 0 }}>
              login
            </Button>
          </Typography>
        </Box>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputProps={{ sx: { borderRadius: '16px' } }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputProps={{ sx: { borderRadius: '16px' } }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputProps={{ sx: { borderRadius: '16px' } }}
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              borderRadius: '30px',
              backgroundColor: '#0C21C1',
              color: '#fff',
              fontWeight: 600,
              fontSize: 18,
              py: 1.2,
              boxShadow: '0px 4px 12px rgba(0,0,0,0.12)',
              mt: 1,
              '&:hover': { backgroundColor: '#09177a' },
            }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
} 