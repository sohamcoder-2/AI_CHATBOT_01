# Setup Instructions - AI Mental Health Chatbot

## Prerequisites
- Node.js 18+ and npm installed
- Python 3.8+ installed (optional, for backend)
- Supabase account (free tier works)
- Code editor (VS Code recommended)

## Quick Start (Frontend Only)

### Step 1: Setup Database

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to SQL Editor in your Supabase dashboard
4. Copy and paste the contents of `backend/setup_database.sql`
5. Click "Run" to create all tables and policies

### Step 2: Configure Environment Variables

1. Copy your Supabase credentials from Settings > API
2. Update the `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Run the Application

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Full Stack Setup (Frontend + Backend)

If you want to use the Python backend for more advanced NLP features:

### Step 1: Setup Database (same as above)

Follow Step 1 from Quick Start

### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"

# Configure environment variables
# Edit backend/.env with your Supabase credentials
```

### Step 3: Run Backend Server

```bash
# Make sure you're in the backend directory and virtual environment is activated
python app.py
```

Backend will run at `http://localhost:5000`

### Step 4: Update Frontend (Optional)

If using the backend, update `src/services/chatService.ts` to use backend endpoints:

```typescript
const BACKEND_URL = 'http://localhost:5000';

// Use fetch to call backend endpoints instead of direct Supabase calls
```

### Step 5: Run Frontend

```bash
# In a new terminal, from project root
npm run dev
```

## Database Setup Details

### Manual Database Setup

If you prefer to create tables manually:

1. **Create chat_sessions table:**
```sql
CREATE TABLE chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_active_at timestamptz DEFAULT now(),
  user_ip text DEFAULT ''
);
```

2. **Create chat_messages table:**
```sql
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_type text NOT NULL CHECK (message_type IN ('user', 'bot')),
  message_text text NOT NULL,
  detected_mood text DEFAULT 'neutral',
  confidence_score numeric DEFAULT 0.0,
  created_at timestamptz DEFAULT now()
);
```

3. **Create mood_analytics table:**
```sql
CREATE TABLE mood_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  mood text NOT NULL,
  count integer DEFAULT 1,
  updated_at timestamptz DEFAULT now()
);
```

4. **Enable RLS and create policies** (see `backend/setup_database.sql`)

## Deployment

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

### Deploy Backend to Heroku

1. Create `Procfile` in backend directory:
```
web: gunicorn app:app
```

2. Create `runtime.txt`:
```
python-3.11.0
```

3. Deploy to Heroku:
```bash
heroku create your-app-name
git subtree push --prefix backend heroku main
```

4. Set environment variables in Heroku dashboard

### Deploy Backend to Render

1. Create new Web Service on [Render](https://render.com)
2. Connect GitHub repository
3. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
4. Add environment variables

## Troubleshooting

### Database Connection Issues

**Problem**: "Error creating session" or database errors

**Solution**:
- Verify Supabase credentials in `.env`
- Check that tables are created (run setup SQL)
- Ensure RLS policies are enabled
- Check Supabase project is active

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solution**:
- Ensure Flask-CORS is installed
- Check backend is running on correct port
- Verify CORS configuration in `app.py`

### NLP/NLTK Errors

**Problem**: TextBlob or NLTK errors

**Solution**:
```bash
# Reinstall and download data
pip install textblob nltk
python -m textblob.download_corpora
python -c "import nltk; nltk.download('punkt'); nltk.download('brown')"
```

### Port Already in Use

**Problem**: "Address already in use" error

**Solution**:
```bash
# Find and kill process using port 5000
# On Mac/Linux:
lsof -ti:5000 | xargs kill -9
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Build Errors

**Problem**: `npm run build` fails

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Testing the Application

### Test Scenarios

1. **Normal Conversation**:
   - Type: "I'm feeling okay today"
   - Expected: Neutral mood detection, supportive response

2. **Happy Mood**:
   - Type: "I'm so happy and excited!"
   - Expected: Happy mood detection, positive reinforcement

3. **Anxious Mood**:
   - Type: "I'm feeling very anxious and worried"
   - Expected: Anxious mood detection, coping strategies provided

4. **Crisis Detection**:
   - Type: "I'm thinking about suicide"
   - Expected: Crisis banner appears, emergency resources shown

5. **Chat History**:
   - Send multiple messages
   - Refresh page (session should persist with same session ID)
   - Verify messages are saved

### Testing Database

```sql
-- Check sessions
SELECT * FROM chat_sessions;

-- Check messages
SELECT * FROM chat_messages ORDER BY created_at DESC LIMIT 10;

-- Check mood analytics
SELECT * FROM mood_analytics;
```

## Development Tips

### Hot Reload
- Frontend: Auto-reloads on save
- Backend: Restart Flask server after changes (or use Flask debug mode)

### Debug Mode
- Enable React DevTools in browser
- Use `console.log()` for frontend debugging
- Use `print()` statements for backend debugging
- Check browser Network tab for API calls

### Code Quality
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build test
npm run build
```

## Getting Help

### Common Resources
- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Flask Documentation](https://flask.palletsprojects.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Support
- Check `PROJECT_STRUCTURE.md` for architecture details
- Review code comments for implementation details
- Test with sample scenarios above

## Important Reminders

1. **This is for educational purposes only**
2. **Not a replacement for professional mental health care**
3. **Always include disclaimers and emergency resources**
4. **Test crisis detection thoroughly**
5. **Respect user privacy - no PII storage**
6. **Keep emergency numbers up to date**

## Next Steps

After setup is complete:
1. Test all features thoroughly
2. Customize responses for your use case
3. Add additional mood categories if needed
4. Implement analytics dashboard (optional)
5. Consider adding more coping strategies
6. Deploy to production (if approved)

Good luck with your college project!