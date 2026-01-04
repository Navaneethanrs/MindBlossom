# Mind Blossom - MongoDB Integration Setup

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on your system:
- **Windows**: Open MongoDB Compass or run `mongod` in terminal
- **Mac/Linux**: Run `sudo mongod` or start MongoDB service

### 3. Start the Server
```bash
npm start
```
or for development:
```bash
npm run dev
```

### 4. Access the Application
- **Homepage**: http://localhost:3000/home.html
- **Counselor Page**: http://localhost:3000/counseller.html
- **Community**: http://localhost:3000/comm.html
- **API Health Check**: http://localhost:3000/api/health

## 📊 What Gets Saved to MongoDB?

### 1. User Feelings (from Homepage)
When users share their feelings on the homepage, the following data is saved:
- **userId**: Anonymous Blossom username (e.g., "Blossom 1")
- **avatar**: User avatar (e.g., "B1")
- **text**: The feeling/message they shared
- **mood**: Selected emotion (happy, sad, stressed, angry, lonely, anxious)
- **sessionId**: Unique session identifier
- **deviceInfo**: Browser and device information
- **source**: Where it came from (express_page)
- **timestamp**: When it was shared

### 2. Chat Messages (from Counselor Page)
When users chat with counselors:
- **sessionId**: Session identifier
- **type**: "user" or "bot" (counselor)
- **content**: The message content
- **mood**: Counselor specialty or general
- **timestamp**: When the message was sent

## 🔗 API Endpoints

### Feelings API
- `POST /api/feelings` - Save a new feeling
- `GET /api/feelings` - Get all feelings (for community page)
- `GET /api/feelings/mood/:mood` - Get feelings by specific mood
- `GET /api/feelings/stats` - Get mood statistics

### Chat API
- `POST /api/chat-message` - Save a chat message
- `GET /api/chat-messages/:sessionId` - Get chat history for a session

### System API
- `GET /api/health` - Check server and MongoDB status
- `GET /api/test` - Test API connection

## 🗄️ MongoDB Collections

### feelings Collection
```json
{
  "userId": "Blossom 1",
  "avatar": "B1",
  "text": "I'm feeling stressed today...",
  "mood": "stressed",
  "sessionId": "session_1234567890_abc123",
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "platform": "Win32",
    "language": "en-US"
  },
  "source": "express_page",
  "timestamp": "2026-01-03T09:30:00.000Z",
  "createdAt": "2026-01-03T09:30:00.000Z"
}
```

### chatmessages Collection
```json
{
  "sessionId": "session_1234567890_abc123",
  "type": "user",
  "content": "I need help with anxiety",
  "mood": "Clinical Psychologist",
  "timestamp": "2026-01-03T09:35:00.000Z"
}
```

## 🔍 Viewing Data in MongoDB

1. **Open MongoDB Compass**
2. **Connect to**: `mongodb://localhost:27017`
3. **Select Database**: `mindblossom`
4. **View Collections**:
   - `feelings` - All user emotions and posts
   - `chatmessages` - All counseling chat messages

## 🛡️ Privacy & Anonymity

- **All data is anonymous** - No personal information collected
- **Random usernames** - "Blossom 1", "Blossom 2", etc.
- **Session-based tracking** - Each user gets a unique session ID
- **No IP addresses or personal data stored**

## 📱 Features

### ✅ What Works Now
- Homepage feelings saved to MongoDB
- Counselor chat messages saved to MongoDB
- Fallback to localStorage if MongoDB fails
- Real-time data persistence
- Anonymous user tracking
- Mood-based analytics

### 🔧 Troubleshooting

**MongoDB Connection Error**:
- Make sure MongoDB is running
- Check if MongoDB is on port 27017
- Verify MongoDB Compass can connect

**Server Won't Start**:
- Check if port 3000 is available
- Run `netstat -ano | findstr :3000` (Windows)
- Kill any process using port 3000

**Data Not Saving**:
- Check browser console for errors
- Verify MongoDB is connected
- Check API response in Network tab

## 🎯 Next Steps

1. **Add user authentication** (optional)
2. **Implement data analytics dashboard**
3. **Add email notifications for counselors**
4. **Create data export functionality**
5. **Add data retention policies**

---

**🌸 Mind Blossom - Your emotional data is safe and anonymous!**
