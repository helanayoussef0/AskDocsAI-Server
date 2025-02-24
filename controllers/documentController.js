import db from '../config/db.js';

export const analyzeDocument = async (req, res) => {
  try {
    const { content, filename } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Document content is required' });
    }

    let document = await db('documents')
      .where('content', content)
      .first();

    if (!document) {
      const [documentId] = await db('documents')
        .insert({
          filename: filename || 'uploaded_document.txt',
          content: content
        });

      document = await db('documents')
        .where('id', documentId)
        .first();
    }

    const [conversationId] = await db('conversations')
      .insert({
        document_id: document.id,
        status: 'active'
      });

    const conversation = await db('conversations')
      .where('id', conversationId)
      .first();

    res.json({ 
      success: true,
      message: 'Document analyzed successfully',
      documentId: document.id,
      conversationId: conversation.id
    });

  } catch (error) {
    console.error('Error analyzing document:', error);
    res.status(500).json({ 
      error: 'Failed to analyze document',
      details: error.message
    });
  }
};