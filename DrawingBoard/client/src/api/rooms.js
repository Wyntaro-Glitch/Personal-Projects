const API_URL = 'http://localhost:3000/api/rooms';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export async function createRoom(name) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name })
  });
  return await response.json();
}

export async function getRooms() {
  const response = await fetch(API_URL, {
    headers: getHeaders()
  });
  return await response.json();
}

export async function getRoom(roomId) {
  const response = await fetch(`${API_URL}/${roomId}`, {
    headers: getHeaders()
  });
  return await response.json();
}

export async function joinRoom(code) {
  const response = await fetch(`${API_URL}/join`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ code })
  });
  return await response.json();
}

export async function leaveRoom(roomId) {
  const response = await fetch(`${API_URL}/leave`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ roomId })
  });
  return await response.json();
}

export async function deleteRoom(roomId) {
  const response = await fetch(`${API_URL}/${roomId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return await response.json();
}
