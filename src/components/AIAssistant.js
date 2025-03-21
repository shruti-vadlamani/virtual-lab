import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse, generateContextualHint } from '../utils/aiHelpers';

function AIAssistant({ messages, onSendQuestion, experimentName, experimentId, experimentState }) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Add user question to messages (this will be handled by the parent component)
      onSendQuestion(inputValue);
      setInputValue('');
    }
  };
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Display contextual hint based on experiment state
  const contextualHint = experimentId && experimentState 
    ? generateContextualHint(experimentId, experimentState)
    : null;
  
  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h3>AI Lab Assistant</h3>
        <span className="ai-badge">AI Powered</span>
      </div>
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}
          >
            <span className="message-content">{msg.text}</span>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message">
            <span className="message-content typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {contextualHint && (
        <div className="contextual-hint">
          <span className="hint-icon">💡</span>
          <p>{contextualHint}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="question-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask about the ${experimentName} experiment...`}
          className="question-input"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
    </div>
  );
}

export default AIAssistant;