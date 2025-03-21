import React, { useState } from 'react';
import NavBar from './components/NavBar';
import ExperimentSelector from './components/ExperimentSelector';
import Titration from './experiments/chemistry/Titration';
import Pendulum from './experiments/physics/Pendulum';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import './styles/main.css';

function App() {
  const [currentExperiment, setCurrentExperiment] = useState(null);
  const [aiMessages, setAiMessages] = useState([]);
  
  const experiments = [
    { id: 'titration', name: 'Acid-Base Titration', subject: 'Chemistry', component: Titration },
    { id: 'pendulum', name: 'Simple Pendulum', subject: 'Physics', component: Pendulum }
  ];
  
  const handleSelectExperiment = (experimentId) => {
    const selected = experiments.find(exp => exp.id === experimentId);
    setCurrentExperiment(selected);
    
    // Reset AI messages when switching experiments
    setAiMessages([{
      text: `Welcome to the ${selected.name} experiment! How can I help you?`,
      isUser: false
    }]);
  };
  
  const handleAiQuestion = (question) => {
    // Add user question to messages
    setAiMessages([...aiMessages, { text: question, isUser: true }]);
    
    // Generate AI response based on current experiment
    let response = "I'm analyzing your question...";
    
    if (currentExperiment) {
      if (currentExperiment.id === 'titration' && question.toLowerCase().includes('endpoint')) {
        response = "The endpoint of a titration is detected by a color change in the indicator. For phenolphthalein, the solution will turn light pink when you reach the endpoint.";
      } else if (currentExperiment.id === 'pendulum' && question.toLowerCase().includes('period')) {
        response = "The period of a pendulum depends on its length and the acceleration due to gravity. The formula is T = 2π√(L/g).";
      } else {
        response = `For this ${currentExperiment.name} experiment, I recommend carefully observing how the variables affect the outcome. What specific aspect are you having trouble with?`;
      }
    }
    
    // Add AI response to messages (with a small delay to simulate thinking)
    setTimeout(() => {
      setAiMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 800);
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
                <currentExperiment.component />
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
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;