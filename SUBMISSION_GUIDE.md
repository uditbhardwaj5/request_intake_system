# SUBMISSION GUIDE

This document provides instructions on how to set up, run, and submit this AI-powered Request Intake System.

## 📋 Pre-Submission Checklist

Before submitting, ensure you have completed:

- [ ] Configured OpenRouter API key in `server/.env`
- [ ] Tested the entire application on a fresh clone
- [ ] All API endpoints respond correctly
- [ ] Dashboard filtering works properly
- [ ] AI enrichment processes requests asynchronously
- [ ] Both client and server start without errors

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd assignment
```

### 2. Backend Setup (Terminal 1)
```bash
cd server
npm install
# Update .env with your OpenRouter API key
npm run start:dev
```

Backend will be available at: **http://localhost:3001**

### 3. Frontend Setup (Terminal 2)
```bash
cd client
npm install
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### 4. MongoDB Setup
Make sure MongoDB is running locally or update `server/.env` with your MongoDB Atlas URI:
```bash
# Option 1: Local MongoDB (if installed)
mongod

# Option 2: MongoDB Atlas
# Update MONGODB_URI in server/.env with your connection string
```

## 🧪 Quick Test

1. **Navigate to http://localhost:3000**
2. **Click "Submit Request"**
3. **Fill in the form:**
   - Name: `John Doe`
   - Email: `john@example.com`
   - Message: `I was charged twice for my subscription this month`
4. **Click "Submit Request"** and wait for success message
5. **Navigate to Dashboard**
6. **Verify:**
   - Request appears in the list
   - AI is analyzing (shows "Analyzing..." badge initially)
   - After ~10 seconds, category badge appears (e.g., "Billing")
   - Summary and urgency are populated
7. **Test filtering:** Click different category tabs - the URL updates and requests filter correctly

## 📧 Submission Requirements

Send an email to **nilesh@qenixlabs.com** with subject: **Full Stack Intern – [Your Full Name]**

Include in the email body:

### 1. GitHub Repository Link
```
https://github.com/[your-username]/[repo-name]
```
Ensure the repository has `/client` and `/server` folders at the root.

### 2. Live Demo URL (Optional but valued)
- **Frontend:** Vercel URL (e.g., https://ai-intake-client.vercel.app)
- **Backend:** Railway/Render URL (e.g., https://ai-intake-server.railway.app)

### 3. 5-7 Line Write-up
Paste plain text directly in the email (not as attachment). Must cover:

**Example Write-up:**
```
Architecture Decision & Module Separation:
I organized the NestJS backend into two main modules: RequestsModule handles CRUD operations 
and request persistence, while AiModule is completely decoupled and handles enrichment logic. 
This separation ensures no AI logic leaks into the controller layer, maintaining clean 
architecture principles.

Async AI Processing:
The POST /requests endpoint saves the request to MongoDB first and responds with 201 immediately. 
The AI enrichment is triggered using setImmediate() as a fire-and-forget async call, ensuring 
the client doesn't wait for AI processing. If the AI call fails (network error, rate limit, 
parse failure), the request persists with null fields and the error is logged silently.

Future Improvement:
If I had more time, I would implement WebSocket support to push real-time updates to the 
dashboard when AI enrichment completes, so users don't need to refresh the page to see 
updated category/summary/urgency fields.
```

### 4. Your AI Prompt (MANDATORY)
Paste your exact system prompt sent to OpenRouter. This should be between 150-300 words and 
instruct the model to respond ONLY with JSON.

**Example:**
```
You are an expert support triage assistant for a customer request intake system.

Your task is to analyze incoming customer requests and categorize them for appropriate handling.

You MUST respond with ONLY a valid JSON object. Do not include any markdown, code blocks, 
explanations, or additional text.

The JSON response must have exactly this structure:
{
  "category": "billing" | "support" | "feedback" | "general",
  "summary": "A concise one-sentence summary of the main issue",
  "urgency": "low" | "medium" | "high"
}

Categorization rules:
- "billing": Payment, subscription, refund, or charge issues
- "support": Technical issues, features, or account problems
- "feedback": Suggestions or non-urgent feedback
- "general": Anything else

Urgency rules:
- "high": Critical issues or security concerns
- "medium": Standard requests needing quick attention
- "low": General feedback or non-urgent inquiries

Respond only with JSON. No explanations.
```

## 🔑 Critical Implementation Details

### Backend Strengths to Highlight

1. **Module Architecture**
   - Completely separated `RequestsModule` and `AiModule`
   - Clear responsibility boundaries
   - Easily testable and maintainable

2. **Async Fire-and-Forget**
   - POST responds with 201 immediately
   - `setImmediate()` triggers AI without blocking
   - Gracefully handles AI failure (request still persists)

3. **Error Resilience**
   - AI parse failures caught and logged
   - Fallback values provided
   - Invalid JSON responses handled gracefully

4. **Clean DTOs & Validation**
   - `CreateRequestDto` with class-validator rules
   - Email validation built-in
   - Message length validation

### Frontend Strengths to Highlight

1. **Server Components with Suspense**
   - Dashboard uses async Server Component
   - Suspense boundary with skeleton loading
   - No client-side "loading" state management needed

2. **URL-Based Filtering**
   - Category stored in search params
   - Filtering happens server-side with API call
   - Pages are bookmarkable and shareable

3. **Proper UX States**
   - Loading: Skeleton cards with shimmer animation
   - Empty: Meaningful message with CTA
   - Error: Detailed error message with retry button

4. **React Hook Form Integration**
   - Validation on blur
   - Field-level error messages
   - Loading state during submission

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongod

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port 3001 is free
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows
```

### Frontend shows "API Error"
```bash
# Verify backend is running on localhost:3001
curl http://localhost:3001/requests

# Check NEXT_PUBLIC_API_URL is correct in client/.env.local
# Should be: http://localhost:3001
```

### AI enrichment not happening
```bash
# Check OpenRouter API key is correct in server/.env
# Verify network connectivity
# Check server logs for errors

# Manual test in Node:
node -e "console.log(process.env.OPENROUTER_API_KEY)" 
```

### MongoDB connection fails
```bash
# Connection string format:
# Local: mongodb://localhost:27017/ai-intake
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/database

# Verify MongoDB is running:
mongo  # Opens MongoDB shell
# or
mongosh  # Newer version
```

## 📚 Project Structure Reference

```
root/
├── README.md                    # Main project documentation
├── SUBMISSION_GUIDE.md         # This file
├── client/                     # Next.js 14 App
│   ├── app/
│   │   ├── (dashboard)         # Dashboard with filtering
│   │   ├── (submit)            # Submission form
│   │   ├── page.tsx            # Landing page
│   │   └── layout.tsx          # Root layout + nav
│   ├── components/             # Reusable UI components
│   ├── lib/                    # API client & utilities
│   └── package.json
└── server/                     # NestJS API
    ├── src/
    │   ├── requests/           # Feature module
    │   ├── ai/                 # AI integration module
    │   ├── app.module.ts       # Root module
    │   └── main.ts             # Bootstrap
    └── package.json
```

## ✅ Evaluation Criteria

The assessment weights these areas:

- **40% Thinking** - Your write-up quality, architectural decisions, async handling strategy
- **30% Backend** - Module separation, service layer, error handling, DTO validation
- **20% Frontend** - UX states (loading/empty/error), filtering, form validation
- **10% Polish** - README quality, code readability, folder structure

## 🎯 Key Success Signals

1. ✅ Backend has separate `RequestsModule` and `AiModule` with no AI logic in controller
2. ✅ POST returns 201 immediately; AI runs asynchronously
3. ✅ Dashboard filters requests via API call with ?category= param
4. ✅ All UX states implemented (loading skeleton, empty state, error handling)
5. ✅ AI prompt is well-crafted and passed to evaluators
6. ✅ Project starts cleanly from a fresh clone

## 📞 Last-Minute Checklist

Before hitting send:

- [ ] Git repo is public and contains `/client` and `/server`
- [ ] Latest commit is clean (no uncommitted changes)
- [ ] README has setup instructions
- [ ] .env files are in .gitignore
- [ ] .env.example files exist with placeholder values
- [ ] Backend starts: `npm run start:dev`
- [ ] Frontend starts: `npm run dev`
- [ ] Form submission works end-to-end
- [ ] Dashboard loads and displays requests
- [ ] Filtering changes URL and fetches from API
- [ ] Write-up is clear and covers all 3 points
- [ ] AI prompt is included
- [ ] Email subject line matches: "Full Stack Intern – [Your Name]"

Good luck! 🚀
