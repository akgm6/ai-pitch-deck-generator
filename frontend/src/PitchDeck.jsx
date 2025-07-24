import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Grid } from '@mui/material';

const defaultSlides = [
  {
    title: 'Introduction',
    content: 'This slide introduces the company and sets the tone for the pitch.',
    image: 'https://via.placeholder.com/400x200',
  },
  {
    title: 'Problem Statement',
    content: "We describe the key problem our target market is facing and why it's urgent.",
    image: 'https://via.placeholder.com/400x200',
  },
  // Add more slides as needed
];

export default function PitchDeck({ slides = defaultSlides }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3} direction="column">
        {slides.map((slide, idx) => (
          <Grid item key={idx}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                sx={{ width: 180, height: 90, mr: 3, borderRadius: 2 }}
                image={slide.image}
                alt={slide.title}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Slide {idx + 1}
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {slide.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {slide.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 