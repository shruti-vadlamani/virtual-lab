// src/utils/geminiService.js

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Send a request to the Gemini API
 * @param {String} prompt - The prompt to send to Gemini
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} - The response from Gemini
 */
export const getGeminiResponse = async (prompt, options = {}) => {
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          ...options.generationConfig
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text from the response
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};

/**
 * Generate a prompt for the Gemini API based on experiment context
 * @param {String} experimentId - ID of the current experiment
 * @param {String} experimentName - Name of the current experiment
 * @param {String} userQuestion - User's question
 * @param {Array} previousMessages - Previous messages in the conversation
 * @returns {String} - Formatted prompt for Gemini
 */
export const generateGeminiPrompt = (experimentId, experimentName, userQuestion, previousMessages = []) => {
  // Create a system prompt with context about the current experiment
  let systemPrompt = '';
  
  if (experimentId === 'titration') {
    systemPrompt = `
      You are an AI lab assistant helping a student with a virtual acid-base titration experiment.
      Key concepts for this experiment:
      - Titration is used to determine the unknown concentration of an acid or base.
      - The endpoint is detected by color change of the indicator (phenolphthalein).
      - The formula c₁v₁ = c₂v₂ is used for calculations.
      - Phenolphthalein is colorless in acidic solutions and pink in basic solutions.
      - The color change occurs at approximately pH 8.2.
    `;
  } else if (experimentId === 'pendulum') {
    systemPrompt = `
      You are an AI lab assistant helping a student with a virtual simple pendulum experiment.
      Key concepts for this experiment:
      - The period of a pendulum is the time it takes to complete one full swing.
      - The period T is calculated using the formula T = 2π√(L/g).
      - Length (L) directly affects the period - longer length means longer period.
      - Gravity (g) provides the restoring force (typically 9.8 m/s² on Earth).
      - The small angle approximation assumes sin(θ) ≈ θ for small angles.
    `;
  } else {
    systemPrompt = `
      You are an AI lab assistant helping a student with a virtual ${experimentName} experiment.
      Your goal is to explain concepts clearly and help them understand the scientific principles.
    `;
  }
  
  // Add conversation history for context
  let conversationHistory = '';
  if (previousMessages.length > 0) {
    conversationHistory = 'Previous conversation:\n';
    previousMessages.forEach(msg => {
      const role = msg.isUser ? 'Student' : 'Assistant';
      conversationHistory += `${role}: ${msg.text}\n`;
    });
  }
  
  // Combine all parts into the final prompt
  const fullPrompt = `
    ${systemPrompt}
    
    ${conversationHistory}
    
    Student: ${userQuestion}
    
    Instructions:
    - Give a clear, concise answer aimed at a high school or undergraduate student.
    - Include relevant scientific concepts and equations when appropriate.
    - If you're unsure about something, admit it rather than providing incorrect information.
    - Keep your response under 150 words unless a detailed explanation is necessary.
    - Don't start with phrases like "As an AI assistant" or "I'm here to help."
    
    Assistant:
  `;
  
  return fullPrompt.trim();
};