const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function regenerateSlideApi(slide, feedback) {
  const res = await fetch(`${API_BASE_URL}/regenerate-slide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slide, feedback }),
  });
  if (!res.ok) throw new Error('Failed to regenerate slide');
  const data = await res.json();
  return data.slide;
}

export async function generateSpeakerNotesApi(title, content) {
  const res = await fetch(`${API_BASE_URL}/speaker-notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error('Failed to generate speaker notes');
  const data = await res.json();
  return data.notes;
} 