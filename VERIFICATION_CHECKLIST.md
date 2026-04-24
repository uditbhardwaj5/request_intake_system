# VERIFICATION CHECKLIST

Use this checklist to ensure everything is working before submission.

## ✅ Pre-Flight Checks

### Repository & Structure
- [ ] `/client` folder exists with all Next.js files
- [ ] `/server` folder exists with all NestJS files
- [ ] `README.md` exists at root with full documentation
- [ ] `SUBMISSION_GUIDE.md` exists with email submission instructions
- [ ] `.gitignore` at root prevents env files from being tracked
- [ ] Git repo initialized with clean commit history

### Backend Files (`/server`)
- [ ] `package.json` has all NestJS dependencies
- [ ] `tsconfig.json` configured correctly
- [ ] `.env.example` shows required variables
- [ ] `.env` has placeholder values (never commit real API key)
- [ ] `src/main.ts` bootstraps the app
- [ ] `src/app.module.ts` imports RequestsModule + AiModule
- [ ] `src/requests/requests.module.ts` exists
- [ ] `src/requests/requests.controller.ts` has POST + GET /requests
- [ ] `src/requests/requests.service.ts` has business logic
- [ ] `src/requests/dto/create-request.dto.ts` has validation
- [ ] `src/requests/schemas/request.schema.ts` matches spec
- [ ] `src/ai/ai.module.ts` exists (separate from requests)
- [ ] `src/ai/ai.service.ts` has OpenRouter integration

### Frontend Files (`/client`)
- [ ] `package.json` has Next.js 14 + React Hook Form + axios
- [ ] `tsconfig.json` configured for Next.js
- [ ] `.env.local` has NEXT_PUBLIC_API_URL placeholder
- [ ] `next.config.js` exists
- [ ] `tailwind.config.js` configured
- [ ] `app/layout.tsx` is root layout with navigation
- [ ] `app/page.tsx` is landing page
- [ ] `app/submit/page.tsx` has submission form
- [ ] `app/dashboard/page.tsx` is server component with filtering
- [ ] `app/dashboard/loading.tsx` shows skeleton
- [ ] `app/dashboard/error.tsx` error boundary
- [ ] `components/request-card.tsx` displays request details
- [ ] `components/states.tsx` has ErrorState, EmptyState components
- [ ] `lib/api.ts` has typed API client

## 🔧 Installation & Startup Tests

### Backend Startup
```bash
cd server
npm install              # Should complete without errors
npm run start:dev        # Should show "Application is running on: http://localhost:3001"
```
- [ ] No TypeScript errors
- [ ] No npm warnings (except peerDependencies)
- [ ] Server listens on port 3001
- [ ] No "Cannot find module" errors

### Frontend Startup
```bash
cd client
npm install              # Should complete without errors
npm run dev             # Should show "ready started server on..."
```
- [ ] No TypeScript errors
- [ ] Next.js compiles successfully
- [ ] No missing pages errors
- [ ] Frontend available at http://localhost:3000

### MongoDB Verification
```bash
mongod                  # Start MongoDB
# or use MongoDB Atlas connection string in .env
```
- [ ] MongoDB is running or Atlas URI is valid
- [ ] No connection errors in server logs

## 🧪 Functional Tests

### API Tests (Postman / curl)

#### Create Request
```bash
curl -X POST http://localhost:3001/requests \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "message":"I was charged twice for my subscription"
  }'
```
- [ ] Returns 201 status code
- [ ] Response includes created request with null AI fields
- [ ] Request saved to MongoDB (check with mongo client)

#### Fetch Requests
```bash
curl http://localhost:3001/requests
curl "http://localhost:3001/requests?category=billing"
curl "http://localhost:3001/requests?page=2&limit=10"
```
- [ ] Returns 200 status code
- [ ] Returns paginated data structure
- [ ] Filtering by category works
- [ ] Pagination parameters work

### Frontend Tests

#### Submit Form (`http://localhost:3000/submit`)
- [ ] Form displays with all 3 fields (Name, Email, Message)
- [ ] Validation errors appear on blur:
  - [ ] Empty name shows error
  - [ ] Invalid email shows error
  - [ ] Message < 10 chars shows error
- [ ] Submit button is disabled while loading
- [ ] Success message appears after submission
- [ ] Form clears after successful submission
- [ ] Error message appears if API fails

#### Dashboard (`http://localhost:3000/dashboard`)
- [ ] Page loads without errors
- [ ] Skeleton skeleton cards show during loading
- [ ] Requests display in card format
- [ ] Each card shows: name, email, message, category, urgency, summary
- [ ] Empty state shows if no requests
- [ ] Filter tabs work (clicking updates URL)
- [ ] URL updates when filter changes: `/dashboard?category=billing`
- [ ] Filtering triggers API call (not client-side filtering)
- [ ] Refreshing page preserves filter in URL
- [ ] Pagination links appear if multiple pages
- [ ] Clicking page 2 updates URL and data

#### AI Enrichment
- [ ] Submit a request
- [ ] Initially shows "Analyzing..." badge
- [ ] After ~10 seconds, refresh dashboard
- [ ] Category badge appears (e.g., "Billing")
- [ ] Summary text appears
- [ ] Urgency level shows
- [ ] Request moved to correct category when filtering

#### Error States
- [ ] Stop backend, try to load dashboard
- [ ] Error state displays with retry button
- [ ] Retry button recovers when backend restarts
- [ ] Stop API, try to submit form
- [ ] Error message appears

## 📋 Code Quality Checks

### Backend Architecture
- [ ] Controllers do NOT call OpenRouter directly
- [ ] Controllers do NOT contain business logic
- [ ] All AI logic is in AiService only
- [ ] RequestsModule imports AiModule (not circular)
- [ ] Services use dependency injection
- [ ] DTOs use class-validator decorators
- [ ] Response is 201 before AI starts

### Frontend Code
- [ ] Dashboard is Server Component (async/await works)
- [ ] Submit form is Client Component with 'use client'
- [ ] No manual loading state booleans (uses React Hook Form)
- [ ] API calls use typed functions from lib/api.ts
- [ ] Components receive data as props, not fetched internally
- [ ] No hardcoded category values in component
- [ ] Suspense boundary around data-dependent content

## 📝 Documentation Checks

### README.md
- [ ] Project overview present
- [ ] Architecture section explains module structure
- [ ] Installation section has step-by-step commands
- [ ] .env variables documented
- [ ] API endpoints documented with examples
- [ ] AI integration strategy explained
- [ ] Known limitations listed
- [ ] Deployment instructions provided

### SUBMISSION_GUIDE.md
- [ ] Pre-submission checklist included
- [ ] Quick start instructions
- [ ] Email submission format specified
- [ ] 5-7 line write-up example provided
- [ ] AI prompt submission requirements clear
- [ ] Troubleshooting section helpful

### .env.example files
- [ ] `server/.env.example` has all required variables
- [ ] `client/.env.example` has NEXT_PUBLIC_API_URL
- [ ] Both have explanatory comments

## 🎯 Submission Ready Checklist

Before sending email:

- [ ] Repository is public on GitHub
- [ ] No `.env` files are committed (only `.env.example`)
- [ ] No `node_modules` folders are committed
- [ ] Latest commit message is meaningful
- [ ] Project starts from fresh clone without issues
- [ ] Write-up is 5-7 lines and addresses all 3 points
- [ ] AI prompt is copied exactly as sent to OpenRouter
- [ ] Email subject is: "Full Stack Intern – [Your Full Name]"
- [ ] Email includes: GitHub link, live demo URL (optional), write-up, AI prompt
- [ ] Email is going to: nilesh@qenixlabs.com

## 🚨 Common Issues & Fixes

### "Cannot find module mongoose"
```bash
cd server && npm install
```

### "Cannot find module next"
```bash
cd client && npm install
```

### API returns 500 error
- Check server logs for TypeScript/runtime errors
- Verify MongoDB is running and connection string is correct
- Verify environment variables are set

### Dashboard shows error state
- Verify backend is running on port 3001
- Check browser console for CORS errors
- Verify NEXT_PUBLIC_API_URL is correct

### AI enrichment not happening
- Verify OPENROUTER_API_KEY is valid in server/.env
- Check server logs for API errors
- Verify network connectivity
- Check OpenRouter rate limits

### Form validation not working
- Clear browser cache
- Verify client app restarted after changes
- Check browser console for JavaScript errors

---

If all checks pass, you're ready to submit! 🚀
