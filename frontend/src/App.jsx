import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  useTheme,
  Collapse,
  Fade,
  CircularProgress,
} from '@mui/material';
import EditableDeck from './EditableDeck';

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Wellness',
  'Retail',
  'Other',
];

function buildPrompt({ companyName, industry, problem, solution, businessModel, financials }) {
  return `Company Name: ${companyName}\nIndustry: ${industry}\nProblem Statement: ${problem}\nSolution: ${solution}\nBusiness Model: ${businessModel}\nFinancials: ${financials}`;
}

export default function App() {
  const [form, setForm] = useState({
    companyName: '',
    industry: '',
    problem: '',
    solution: '',
    businessModel: '',
    financials: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [error, setError] = useState('');
  const theme = useTheme();
  const slidesGenerated = slides.length > 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);
    setError('');
    setSlides([]);
    const prompt = buildPrompt(form);
    try {
      const fetchPromise = fetch('/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to generate slides');
          return res.json();
        })
        .then(data => data.slides || []);
      const timerPromise = new Promise(resolve => setTimeout(resolve, 4000));
      const [slidesResult] = await Promise.all([fetchPromise, timerPromise]);
      setSlides(slidesResult);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: slidesGenerated ? 'flex-start' : 'center',
        backgroundColor: '#F4F6FA',
        pt: slidesGenerated ? 4 : 0,
        transition: 'padding-top 0.4s',
      }}
    >
      {/* Loading Screen */}
      <Fade in={isLoading} timeout={500} unmountOnExit>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 2000,
            background: 'rgba(244,246,250,0.98)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={64} sx={{ color: '#0C21C1', mb: 4 }} />
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontFamily: 'Protest Strike, sans-serif',
              fontWeight: 700,
              color: '#0C21C1',
              mb: 2,
              letterSpacing: 1,
            }}
          >
            Generating the best pitch deck ever...
          </Typography>
        </Box>
      </Fade>
      {/* Form and Deck Layout (unchanged) */}
      <Collapse in={!slidesGenerated} timeout={500} unmountOnExit>
        <Card
          className="card"
          sx={{
            width: '100vw',
            maxWidth: 600,
            margin: 'auto',
            p: { xs: 2, sm: 4 },
            mb: 4,
            boxShadow: 3,
            borderRadius: 4,
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardContent sx={{ width: '100%', p: 0 }}>
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontFamily: 'Protest Strike, sans-serif',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3.5rem' },
                color: '#0C21C1',
                mb: 3,
                letterSpacing: 1,
              }}
            >
              SlideGenius
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <TextField
                    label="Company Name"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{ sx: { borderRadius: '20px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Industry"
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{ sx: { borderRadius: '20px' } }}
                  >
                    {industries.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Problem Statement"
                    name="problem"
                    value={form.problem}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    minRows={2}
                    InputProps={{ sx: { borderRadius: '20px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Solution"
                    name="solution"
                    value={form.solution}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    minRows={2}
                    InputProps={{ sx: { borderRadius: '20px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Business Model"
                    name="businessModel"
                    value={form.businessModel}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    minRows={2}
                    InputProps={{ sx: { borderRadius: '20px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Financials"
                    name="financials"
                    value={form.financials}
                    onChange={handleChange}
                    fullWidth
                    required
                    multiline
                    minRows={2}
                    InputProps={{ sx: { borderRadius: '20px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: '30px',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: 18,
                      py: 1.5,
                      mt: 1,
                      backgroundColor: '#0C21C1',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#09177a',
                      },
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Pitch Deck'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Collapse>
      <Collapse in={slidesGenerated} timeout={500} unmountOnExit>
        <Box sx={{ width: '100vw', maxWidth: 1100, mx: 'auto', mb: 4 }}>
          <Card
            className="card"
            sx={{
              width: '100%',
              maxWidth: 1100,
              margin: 'auto',
              p: { xs: 1, sm: 2 },
              mb: 4,
              boxShadow: 3,
              borderRadius: 4,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CardContent sx={{ width: '100%', p: 0 }}>
              <Typography
                variant="h4"
                align="center"
                sx={{
                  fontFamily: 'Protest Strike, sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  color: '#0C21C1',
                  mb: 2,
                  letterSpacing: 1,
                  transition: 'font-size 0.3s',
                }}
              >
                SlideGenius
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <Grid container spacing={1} alignItems="flex-end" justifyContent="center" wrap="nowrap">
                  <Grid item xs={12} md={2} zeroMinWidth>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      <TextField
                        label="Company Name"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        fullWidth
                        required
                        size="small"
                        InputProps={{ sx: { borderRadius: '14px', fontSize: 14, py: 0.5, height: 40 } }}
                        InputLabelProps={{ sx: { fontSize: 13 } }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2} zeroMinWidth>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      <TextField
                        select
                        label="Industry"
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        fullWidth
                        required
                        size="small"
                        InputProps={{ sx: { borderRadius: '14px', fontSize: 14, py: 0.5, height: 40 } }}
                        InputLabelProps={{ sx: { fontSize: 13 } }}
                      >
                        {industries.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2} zeroMinWidth>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      <TextField
                        label="Problem Statement"
                        name="problem"
                        value={form.problem}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        minRows={1}
                        size="small"
                        InputProps={{ sx: { borderRadius: '14px', fontSize: 14, py: 0.5, height: 40 } }}
                        InputLabelProps={{ sx: { fontSize: 13 } }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2} zeroMinWidth>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      <TextField
                        label="Solution"
                        name="solution"
                        value={form.solution}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        minRows={1}
                        size="small"
                        InputProps={{ sx: { borderRadius: '14px', fontSize: 14, py: 0.5, height: 40 } }}
                        InputLabelProps={{ sx: { fontSize: 13 } }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2} zeroMinWidth>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      <TextField
                        label="Business Model"
                        name="businessModel"
                        value={form.businessModel}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        minRows={1}
                        size="small"
                        InputProps={{ sx: { borderRadius: '14px', fontSize: 14, py: 0.5, height: 40 } }}
                        InputLabelProps={{ sx: { fontSize: 13 } }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2} zeroMinWidth>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      <TextField
                        label="Financials"
                        name="financials"
                        value={form.financials}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        minRows={1}
                        size="small"
                        InputProps={{ sx: { borderRadius: '14px', fontSize: 14, py: 0.5, height: 40 } }}
                        InputLabelProps={{ sx: { fontSize: 13 } }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      borderRadius: '16px',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: 13,
                      px: 3,
                      py: 0.5,
                      backgroundColor: '#0C21C1',
                      color: '#fff',
                      minWidth: 120,
                      '&:hover': {
                        backgroundColor: '#09177a',
                      },
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Regenerate Pitch Deck'}
                  </Button>
                </Box>
              </Box>
              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Collapse>
      {slidesGenerated && <EditableDeck slides={slides} />}
    </Box>
  );
}
