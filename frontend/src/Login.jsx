import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/app'); // Redirect to slide generation form page
    } catch (err) {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#F4F6FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: 420, bgcolor: '#fff', borderRadius: 4, boxShadow: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4, pb: 4, px: 4 }}>
        <Typography variant="h3" align="center" sx={{ fontFamily: 'Protest Strike, sans-serif', color: '#0C21C1', fontWeight: 700, mb: 1 }}>
          SlideGenius
        </Typography>
        <Typography align="center" sx={{ color: '#0C21C1', fontWeight: 500, mb: 3, fontSize: 18 }}>
          Sign in to your account
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
            InputProps={{ sx: { borderRadius: '16px' } }}
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputProps={{
              sx: { borderRadius: '16px' },
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={() => setShowPassword(s => !s)} size="small" sx={{ minWidth: 0, color: '#0C21C1' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
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
              mb: 2,
              '&:hover': { backgroundColor: '#09177a' },
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </Box>
        {/* Sign up prompt row */}
        <Box sx={{ mt: 2, pb: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 18, mr: 1, color: '#222' }}>
            If you don&apos;t have an account you can
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="text"
            sx={{
              color: '#0C21C1',
              fontWeight: 600,
              fontSize: 18,
              textTransform: 'none',
              minWidth: 0,
              ml: 1,
              p: 0,
            }}
          >
            Sign up
          </Button>
        </Box>
      </Box>
    </Box>
  );
} 