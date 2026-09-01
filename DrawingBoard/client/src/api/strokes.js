import { API_BASE_URL } from '../config';

export async function saveStrokes(strokes) {
  try {
    const response = await fetch(`${API_BASE_URL}/strokes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strokes)
    });
    return await response.json();
  } catch (err) {
    console.error('Save failed:', err);
  }
}

export async function loadStrokes() {
  try {
    const response = await fetch(`${API_BASE_URL}/strokes`);
    return await response.json();
  } catch (err) {
    console.error('Load failed:', err);
    return [];
  }
}
