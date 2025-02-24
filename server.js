
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configure CORS - allow all origins in development
app.use(cors());

// Add body parser
app.use(express.json({ limit: '10mb' }));

// Add health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize conversation with system message
const getInitialMessages = (documentContent) => [{
  role: 'system',
  content: `You are a helpful AI assistant analyzing a document. Here is the document content: "${documentContent}"
  Your task is to help users understand and extract information from this document. 
  Base all your responses on the document content provided.
  If asked about something not in the document, politely inform the user that the information is not present in the document.`
}];

app.post('/api/chat', async (req, res) => {
  try {
    const { message, documentContent, context } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!documentContent) {
      return res.status(400).json({ error: 'Document content is required' });
    }

    console.log('Received request:', {
      message,
      documentLength: documentContent.length,
      contextLength: context?.length || 0
    });

    // Convert chat history to OpenAI format
    const messageHistory = getInitialMessages(documentContent);
    if (context) {
      context.forEach(msg => {
        messageHistory.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    // Add the new user message
    messageHistory.push({
      role: 'user',
      content: message
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: messageHistory,
      temperature: 0.7,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;
    res.json({ response });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

// Add error handling for server startup
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('OpenAI API Key status:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
});
