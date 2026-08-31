# Phase 4: Room Creation

> **Status:** 🔄 In Progress  
> **Priority:** High  
> **Depends On:** [[Phase-3-Auth/Phase-3-Auth]]

## Objective

Allow users to create and join drawing rooms for private collaboration.

## Why This Matters

Without rooms, all users share one canvas. Rooms enable private collaboration between specific groups.

## Tech Stack Addition

- **Room model** - Store room data in MongoDB
- **Room API** - Create, join, leave rooms
- **Socket.io rooms** - Isolate drawings per room

## File Structure

```
server/
├── server.js           # Updated with room handling
├── models/
│   ├── User.js         # Existing
│   └── Room.js         # NEW - Room model
├── routes/
│   ├── auth.js         # Existing
│   └── rooms.js        # NEW - Room routes
└── package.json

client/src/
├── components/
│   ├── RoomList.jsx    # NEW - Show available rooms
│   ├── CreateRoom.jsx  # NEW - Create room form
│   ├── RoomLobby.jsx   # NEW - Room before drawing
│   └── Canvas.jsx      # Updated - Room-aware
├── api/
│   ├── auth.js         # Existing
│   └── rooms.js        # NEW - Room API calls
├── App.jsx             # Updated with room routes
└── main.jsx
```

## Deliverables

- [ ] Room model created
- [ ] Create room endpoint
- [ ] Join room endpoint
- [ ] Leave room endpoint
- [ ] Room list UI
- [ ] Create room UI
- [ ] Socket.io room isolation
- [ ] Room-based drawing

## Sub-Phases

| Sub-Phase | Name | Status |
|-----------|------|--------|
| 4.1 | Room Model | ⬜ Not Started |
| 4.2 | Room API | ⬜ Not Started |
| 4.3 | Room UI | ⬜ Not Started |
| 4.4 | Socket Rooms | ⬜ Not Started |
| 4.5 | Room Drawing | ⬜ Not Started |

## Next Phase

→ [[Phase-5-Canvas-Features]]
