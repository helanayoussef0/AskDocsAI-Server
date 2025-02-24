import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateAIResponse = async (messages) => {
  try {
    const systemMessage = {
      role: "system",
      content: `You are a helpful AI assistant analyzing documents. Format your responses following these rules:

1. Start with a brief introduction
2. Add a line break after the introduction
3. For numbered lists:
   - Start each item on a new line
   - Use simple numbers (1, 2, 3)
   - Add a line break between items
   - Don't use any asterisks or bullet points
   - Convert any bullet points to sub-points using indentation
4. When providing steps or instructions:
   - Number each main step
   - Add a blank line between steps
   - Use indentation for sub-points under a step
   - Always use numbers, not bullet points
5. End with a brief conclusion on its own line

Example format:
Here's an introduction.

1. First main point
   Additional details for first point
   More information here

2. Second main point
   First sub-point details
   Second sub-point details

3. Third main point

Conclusion here.`
    };

    const modifiedMessages = [systemMessage, ...messages];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: modifiedMessages,
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response');
  }
};