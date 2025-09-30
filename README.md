# AI Mental Health Chatbot

A full-stack AI-powered mental health support chatbot built as a college project. Provides empathetic responses, detects user moods, suggests coping strategies, and includes crisis detection with emergency resources.

![License](https://img.shields.io/badge/license-Educational-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Python](https://img.shields.io/badge/Python-3.11-green)
![Flask](https://img.shields.io/badge/Flask-3.0-green)

## Features

- **Real-time Chat Interface**: Clean, modern UI with persistent message history
- **AI Mood Detection**: Analyzes messages to detect emotional states (happy, sad, anxious, stressed, angry, neutral, crisis)
- **Empathetic Responses**: Context-aware, supportive replies tailored to detected mood
- **Coping Strategies**: Practical techniques for managing emotions
- **Crisis Detection**: Identifies crisis keywords and provides immediate emergency resources
- **Anonymous Sessions**: No login required, privacy-focused design
- **Mood Analytics**: Track emotional patterns over time
- **Safety Features**: Clear disclaimers, emergency banners, constant access to crisis resources

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Supabase client for database

### Backend (Optional)
- Flask (Python)
- TextBlob & NLTK for NLP
- Supabase for database
- Gunicorn for deployment

### Database
- Supabase (PostgreSQL)
- Row Level Security enabled
- Anonymous access for accessibility

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier)
- Python 3.8+ (optional, for backend)

### Setup in 5 Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd project
```

2. **Setup Supabase Database**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Go to SQL Editor
   - Run the SQL from `backend/setup_database.sql`

3. **Configure Environment**
```bash
# Copy your Supabase credentials to .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. **Install Dependencies**
```bash
npm install
```

5. **Run the Application**
```bash
npm run dev
# Opens at http://localhost:5173
```

## Documentation

- **[QUICK_START.md](QUICK_START.md)** - Fast setup guide (start here!)
- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Detailed setup and deployment
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture documentation
- **[PROJECT_SUMMARY.txt](PROJECT_SUMMARY.txt)** - Complete project overview
- **[DIRECTORY_STRUCTURE.txt](DIRECTORY_STRUCTURE.txt)** - File organization guide

## Project Structure

```
project/
├── src/                      # React frontend
│   ├── components/          # UI components
│   ├── services/            # Business logic
│   ├── types/               # TypeScript types
│   └── lib/                 # Utilities
├── backend/                 # Python Flask backend (optional)
│   ├── app.py              # Main server
│   ├── nlp_engine.py       # AI/NLP logic
│   └── database.py         # Database operations
└── Documentation files
```

## Usage

### Testing Different Moods

Try these messages to see different features:

- **Normal**: "Hi, how are you?"
- **Happy**: "I'm feeling great today!"
- **Sad**: "I'm feeling really down and lonely"
- **Anxious**: "I'm so anxious and nervous about everything"
- **Stressed**: "I feel so overwhelmed with everything"
- **Crisis**: "I'm thinking about hurting myself" (shows emergency resources)

## Database Schema

### Tables
- `chat_sessions` - Anonymous user sessions
- `chat_messages` - All chat messages with mood detection
- `mood_analytics` - Aggregated mood statistics

See `backend/setup_database.sql` for complete schema.

## Deployment

### Frontend (Vercel - Recommended)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Heroku/Render)
```bash
cd backend
# Configure with Procfile and runtime.txt
```

## Safety & Ethics

This chatbot includes important safety features:

- **Disclaimer Modal**: Clear communication about limitations
- **Crisis Detection**: Automatic detection of concerning keywords
- **Emergency Resources**:
  - 988 Suicide & Crisis Lifeline
  - Crisis Text Line (741741)
  - Emergency services (911)
- **Privacy**: No personal information collected
- **Transparency**: Clear about AI nature and limitations

## Important Disclaimers

- This is for **educational purposes only**
- **NOT a replacement** for professional mental health care
- **NOT approved** for real mental health interventions
- Always seek professional help for serious concerns

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build

# Backend (optional)
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Future Enhancements

- Multi-language support
- Voice input/output
- Advanced NLP models (BERT, GPT)
- User accounts (optional)
- Mood visualization dashboards
- Integration with real therapist services

## Contributing

This is a college project template. Feel free to:
- Customize for your needs
- Add new features
- Improve the NLP logic
- Enhance the UI/UX

## License

Educational use only. Not for commercial deployment without proper licensing and professional oversight.

## Credits

- Built as a college project
- Uses open-source technologies
- Emergency resources from national organizations

## Support

For issues and questions:
1. Check documentation files
2. Review inline code comments
3. Test with sample scenarios
4. Check Supabase dashboard for database issues

## Acknowledgments

- React team for the framework
- Supabase for the backend infrastructure
- Mental health organizations for crisis resources
- Open source community for tools and libraries

---

**Remember**: If you're experiencing a mental health crisis, please contact:
- 988 Suicide & Crisis Lifeline
- Text HOME to 741741 (Crisis Text Line)
- Call 911 for immediate emergency assistance