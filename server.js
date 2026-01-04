const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static HTML files from current directory
app.use(express.static(__dirname));

// MongoDB Connection - Update with your MongoDB Compass connection string
const MONGODB_URI = 'mongodb://localhost:27017/mindblossom';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Feeling Schema
const feelingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    avatar: { type: String, required: true },
    text: { type: String, required: true },
    mood: { 
        type: String, 
        required: true,
        enum: ['happy', 'sad', 'stressed', 'angry', 'lonely', 'anxious']
    },
    timestamp: { type: Date, default: Date.now },
    isAnonymous: { type: Boolean, default: true },
    sessionId: { type: String, required: true },
    deviceInfo: { type: Object },
    source: { type: String, default: 'express_page' },
    createdAt: { type: Date, default: Date.now }
});

const Feeling = mongoose.model('Feeling', feelingSchema);

// API Routes

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Mind Blossom API is working!' });
});

// Save a feeling
app.post('/api/feelings', async (req, res) => {
    try {
        console.log('Received feeling:', req.body);
        const feeling = new Feeling(req.body);
        await feeling.save();
        
        res.status(201).json({
            success: true,
            message: 'Feeling saved successfully to MongoDB',
            data: feeling
        });
    } catch (error) {
        console.error('Error saving feeling:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save feeling',
            error: error.message
        });
    }
});

// Save chat message
app.post('/api/chat-message', async (req, res) => {
    try {
        const { sessionId, type, content, mood } = req.body;
        
        // Create a simple chat message schema on the fly
        const ChatMessage = mongoose.model('ChatMessage', new mongoose.Schema({
            sessionId: { type: String, required: true },
            type: { type: String, enum: ['user', 'bot'], required: true },
            content: { type: String, required: true },
            mood: { type: String },
            timestamp: { type: Date, default: Date.now }
        }));
        
        const message = new ChatMessage({
            sessionId,
            type,
            content,
            mood
        });
        
        await message.save();
        
        res.status(201).json({
            success: true,
            message: 'Chat message saved successfully',
            data: message
        });
    } catch (error) {
        console.error('Error saving chat message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save chat message',
            error: error.message
        });
    }
});

// Get chat messages for a session
app.get('/api/chat-messages/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const ChatMessage = mongoose.model('ChatMessage');
        const messages = await ChatMessage.find({ sessionId })
            .sort({ timestamp: 1 });
        
        res.json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chat messages',
            error: error.message
        });
    }
});

// Save reaction
app.post('/api/reaction', async (req, res) => {
    try {
        const { postId, reaction, userId } = req.body;
        
        // Create a simple reaction schema on the fly
        const Reaction = mongoose.model('Reaction', new mongoose.Schema({
            postId: { type: String, required: true },
            reaction: { type: String, required: true },
            userId: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }));
        
        const newReaction = new Reaction({
            postId,
            reaction,
            userId
        });
        
        await newReaction.save();
        
        res.status(201).json({
            success: true,
            message: 'Reaction saved successfully',
            data: newReaction
        });
    } catch (error) {
        console.error('Error saving reaction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save reaction',
            error: error.message
        });
    }
});

// Save comment
app.post('/api/comment', async (req, res) => {
    try {
        const { postId, comment } = req.body;
        
        // Create a simple comment schema on the fly
        const Comment = mongoose.model('Comment', new mongoose.Schema({
            postId: { type: String, required: true },
            comment: { type: Object, required: true },
            timestamp: { type: Date, default: Date.now }
        }));
        
        const newComment = new Comment({
            postId,
            comment
        });
        
        await newComment.save();
        
        res.status(201).json({
            success: true,
            message: 'Comment saved successfully',
            data: newComment
        });
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save comment',
            error: error.message
        });
    }
});

// Get reactions for a post
app.get('/api/reactions/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        
        const Reaction = mongoose.model('Reaction');
        const reactions = await Reaction.find({ postId })
            .sort({ timestamp: -1 });
        
        res.json({
            success: true,
            data: reactions
        });
    } catch (error) {
        console.error('Error fetching reactions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reactions',
            error: error.message
        });
    }
});

// Get comments for a post
app.get('/api/comments/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        
        const Comment = mongoose.model('Comment');
        const comments = await Comment.find({ postId })
            .sort({ timestamp: 1 });
        
        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comments',
            error: error.message
        });
    }
});

// Get all feelings (for community page)
app.get('/api/feelings', async (req, res) => {
    try {
        const feelings = await Feeling.find()
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.json({
            success: true,
            count: feelings.length,
            data: feelings
        });
    } catch (error) {
        console.error('Error fetching feelings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feelings',
            error: error.message
        });
    }
});

// Get feelings by mood
app.get('/api/feelings/mood/:mood', async (req, res) => {
    try {
        const feelings = await Feeling.find({ mood: req.params.mood })
            .sort({ createdAt: -1 })
            .limit(20);
        
        res.json({
            success: true,
            count: feelings.length,
            data: feelings
        });
    } catch (error) {
        console.error('Error fetching feelings by mood:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feelings',
            error: error.message
        });
    }
});

// Get feelings statistics
app.get('/api/feelings/stats', async (req, res) => {
    try {
        const stats = await Feeling.aggregate([
            {
                $group: {
                    _id: '$mood',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        const total = await Feeling.countDocuments();
        
        res.json({
            success: true,
            total,
            stats
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Mind Blossom API is running',
        timestamp: new Date().toISOString(),
        mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Serve HTML files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, req.path));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🌐 Access your app at:`);
    console.log(`   - http://localhost:${PORT}/home.html`);
    console.log(`   - http://localhost:${PORT}/counseller.html`);
    console.log(`   - http://localhost:${PORT}/game.html`);
    console.log(`   - http://localhost:${PORT}/comm.html`);
    console.log(`🔗 MongoDB API at: http://localhost:${PORT}/api/feelings`);
});