import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Paper,
  Button,
  Grid,
  IconButton,
  Fade,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import AddIcon from '@mui/icons-material/Add';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import SendIcon from '@mui/icons-material/Send';

const SIDEBAR_WIDTH = 180;

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((slide, idx) => ({ ...slide, slideNumber: idx + 1 }));
}

function getDefaultSlide(idx) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    slideNumber: idx + 1,
    title: `New Slide ${idx + 1}`,
    content: '',
  };
}

// Mock AI slide regeneration
function regenerateMockSlide(slideId, feedback, prevSlide) {
  // Simulate GPT-style varied output for content only
  const contentVariations = [
    `This is a regenerated version of the slide content. ${feedback ? 'Feedback: ' + feedback + '. ' : ''}The content is now more professional, engaging, and tailored to your needs.`,
    `Based on your feedback${feedback ? ' (“' + feedback + '”)' : ''}, this content is now clearer, more persuasive, and audience-focused.`,
    `AI Regenerated Content: ${feedback ? feedback + '. ' : ''}This slide now uses improved structure and language for maximum impact.`,
  ];
  const newContent = contentVariations[Math.floor(Math.random() * contentVariations.length)];
  return {
    ...prevSlide,
    // Keep the title unchanged
    content: newContent,
  };
}

// Mock AI speaker notes/chatbot
function generateMockSpeakerNotes(slideContent, userMessage) {
  const responses = [
    `Emphasize the key point: "${slideContent.slice(0, 40)}...". Use a confident tone and connect with the audience.`,
    `Here's a persuasive note: Highlight the benefits and address potential objections.`,
    `To make this slide more engaging, start with a question, then deliver the main message clearly.`,
    `Focus on clarity and enthusiasm. Relate the content to real-world examples.`,
    `Use storytelling to illustrate your point and keep the audience interested.`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function EditableDeck({ slides: initialSlides }) {
  const withIds = initialSlides.map((s, i) => ({ id: s.id || `${Date.now()}-${i}`, ...s }));
  const [slides, setSlides] = useState(withIds.map(({ image, ...rest }) => rest));
  const [selectedSlideId, setSelectedSlideId] = useState(withIds[0]?.id || null);
  // Per-slide feedback and chat state
  const [feedback, setFeedback] = useState({}); // { [slideId]: string }
  const [chatInput, setChatInput] = useState({}); // { [slideId]: string }
  const [chatHistory, setChatHistory] = useState({}); // { [slideId]: [{ user, text }] }
  const [regenLoading, setRegenLoading] = useState({}); // { [slideId]: boolean }
  const [chatLoading, setChatLoading] = useState({}); // { [slideId]: boolean }

  const handleSidebarDragEnd = (result) => {
    if (!result.destination) return;
    const newSlides = reorder(slides, result.source.index, result.destination.index);
    setSlides(newSlides);
    if (selectedSlideId) {
      const stillExists = newSlides.find(s => s.id === selectedSlideId);
      if (!stillExists) setSelectedSlideId(newSlides[0]?.id || null);
    }
  };

  const handleFieldChange = (slideId, field, value) => {
    setSlides(prev =>
      prev.map(slide =>
        slide.id === slideId ? { ...slide, [field]: value } : slide
      )
    );
  };

  const handleAddSlide = () => {
    setSlides(prev => {
      const newSlide = getDefaultSlide(prev.length);
      return [...prev, newSlide];
    });
    setTimeout(() => {
      setSelectedSlideId(slides[slides.length]?.id || '');
    }, 0);
  };

  // Regenerate individual slide
  const handleRegenerate = async (slideId) => {
    setRegenLoading(l => ({ ...l, [slideId]: true }));
    setTimeout(() => {
      setSlides(prev =>
        prev.map(slide =>
          slide.id === slideId
            ? regenerateMockSlide(slideId, feedback[slideId], slide)
            : slide
        )
      );
      setRegenLoading(l => ({ ...l, [slideId]: false }));
      setFeedback(f => ({ ...f, [slideId]: '' }));
    }, 1200);
  };

  // Chatbot for speaker notes
  const handleChatSubmit = (slideId) => {
    const userMsg = chatInput[slideId]?.trim();
    if (!userMsg) return;
    setChatLoading(l => ({ ...l, [slideId]: true }));
    setChatHistory(h => ({
      ...h,
      [slideId]: [...(h[slideId] || []), { user: 'user', text: userMsg }],
    }));
    setChatInput(i => ({ ...i, [slideId]: '' }));
    setTimeout(() => {
      setChatHistory(h => ({
        ...h,
        [slideId]: [
          ...(h[slideId] || []),
          { user: 'ai', text: generateMockSpeakerNotes(slides.find(s => s.id === slideId)?.content || '', userMsg) },
        ],
      }));
      setChatLoading(l => ({ ...l, [slideId]: false }));
    }, 1200);
  };

  const selectedSlide = slides.find(s => s.id === selectedSlideId) || slides[0];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        height: { xs: 'auto', md: '70vh' },
        minHeight: 400,
        width: '100%',
        maxWidth: 1100,
        mx: 'auto',
        boxShadow: 2,
        borderRadius: 3,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: '100%', md: SIDEBAR_WIDTH },
          minWidth: { md: SIDEBAR_WIDTH },
          borderRight: { md: '1px solid #e0e0e0' },
          borderBottom: { xs: '1px solid #e0e0e0', md: 'none' },
          background: '#F7F9FC',
          p: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          alignItems: { xs: 'center', md: 'stretch' },
          gap: 1,
        }}
      >
        <DragDropContext onDragEnd={handleSidebarDragEnd}>
          <Droppable droppableId="sidebar" direction={window.innerWidth < 900 ? 'horizontal' : 'vertical'}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  gap: 1,
                  overflowY: 'auto',
                  width: '100%',
                }}
              >
                {slides.map((slide, idx) => (
                  <Draggable key={slide.id} draggableId={slide.id} index={idx}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => setSelectedSlideId(slide.id)}
                        sx={{
                          mb: { md: 1 },
                          minWidth: 120,
                          maxWidth: { xs: 120, md: 'none' },
                          minHeight: 60,
                          boxShadow: snapshot.isDragging
                            ? '0px 8px 24px rgba(12,33,193,0.18)'
                            : '0px 2px 8px rgba(0,0,0,0.06)',
                          border: slide.id === selectedSlideId ? '2px solid #0C21C1' : '2px solid transparent',
                          background: slide.id === selectedSlideId ? '#E8EDFA' : '#fff',
                          cursor: 'pointer',
                          transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                          p: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {slide.slideNumber}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: slide.id === selectedSlideId ? '#0C21C1' : 'inherit',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 90,
                          }}
                        >
                          {slide.title}
                        </Typography>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <IconButton
          onClick={handleAddSlide}
          sx={{ mt: { md: 2, xs: 0 }, ml: { xs: 2, md: 0 }, color: '#0C21C1', alignSelf: { xs: 'center', md: 'flex-start' } }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      {/* Main Canvas */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
        }}
      >
        <Fade in key={selectedSlide?.id} timeout={400}>
          <Paper elevation={4} sx={{ width: '100%', maxWidth: 600, p: 3, borderRadius: 4 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Slide {selectedSlide?.slideNumber}
            </Typography>
            <TextField
              label="Title"
              value={selectedSlide?.title || ''}
              onChange={e => handleFieldChange(selectedSlide.id, 'title', e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2, borderRadius: 2 }}
              InputProps={{ sx: { borderRadius: '20px', userSelect: 'text' } }}
            />
            <TextField
              label="Content"
              value={selectedSlide?.content || ''}
              onChange={e => handleFieldChange(selectedSlide.id, 'content', e.target.value)}
              fullWidth
              multiline
              minRows={5}
              variant="outlined"
              sx={{ mb: 2, borderRadius: 2 }}
              InputProps={{ sx: { borderRadius: '20px', userSelect: 'text' } }}
            />
            {/* Regenerate Slide UI */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                placeholder="Feedback for regeneration..."
                value={feedback[selectedSlide.id] || ''}
                onChange={e => setFeedback(f => ({ ...f, [selectedSlide.id]: e.target.value }))}
                sx={{ minWidth: 0, flex: 1, borderRadius: 2 }}
                InputProps={{ sx: { borderRadius: '14px', fontSize: 13, py: 0.5, userSelect: 'text' } }}
              />
              <Tooltip title="Regenerate slide">
                <span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleRegenerate(selectedSlide.id)}
                    disabled={regenLoading[selectedSlide.id]}
                  >
                    <AutorenewIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            {/* AI Speaker Note Chatbot */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                AI Speaker Notes Assistant
              </Typography>
              <List sx={{ mb: 1, maxHeight: 120, overflowY: 'auto', background: '#F7F9FC', borderRadius: 2 }}>
                {(chatHistory[selectedSlide.id] || []).map((msg, idx) => (
                  <ListItem key={idx} alignItems="flex-start" sx={{ p: 1 }}>
                    <ListItemText
                      primary={msg.text}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: msg.user === 'ai' ? 500 : 400,
                        color: msg.user === 'ai' ? '#0C21C1' : 'text.primary',
                        fontStyle: msg.user === 'ai' ? 'italic' : 'normal',
                      }}
                      sx={{
                        background: msg.user === 'ai' ? '#E8EDFA' : 'transparent',
                        borderRadius: 2,
                        px: 1.5,
                        py: 0.5,
                        mb: 0.5,
                        maxWidth: '90%',
                        alignSelf: msg.user === 'ai' ? 'flex-end' : 'flex-start',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Ask the AI assistant..."
                  value={chatInput[selectedSlide.id] || ''}
                  onChange={e => setChatInput(i => ({ ...i, [selectedSlide.id]: e.target.value }))}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleChatSubmit(selectedSlide.id);
                    }
                  }}
                  sx={{ flex: 1, borderRadius: 2 }}
                  InputProps={{
                    sx: { borderRadius: '14px', fontSize: 13, py: 0.5, userSelect: 'text' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleChatSubmit(selectedSlide.id)}
                          disabled={chatLoading[selectedSlide.id]}
                        >
                          <SendIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
} 