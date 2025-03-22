import React, { useState } from 'react';
import NavBar from './components/NavBar';
import ExperimentSelector from './components/ExperimentSelector';
import Titration from './experiments/chemistry/Titration';
import Permanganometry from './experiments/chemistry/Permanganometry';
import Pendulum from './experiments/physics/Pendulum';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import { generateAIResponse } from './utils/aiHelpers';
import { getGeminiResponse, generateGeminiPrompt } from './utils/geminiService';
import './styles/main.css';

function App() {
  const [currentExperiment, setCurrentExperiment] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);
  const [experimentState, setExperimentState] = useState({ status: 'setup' });
  
  const experiments = [
    { id: 'titration', name: 'Acid-Base Titration', subject: 'Chemistry', component: Titration },
    { id: 'pendulum', name: 'Simple Pendulum', subject: 'Physics', component: Pendulum },
    { id: 'permanganometry', name: 'Permanganometry', subject: 'Chemistry', component: Permanganometry}
  ];
  
  const handleSelectExperiment = (experimentId) => {
    const selected = experiments.find(exp => exp.id === experimentId);
    setCurrentExperiment(selected);
    setExperimentState({ status: 'setup' });
    
    // Reset AI messages when switching experiments
    setAiMessages([{
      text: `Welcome to the ${selected.name} experiment! How can I help you?`,
      isUser: false
    }]);
  };
  
  const handleExperimentStateChange = (newState) => {
    setExperimentState(newState);
  };
  
  const handleAiQuestion = async (question) => {
    // Add user question to messages
    const updatedMessages = [...aiMessages, { text: question, isUser: true }];
    setAiMessages(updatedMessages);
    
    // Temporarily show "thinking" message
    setAiMessages([...updatedMessages, { text: "Thinking...", isUser: false, isLoading: true }]);
    
    try {
      let response;
      
      // First try to use the predefinded responses from aiHelpers
      const localResponse = currentExperiment ? 
        generateAIResponse(currentExperiment.id, question) : null;
      
      // If we didn't get a specific response from aiHelpers, use Gemini API
      if (localResponse && !localResponse.includes("I'm here to help with your")) {
        response = localResponse;
      } else {
        // Use Gemini API for more complex or undefined questions
        const prompt = generateGeminiPrompt(
          currentExperiment?.id, 
          currentExperiment?.name, 
          question, 
          // Only include the last 6 messages for context to save tokens
          updatedMessages.slice(-6)
        );
        
        response = await getGeminiResponse(prompt);
      }
      
      // Remove the "thinking" message and add the real response
      setAiMessages([
        ...updatedMessages, 
        { text: response, isUser: false }
      ]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Update with error message
      setAiMessages([
        ...updatedMessages,
        { text: "I'm sorry, I couldn't process your question. Please try again.", isUser: false }
      ]);
    }
  };
  
  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        <div className="experiment-area">
          <ExperimentSelector 
            experiments={experiments} 
            onSelect={handleSelectExperiment} 
          />
          
          {currentExperiment ? (
            <div className="current-experiment">
              <h2>{currentExperiment.name}</h2>
              <div className="experiment-container">
                <currentExperiment.component 
                  onStateChange={handleExperimentStateChange}
                />
              </div>
            </div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome to Virtual Labs</h2>
              <p>Select an experiment from the menu to begin your virtual lab experience.</p>
            </div>
          )}
        </div>
        
        {currentExperiment && (
          <AIAssistant 
            messages={aiMessages}
            onSendQuestion={handleAiQuestion}
            experimentName={currentExperiment.name}
            experimentId={currentExperiment.id}
            experimentState={experimentState}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;