# AI-Powered Request Intake System

A full-stack application that uses AI to automatically categorize, summarize, and prioritize customer requests.

## 🚀 Features

- **Intelligent Request Submission**: Users submit requests with name, email, and message
- **AI-Powered Analysis**: Automatic categorization (billing, support, feedback, general) using OpenRouter
- **Request Dashboard**: View all submissions with real-time filtering
- **Category Filtering**: Filter requests by category through URL params
- **Priority Indicators**: AI assigns urgency levels (low, medium, high)
- **Async Processing**: AI enrichment happens in the background without blocking responses
- **Graceful Error Handling**: Requests persist even if AI processing fails

## 📋 Architecture

### Backend (NestJS)
```
server/
├── src/
│   ├── requests/
│   │   ├── requests.module.ts       # Module definition with imports
│   │   ├── requests.controller.ts   # REST endpoints (POST, GET)
│   │   ├── requests.service.ts      # Business logic & service layer
│   │   ├── dto/
│   │   │   └── create-request.dto.ts # DTO with validation
│   │   └── schemas/
│   │       └── request.schema.ts     # MongoDB schema & types
│   ├── ai/
│   │   ├── ai.module.ts             # Module for AI services
│   │   └── ai.service.ts            # OpenRouter integration & enrichment
│   ├── app.module.ts                # Root module
│   └── main.ts                      # Application bootstrap
```

**Key Design Decisions:**
- **Separation of Concerns**: RequestsModule handles CRUD, AiModule handles enrichment
- **Fire-and-Forget Pattern**: `setImmediate()` triggers async AI processing without blocking the POST response
- **Service-Only AI Logic**: Controllers never call OpenRouter directly
- **Graceful Degradation**: If AI fails, request still saves with null fields

### Frontend (Next.js 14)
```
client/
├── app/
│   ├── submit/
│   │   └── page.tsx           # Request submission form
│   ├── dashboard/
│   │   ├── page.tsx           # Main dashboard (Server Component)
│   │   ├── loading.tsx        # Loading skeleton
│   │   └── error.tsx          # Error boundary
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout with nav/footer
│   └── globals.css            # Tailwind styles
├── components/
│   ├── request-card.tsx       # Request display component
│   └── states.tsx             # Loading/Empty/Error states
└── lib/
    └── api.ts                 # API client & TypeScript types
```

**Key Design Decisions:**
- **Server Components**: Dashboard uses async Server Components for data fetching
- **Client Components**: Form uses Client Components with React Hook Form
- **Suspension & Loading**: Suspense boundary with skeleton cards during fetch
- **URL-Based Filtering**: Category param in URL enables bookmarking/sharing

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas URI)
- OpenRouter API key: https://openrouter.ai

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/ai-intake
   OPENROUTER_API_KEY=your_api_key_here
   NODE_ENV=development
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start the development server**
   ```bash
   npm run start:dev
   ```
   Server will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

## 🧪 API Endpoints

### POST `/requests`
**Submit a new request**

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I was charged twice for my subscription this month"
}
```

Response (201):
```json
{
  "statusCode": 201,
  "message": "Request submitted successfully. Our AI is analyzing your request.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I was charged twice...",
    "category": null,
    "summary": null,
    "urgency": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET `/requests`
**Fetch paginated requests with optional filtering**

Query Parameters:
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page
- `category` (optional) - Filter by: billing | support | feedback | general | all

Examples:
```
GET /requests                                    # All requests, page 1
GET /requests?page=2&limit=20                   # Page 2, 20 items per page
GET /requests?category=billing                  # Only billing requests
GET /requests?page=1&category=support&limit=10  # Filtered + paginated
```

Response (200):
```json
{
  "statusCode": 200,
  "message": "Requests retrieved successfully",
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "message": "...",
        "category": "billing",
        "summary": "Customer was charged twice for their subscription",
        "urgency": "high",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:31:00.000Z"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

## 🤖 AI Integration

### System Prompt
The AI receives this carefully crafted prompt to ensure JSON-only output:

```
You are an expert support triage assistant for a customer request intake system.

Your task is to analyze incoming customer requests and categorize them for appropriate handling.

You MUST respond with ONLY a valid JSON object. Do not include any markdown, code blocks, explanations, or additional text.

The JSON response must have exactly this structure:
{
  "category": "billing" | "support" | "feedback" | "general",
  "summary": "A concise one-sentence summary of the main issue or request",
  "urgency": "low" | "medium" | "high"
}

Categorization rules:
- "billing": Issues related to payments, subscriptions, refunds, or charges
- "support": Technical issues, feature requests, or account problems
- "feedback": General feedback, suggestions, or non-urgent comments
- "general": Anything that doesn't fit the above categories

Urgency rules:
- "high": Critical issues, security concerns, or account access problems
- "medium": Standard requests or moderate issues requiring quick attention
- "low": General feedback, non-urgent inquiries, or compliments

Respond only with the JSON object. No explanations, no markdown, no extra text.
```

### Error Handling
- **Parse Failures**: If JSON extraction fails, returns fallback: `{ category: 'general', summary: 'Request received...', urgency: 'medium' }`
- **Missing Fields**: Validates all required fields; uses fallback if incomplete
- **Invalid Enums**: Checks category and urgency values; uses fallback if invalid
- **Network Errors**: Silently fails; request persists with null AI fields

## 📱 Frontend Pages

### Landing Page (`/`)
- Welcome message and overview
- Quick links to Submit and Dashboard
- Feature highlights

### Submit Page (`/submit`)
- Form with fields: Name, Email, Message
- React Hook Form validation
- Loading state with spinner during submission
- Success confirmation with redirect option
- Error state with detailed error message

### Dashboard Page (`/dashboard`)
- Server Component for data fetching
- Category filter tabs (All, Billing, Support, Feedback, General)
- URL-based filtering (bookmarkable/shareable)
- Paginated list of requests
- Request cards showing:
  - Name and email
  - Original message
  - AI-generated summary (if available)
  - Category badge with color coding
  - Urgency indicator
  - Creation date
- Loading skeleton during fetch
- Empty state when no requests
- Error state with retry button

## 🎯 Testing Checklist

1. **Backend**
   - [ ] POST /requests accepts valid input
   - [ ] POST /requests validates required fields
   - [ ] POST /requests returns 201 immediately
   - [ ] AI enrichment runs async (doesn't block response)
   - [ ] GET /requests returns paginated results
   - [ ] GET /requests?category=X filters correctly
   - [ ] MongoDB persists data correctly

2. **Frontend**
   - [ ] Submit form validates before submission
   - [ ] Submit form shows loading state
   - [ ] Submit form shows success confirmation
   - [ ] Dashboard fetches and displays requests
   - [ ] Dashboard filtering works with URL params
   - [ ] Dashboard skeleton shows during load
   - [ ] Dashboard empty state displays when no data
   - [ ] Dashboard error state recovers on retry

3. **AI Integration**
   - [ ] OpenRouter API key is configured
   - [ ] AI response is parsed correctly
   - [ ] Fallback values used on parse failure
   - [ ] Request persists even if AI fails

## 📦 Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb://localhost:27017/ai-intake
OPENROUTER_API_KEY=your_openrouter_api_key
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy

### Backend (Railway/Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy NestJS app
4. Update frontend `NEXT_PUBLIC_API_URL` with deployed backend URL

## 📝 Known Limitations & Trade-offs

- **MongoDB Local Requirement**: Currently defaults to local MongoDB. For production, use MongoDB Atlas
- **Single Backend Instance**: No load balancing; suitable for demo/MVP only
- **No Authentication**: Anyone can view/submit requests; add auth layer for production
- **Synchronous Fetch**: Dashboard fetches on page load; consider adding real-time updates with WebSockets
- **Fixed Page Size**: No option for users to change pagination limit; could add in UX update
- **No Request Search**: Can only filter by category; full-text search not implemented

## 🔄 What I'd Improve With More Time

1. **Authentication & Authorization**
   - JWT-based auth
   - Role-based access (admin, user, support agent)
   - Request ownership tracking

2. **Real-time Features**
   - WebSocket updates when AI enriches requests
   - Live request feed
   - Notification system

3. **Advanced Filtering**
   - Search by name/email
   - Date range filters
   - Combined filters

4. **Data Visualization**
   - Dashboard analytics (requests by category, urgency distribution)
   - Trend charts over time
   - AI confidence scores

5. **Performance**
   - Request caching with Redis
   - Batch AI processing for multiple requests
   - Optimized MongoDB indexes

6. **Testing**
   - Unit tests for services
   - Integration tests for API
   - E2E tests for workflows

## 📄 License

MIT
