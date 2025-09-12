import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { existsSync } from 'fs';

export const app = express();
export const PORT = process.env.PORT || 5000;
export const CLIENT_DIST_PATH = path.join(__dirname, '../../client/dist');

// In-memory message storage (in production, use a database)
interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

let messages: Message[] = [
  {
    id: '1',
    username: 'Mentat',
    text: 'Welcome to Mentat Party! 🎉 Let the conversation begin!',
    timestamp: new Date(),
  },
];

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies
app.use(express.static(CLIENT_DIST_PATH)); // Serve static files from client/dist

// Basic route
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Mentat Party API! 🎉' });
});

// Chat routes
app.get('/api/messages', (req: Request, res: Response) => {
  res.json({ messages });
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({ error: 'Username and text are required' });
  }

  const newMessage: Message = {
    id: Date.now().toString(),
    username: username.trim(),
    text: text.trim(),
    timestamp: new Date(),
  };

  messages.push(newMessage);

  // Keep only the last 100 messages to prevent memory issues
  if (messages.length > 100) {
    messages = messages.slice(-100);
  }

  res.json({ message: newMessage });
});

// Serve React app or fallback page
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(CLIENT_DIST_PATH, 'index.html');

  // Check if the built client exists
  if (existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Serve a simple fallback page when the client hasn't been built
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mentat Party</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              line-height: 1.6;
              background-color: #fafafa;
            }
            .container {
              background: white;
              padding: 32px;
              border-radius: 16px;
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            }
            a { color: #3b82f6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎉 Mentat Party</h1>
            <p>Welcome to Mentat Party! The chat room is ready to go.</p>
            <p>This route renders the built project from the <code>/dist</code> directory, but there's currently nothing there.</p>
            <p>You can ask Mentat to build the project to see the full chat interface here, or build it yourself with <code>npm run build</code>.</p>
            <p><a href="/api">Go to API endpoint</a> • <a href="/api/messages">View messages</a></p>
          </div>
        </body>
      </html>
    `);
  }
});
