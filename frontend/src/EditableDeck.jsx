// EditableDeck.jsx
//
// Interactive pitch deck editor for SlideGenius. Allows users to view, edit, reorder, regenerate, and chat about slides. Supports PDF and PowerPoint export.

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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import jsPDF from 'jspdf';
import PPTXGenJS from 'pptxgenjs';
import { regenerateSlideApi, generateSpeakerNotesApi } from './slideApi';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SIDEBAR_WIDTH = 180;

/**
 * Reorders slides after drag-and-drop.
 * @param {Array} list - The current slides array.
 * @param {number} startIndex - Drag start index.
 * @param {number} endIndex - Drop index.
 * @returns {Array} New reordered slides array.
 */
function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result.map((slide, idx) => ({ ...slide, slideNumber: idx + 1 }));
}

/**
 * Returns a default new slide object.
 * @param {number} idx - Index for slide number.
 */
function getDefaultSlide(idx) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    slideNumber: idx + 1,
    title: `New Slide ${idx + 1}`,
    content: '',
  };
}

/**
 * Exports the current deck as a PDF file using jsPDF.
 * @param {Array} slides - Array of slide objects.
 */
export function handleDownloadPDF(slides) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  slides.forEach((slide, idx) => {
    if (idx !== 0) doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(slide.title || `Slide ${slide.slideNumber}`, 40, 80);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    // Split content into bullet points if possible
    const bullets = (slide.content || '').split(/\n|•|\-/).map(s => s.trim()).filter(Boolean);
    let y = 120;
    bullets.forEach(bullet => {
      doc.text(`• ${bullet}`, 60, y, { maxWidth: 480 });
      y += 28;
    });
  });
  doc.save('SlideGenius_PitchDeck.pdf');
}

/**
 * Exports the current deck as a PowerPoint file using pptxgenjs.
 * @param {Array} slides - Array of slide objects.
 */
export async function handleDownloadPPTX(slides) {
  const module = await import('pptxgenjs');
  const PPTXGenJS = module.default;
  const pptx = new PPTXGenJS();
  slides.forEach(slide => {
    const slideObj = pptx.addSlide();
    slideObj.addText(slide.title || '', {
      x: 0.5, y: 0.5, w: 9, h: 1,
      fontSize: 28, bold: true, color: '003399', align: 'center', fontFace: 'Arial'
    });
    // Split content into bullet points, join with line breaks, and use bullet: true
    const bullets = (slide.content || '').split(/\n|•|-/).map(s => s.trim()).filter(Boolean);
    slideObj.addText(bullets.join('\n'), {
      x: 0.7, y: 1.5, w: 8.5, h: 4.5,
      fontSize: 18, color: '222222', fontFace: 'Arial', align: 'left', bullet: true
    });
  });
  pptx.writeFile({ fileName: 'SlideGenius_PitchDeck.pptx' });
}

/**
 * EditableDeck React component
 * @param {Object} props
 * @param {Array} props.slides - Initial slides array
 * @returns {JSX.Element}
 */
export default function EditableDeck({ slides: initialSlides }) {
  // Add unique IDs to slides if missing
  const withIds = initialSlides.map((s, i) => ({ id: s.id || `${Date.now()}-${i}`, ...s }));
  // State for slides, selected slide, feedback, chat, and loading
  const [slides, setSlides] = useState(withIds.map(({ image, ...rest }) => rest));
  const [selectedSlideId, setSelectedSlideId] = useState(withIds[0]?.id || null);
  const [feedback, setFeedback] = useState({}); // Per-slide feedback
  const [chatInput, setChatInput] = useState({}); // Per-slide chat input
  const [chatHistory, setChatHistory] = useState({}); // Per-slide chat history
  const [regenLoading, setRegenLoading] = useState({}); // Per-slide regen loading
  const [chatLoading, setChatLoading] = useState({}); // Per-slide chat loading
  const navigate = useNavigate();

  /**
   * Handles drag-and-drop reordering of slides in the sidebar.
   */
  const handleSidebarDragEnd = (result) => {
    if (!result.destination) return;
    const newSlides = reorder(slides, result.source.index, result.destination.index);
    setSlides(newSlides);
    if (selectedSlideId) {
      const stillExists = newSlides.find(s => s.id === selectedSlideId);
      if (!stillExists) setSelectedSlideId(newSlides[0]?.id || null);
    }
  };

  /**
   * Handles changes to slide title/content fields.
   */
  const handleFieldChange = (slideId, field, value) => {
    setSlides(prev =>
      prev.map(slide =>
        slide.id === slideId ? { ...slide, [field]: value } : slide
      )
    );
  };

  /**
   * Adds a new blank slide to the deck.
   */
  const handleAddSlide = () => {
    setSlides(prev => {
      const newSlide = getDefaultSlide(prev.length);
      return [...prev, newSlide];
    });
    setTimeout(() => {
      setSelectedSlideId(slides[slides.length]?.id || '');
    }, 0);
  };

  /**
   * Regenerates an individual slide using the API and user feedback.
   */
  const handleRegenerate = async (slideId) => {
    setRegenLoading(l => ({ ...l, [slideId]: true }));
    const slide = slides.find(s => s.id === slideId);
    try {
      const regenerated = await regenerateSlideApi(slide, feedback[slideId]);
      setSlides(prev => prev.map(s => (s.id === slideId ? { ...regenerated, id: slideId } : s)));
    } catch (e) {
      // Optionally handle error
    }
    setRegenLoading(l => ({ ...l, [slideId]: false }));
    setFeedback(f => ({ ...f, [slideId]: '' }));
  };

  /**
   * Handles chat input for AI speaker notes assistant.
   */
  const handleChatSubmit = async (slideId) => {
    const userMsg = chatInput[slideId]?.trim();
    if (!userMsg) return;
    setChatLoading(l => ({ ...l, [slideId]: true }));
    setChatHistory(h => ({
      ...h,
      [slideId]: [...(h[slideId] || []), { user: 'user', text: userMsg }],
    }));
    setChatInput(i => ({ ...i, [slideId]: '' }));
    try {
      const slide = slides.find(s => s.id === slideId);
      const aiReply = await generateSpeakerNotesApi(slide.title, slide.content);
      setChatHistory(h => ({
        ...h,
        [slideId]: [
          ...(h[slideId] || []),
          { user: 'ai', text: aiReply },
        ],
      }));
    } catch (e) {
      // Optionally handle error
    }
    setChatLoading(l => ({ ...l, [slideId]: false }));
  };

  /**
   * Logs out the user and redirects to login page.
   */
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Find the currently selected slide
  const selectedSlide = slides.find(s => s.id === selectedSlideId) || slides[0];

  // Main render: sidebar (draggable slides), main canvas (editable slide, regen, chat)
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
        position: 'relative',
      }}
    >
      {/* Sidebar: draggable slide list */}
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
        {/* Add new slide button */}
        <IconButton
          onClick={handleAddSlide}
          sx={{ mt: { md: 2, xs: 0 }, ml: { xs: 2, md: 0 }, color: '#0C21C1', alignSelf: { xs: 'center', md: 'flex-start' } }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      {/* Main Canvas: editable slide, regen, chat */}
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
            {/* Editable title */}
            <TextField
              label="Title"
              value={selectedSlide?.title || ''}
              onChange={e => handleFieldChange(selectedSlide.id, 'title', e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2, borderRadius: 2 }}
              InputProps={{ sx: { borderRadius: '20px', userSelect: 'text' } }}
            />
            {/* Editable content */}
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