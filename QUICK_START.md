# Quick Start Guide - AI Mental Health Chatbot

## For Your College Project Demo

### Step 1: Setup Supabase Database (5 minutes)

1. Go to https://supabase.com and sign up (free)
2. Create a new project
3. Go to **SQL Editor** (left sidebar)
4. Copy all content from `backend/setup_database.sql`
5. Paste and click **RUN**
6. You should see: "Success. No rows returned"

### Step 2: Get Your API Keys (2 minutes)

1. In Supabase, go to **Settings** > **API**
2. Copy these two values:
   - **Project URL** (looks like: https://xxx.supabase.co)
   - **anon public key** (long string starting with eyJ...)

### Step 3: Configure Your App (1 minute)

1. Open `.env` file in project root
2. Replace with your values:
```env
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

### Step 4: Run the App (2 minutes)

```bash
# Install dependencies (only first time)
npm install

# Start the app
npm run dev
```

Open http://localhost:5173 in your browser!

## That's It!

Your mental health chatbot is now running with:
- Real-time chat interface
- Mood detection (happy, sad, anxious, stressed, angry)
- Empathetic AI responses
- Coping strategies
- Crisis detection with emergency resources
- Chat history saved to database

## Test It Out

Try these messages to see different features:

1. **Normal mood**: "Hi, how are you?"
2. **Happy mood**: "I'm feeling great today!"
3. **Sad mood**: "I'm feeling really down and lonely"
4. **Anxious mood**: "I'm so anxious and nervous about everything"
5. **Crisis detection**: "I'm thinking about hurting myself" (will show emergency resources)

## For Your Presentation

### Key Features to Demonstrate

1. **Safety First**: Show the disclaimer modal on startup
2. **Mood Detection**: Send different mood messages and show color-coded responses
3. **Coping Strategies**: Point out the practical tips in bot responses
4. **Crisis Detection**: Demonstrate the emergency banner (use carefully in presentation)
5. **Database**: Show Supabase dashboard with stored messages
6. **Analytics**: Show mood_analytics table in database

### Architecture Overview (for questions)

**Frontend**: React + TypeScript + Tailwind CSS
**Backend**: Direct Supabase integration (optional Python Flask backend included)
**Database**: PostgreSQL via Supabase with Row Level Security
**AI/NLP**: Keyword matching + sentiment analysis (TextBlob in Python version)

### Project Highlights

1. **Production-Ready**: Clean code, TypeScript, proper error handling
2. **Secure**: Row Level Security, no PII storage, anonymous sessions
3. **Ethical**: Clear disclaimers, emergency resources, not replacing therapy
4. **Scalable**: Cloud database, deployable to any platform
5. **Full-Stack**: Both frontend-only and full-stack options

## Optional: Python Backend

If you want to use the advanced Python NLP backend:

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download NLP data
python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"

# Run backend
python app.py
```

Backend runs at http://localhost:5000 with endpoints:
- POST `/api/session/create` - Create session
- POST `/api/chat` - Send message
- GET `/api/history/<session_id>` - Get chat history
- GET `/api/mood-analytics/<session_id>` - Get mood stats

## Troubleshooting

**Problem**: Can't connect to database
- Check `.env` file has correct credentials
- Verify you ran the SQL setup in Supabase
- Make sure Supabase project is active (check dashboard)

**Problem**: Page is blank
- Open browser console (F12) and check for errors
- Verify `npm run dev` is running without errors
- Try clearing browser cache

**Problem**: "Module not found" errors
- Delete `node_modules` folder
- Run `npm install` again

## Deployment (Optional)

### Deploy to Vercel (Recommended for Frontend)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables in Vercel settings
5. Deploy (takes ~2 minutes)

### Deploy Backend to Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set root directory to `backend`
5. Add environment variables
6. Deploy

## Database Tables

Your Supabase project has these tables:

### chat_sessions
Stores each user's chat session (anonymous)

### chat_messages
All messages (user and bot) with mood detection

### mood_analytics
Aggregated mood statistics per session

View them in Supabase: **Table Editor** (left sidebar)

## Project Submission Checklist

- [ ] Code is well-organized and commented
- [ ] Database is set up and working
- [ ] All features demonstrated and tested
- [ ] Documentation is complete (this file + PROJECT_STRUCTURE.md)
- [ ] Safety disclaimers are prominent
- [ ] Emergency resources are accurate and visible
- [ ] Screenshots/video of working application
- [ ] Presentation slides prepared

## Support

For detailed documentation:
- Architecture: See `PROJECT_STRUCTURE.md`
- Setup: See `SETUP_INSTRUCTIONS.md`
- Code: Check inline comments in source files

## Academic Integrity Note

This is a template/starting point for your project. Make sure to:
1. Understand how all the code works
2. Customize it for your specific requirements
3. Add your own features or improvements
4. Properly cite any external resources used
5. Follow your institution's academic integrity policies

Good luck with your project! 🎓