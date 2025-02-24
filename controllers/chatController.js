import { generateAIResponse } from './openaiController.js';
import db from '../config/db.js';

const getInitialMessages = (documentContent) => [{
  role: 'system',
  content: `You are a helpful AI assistant analyzing a document. Here is the document content: "${documentContent}"
  Your task is to help users understand and extract information from this document. 
  Base all your responses on the document content provided.
  If asked about something not in the document, politely inform the user that the information is not present in the document.`
}];

export const handleChat = async (req, res) => {
  try {
    const { message, documentContent, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (!documentContent) {
      return res.status(400).json({ error: 'Document content is required' });
    }

    const document = await db('documents')
      .where('content', documentContent)
      .first();

    if (!document) {
      return res.status(404).json({ error: 'Document not found. Please analyze the document first.' });
    }

    const conversation = await db('conversations')
      .where({
        document_id: document.id,
        status: 'active'
      })
      .first();

    if (!conversation) {
      return res.status(404).json({ error: 'No active conversation found for this document.' });
    }

    const [messageId] = await db('messages')
      .insert({
        conversation_id: conversation.id,
        content: message,
        role: 'user'
      });

    const messageHistory = getInitialMessages(documentContent);
    
    const previousMessages = await db('messages')
      .where('conversation_id', conversation.id)
      .orderBy('created_at', 'asc')
      .select('content', 'role');

    messageHistory.push(...previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    })));

    const aiResponse = await generateAIResponse(messageHistory);

    await db('messages')
      .insert({
        conversation_id: conversation.id,
        content: aiResponse,
        role: 'assistant'
      });

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message
    });
  }
};

export const healthCheck = async (req, res) => {
  try {
    await db.raw('SELECT 1');
    res.json({ 
      status: 'ok', 
      message: 'Server is running and database is connected' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed' 
    });
  }
};