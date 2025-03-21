import React, { useState, useRef, useEffect } from 'react';

function AIAssistant({ messages, onSendQuestion, experimentName }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendQuestion(inputValue);
      setInputValue('');
    }
  };
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
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
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="question-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask about the ${experimentName} experiment...`}
          className="question-input"
        />
        <button type="submit" className="send-button">Ask</button>
      </form>
    </div>
  );
}

export default AIAssistant;