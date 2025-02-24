import { generateAIResponse } from './openaiController.js';

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

    console.log('Received request:', {
      message,
      documentLength: documentContent.length,
      contextLength: context?.length || 0
    });

    const messageHistory = getInitialMessages(documentContent);
    if (context) {
      context.forEach(msg => {
        messageHistory.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    messageHistory.push({
      role: 'user',
      content: message
    });

    const response = await generateAIResponse(messageHistory);
    res.json({ response });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message
    });
  }
};

export const healthCheck = (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
};