# AI Mental Health Chatbot - Project Structure

## Overview
This is a full-stack AI Mental Health Chatbot built for a college project. It provides empathetic support, detects user moods, suggests coping strategies, and includes crisis detection with emergency resources.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Database Client**: Supabase JS

### Backend (Optional - Python Flask)
- **Framework**: Flask
- **CORS**: Flask-CORS
- **Database**: Supabase (PostgreSQL)
- **NLP**: TextBlob, NLTK
- **Deployment**: Gunicorn-ready

### Database
- **Platform**: Supabase (PostgreSQL)
- **Features**: Row Level Security (RLS), Real-time subscriptions

## Project Structure

```
project/
├── backend/                    # Python Flask backend (optional)
│   ├── app.py                 # Main Flask application
│   ├── database.py            # Supabase database operations
│   ├── nlp_engine.py          # AI/NLP mood detection & responses
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Backend environment variables
│   └── setup_database.sql     # Database schema SQL
│
├── src/                       # React frontend
│   ├── components/            # React components
│   │   ├── ChatMessage.tsx   # Individual message display
│   │   ├── ChatInput.tsx     # Message input component
│   │   ├── DisclaimerModal.tsx # Safety disclaimer
│   │   └── EmergencyBanner.tsx # Crisis alert banner
│   │
│   ├── services/             # Business logic
│   │   └── chatService.ts    # Chat API & NLP logic
│   │
│   ├── types/                # TypeScript types
│   │   └── chat.ts           # Chat-related interfaces
│   │
│   ├── lib/                  # Libraries & utilities
│   │   └── supabase.ts       # Supabase client setup
│   │
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # React entry point
│   └── index.css             # Global styles
│
├── .env                       # Frontend environment variables
├── package.json              # Node.js dependencies
└── PROJECT_STRUCTURE.md      # This file
```

## Database Schema

### Tables

#### 1. chat_sessions
Stores user chat sessions (anonymous)
- `id` (uuid): Primary key
- `session_id` (text): Unique session identifier
- `created_at` (timestamptz): Session creation time
- `last_active_at` (timestamptz): Last activity timestamp
- `user_ip` (text): IP address (anonymized)

#### 2. chat_messages
Stores all chat messages
- `id` (uuid): Primary key
- `session_id` (uuid): Foreign key to chat_sessions
- `message_type` (text): 'user' or 'bot'
- `message_text` (text): Message content
- `detected_mood` (text): Detected mood
- `confidence_score` (numeric): Mood detection confidence
- `created_at` (timestamptz): Message timestamp

#### 3. mood_analytics
Aggregates mood data per session
- `id` (uuid): Primary key
- `session_id` (uuid): Foreign key to chat_sessions
- `mood` (text): Detected mood
- `count` (integer): Occurrence count
- `updated_at` (timestamptz): Last update time

## Features

### Core Features
1. **Real-time Chat Interface**: Clean, modern UI with message history
2. **Mood Detection**: Analyzes user messages to detect emotional state
   - Happy, Sad, Anxious, Stressed, Angry, Neutral, Crisis
3. **Empathetic Responses**: Context-aware, supportive replies
4. **Coping Strategies**: Practical techniques for managing emotions
5. **Crisis Detection**: Identifies crisis keywords and provides emergency resources
6. **Anonymous Sessions**: No login required, privacy-focused
7. **Chat History**: Persistent conversation storage
8. **Mood Analytics**: Track emotional patterns over time

### Safety Features
1. **Disclaimer Modal**: Clear communication about limitations
2. **Emergency Banner**: Displays when crisis detected
3. **Emergency Resources**:
   - 988 Suicide & Crisis Lifeline
   - Crisis Text Line (741741)
   - International resources
4. **Footer Reminders**: Constant access to emergency numbers

## Key Components

### Frontend Components

#### App.tsx
Main application orchestrator
- Session management
- Message state handling
- Crisis detection handling
- UI rendering

#### ChatMessage.tsx
Individual message display
- User/bot differentiation
- Mood visualization with color coding
- Timestamp display

#### ChatInput.tsx
Message input interface
- Text input with validation
- Send button with loading states
- Keyboard shortcuts

#### DisclaimerModal.tsx
Safety disclaimer screen
- Legal disclaimer
- Emergency resources
- Accept button to proceed

#### EmergencyBanner.tsx
Crisis alert component
- Prominent crisis warning
- Direct access to emergency numbers
- Click-to-call functionality

### Backend Components (Optional)

#### app.py
Flask REST API with endpoints:
- `POST /api/session/create`: Create new chat session
- `POST /api/chat`: Send message and get response
- `GET /api/history/<session_id>`: Get chat history
- `GET /api/mood-analytics/<session_id>`: Get mood statistics

#### nlp_engine.py
NLP processing engine:
- Mood detection using keywords and sentiment analysis
- Crisis keyword detection
- Response generation with coping strategies
- Confidence scoring

#### database.py
Supabase database operations:
- Session CRUD operations
- Message storage and retrieval
- Mood analytics tracking
- Chat history management

## Mood Detection Algorithm

### Keyword-Based Detection
The system uses predefined keyword lists for each mood category:
- **Happy**: happy, joy, great, wonderful, excited, amazing
- **Sad**: sad, depressed, down, unhappy, miserable, lonely
- **Anxious**: anxious, nervous, worried, panic, fear, scared
- **Stressed**: stressed, pressure, exhausted, overwhelmed
- **Angry**: angry, furious, mad, frustrated, irritated
- **Crisis**: suicide, kill myself, hurt myself, end my life

### Sentiment Analysis Backup
TextBlob provides sentiment polarity as fallback:
- Polarity > 0.3 → Happy
- Polarity < -0.3 → Sad
- Otherwise → Neutral

## Coping Strategies

Each mood type has specific coping strategies:

### Anxious
- 5-4-3-2-1 grounding technique
- Box breathing exercise
- Journaling

### Stressed
- Take breaks
- Prioritize tasks
- Progressive muscle relaxation

### Sad
- Reach out to someone
- Self-care activities
- Gentle movement

### Angry
- Take a timeout
- Physical release
- Expressive writing

## Environment Variables

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (backend/.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
FLASK_ENV=development
PORT=5000
```

## Security Considerations

### Database Security
- Row Level Security (RLS) enabled on all tables
- Public access allowed for anonymous support (intentional design)
- No personal identifiable information stored
- IP addresses anonymized

### Application Security
- Input validation on all user messages
- XSS protection via React's default escaping
- CORS properly configured
- Environment variables for sensitive data

### Privacy
- No user authentication required
- Anonymous sessions only
- No email or personal data collected
- Chat history tied to session ID only

## Deployment Notes

### Frontend Deployment
- Build command: `npm run build`
- Output directory: `dist/`
- Compatible with: Vercel, Netlify, Cloudflare Pages

### Backend Deployment (Optional)
- WSGI server: Gunicorn
- Command: `gunicorn app:app`
- Compatible with: Heroku, Railway, Render
- Environment variables must be set

### Database
- Supabase project already configured
- Run `setup_database.sql` in Supabase SQL Editor
- RLS policies ensure proper access control

## Development Workflow

### Frontend Development
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend Development (Optional)
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs at http://localhost:5000
```

## Future Enhancements

### Potential Improvements
1. Multi-language support
2. Voice input/output
3. Integration with real therapist referral services
4. Advanced NLP with transformer models (BERT, GPT)
5. User accounts for long-term tracking (optional)
6. Export chat history feature
7. Mood visualization dashboards
8. Integration with wearables for physiological data
9. Peer support community features
10. Professional therapist chat integration

## Ethical Considerations

### Limitations
- AI cannot replace professional therapy
- No diagnostic capabilities
- Not suitable for emergencies
- Limited understanding of complex situations

### Best Practices
- Clear disclaimers throughout interface
- Prominent emergency resources
- Encouragement to seek professional help
- Transparent about AI nature
- Privacy-focused design

## Credits & Acknowledgments
- Built as a college project for educational purposes
- Uses open-source libraries and frameworks
- Emergency resources provided by national organizations
- Inspired by mental health support principles

## License
Educational use only. Not for commercial deployment without proper licensing and professional oversight.