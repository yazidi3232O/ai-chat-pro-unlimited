# AI Chat Pro Unlimited

A fast AI chat app built with Next.js and the OpenAI API.

## Features
- ChatGPT-style interface
- Sidebar with chat history
- Streaming responses
- Model selector
- Responsive layout
- Ready for extension with auth, database, billing, and deployment

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

3. Add your OpenAI API key.

4. Run the app:
   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`

## Environment variables

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Notes
This project is intentionally built as a fast MVP foundation. It can be extended with:
- authentication
- persistent chat storage
- Stripe subscriptions
- multi-provider AI support
- file upload
- admin dashboard
- deployment pipelines
