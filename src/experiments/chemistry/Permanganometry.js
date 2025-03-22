import React, { useState, useRef, useEffect } from 'react';
import ChemistryEquipment from './ChemistryEquipment';
import '../../styles/experiments.css';

function Permanganometry() {
  const [burette, setBurette] = useState({
    initialVolume: 50.0,
    currentVolume: 50.0,
    solution: 'KMnO₄ (0.02M)',
    isFlowing: false
  });
  
  const [flask, setFlask] = useState({
    volume: 100,
    solution: 'Fe²⁺ (0.1M) in H₂SO₄',
    color: 'clear',
    endpointReached: false
  });
  
  const [experimentStatus, setExperimentStatus] = useState('setup'); // setup, running, completed
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  
  // Endpoint is when 20mL of KMnO₄ has been added (for this simplified experiment)
  const endpointVolume = 20.0;
  
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 0.1);
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);
  
  useEffect(() => {
    if (burette.isFlowing) {
      const interval = setInterval(() => {
        setBurette(prev => {
          const newVolume = Math.max(prev.currentVolume - 0.1, 0);
          const volumeAdded = prev.initialVolume - newVolume;
          
          // Update flask color based on volume added
          updateFlaskColor(volumeAdded);
          
          // Check if we need to stop automatically
          if (newVolume <= 0) {
            setExperimentStatus('completed');
            setTimerRunning(false);
            return { ...prev, currentVolume: 0, isFlowing: false };
          }
          
          return { ...prev, currentVolume: newVolume };
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [burette.isFlowing]);
  
  const updateFlaskColor = (volumeAdded) => {
    let newColor = 'clear';
    let endpointReached = false;
    
    // The permanganate initially decolorizes when added to the Fe²⁺ solution
    if (volumeAdded > 0 && volumeAdded < endpointVolume - 1) {
      newColor = 'very-light-yellow'; // Fe³⁺ formation gives slight yellow color
    } 
    // Just before the endpoint, we might see a flash of pink that quickly disappears
    else if (volumeAdded >= endpointVolume - 1 && volumeAdded < endpointVolume) {
      newColor = 'flash-pink';
    } 
    // We've reached the endpoint! First persistent pink color
    else if (volumeAdded >= endpointVolume && volumeAdded < endpointVolume + 1) {
      newColor = 'light-purple';
      endpointReached = true;
    } 
    // We've gone past the endpoint
    else if (volumeAdded >= endpointVolume + 1) {
      newColor = 'dark-purple';
      endpointReached = true;
    }
    
    setFlask(prev => ({ ...prev, color: newColor, endpointReached }));
  };
  
  const handleStart = () => {
    setExperimentStatus('running');
    setBurette(prev => ({ ...prev, isFlowing: true }));
    setTimerRunning(true);
  };
  
  const handleStop = () => {
    setBurette(prev => ({ ...prev, isFlowing: false }));
    setTimerRunning(false);
    setExperimentStatus('completed');
  };
  
  const handleReset = () => {
    setBurette({
      initialVolume: 50.0,
      currentVolume: 50.0,
      solution: 'KMnO₄ (0.02M)',
      isFlowing: false
    });
    
    setFlask({
      volume: 100,
      solution: 'Fe²⁺ (0.1M) in H₂SO₄',
      color: 'clear',
      endpointReached: false
    });
    
    setExperimentStatus('setup');
    setTimerRunning(false);
    setElapsedTime(0);
  };
  
  const calculateResults = () => {
    if (experimentStatus !== 'completed') return null;
    
    const volumeAdded = burette.initialVolume - burette.currentVolume;
    const errorPercentage = Math.abs((volumeAdded - endpointVolume) / endpointVolume * 100).toFixed(2);
    let accuracy = 'Excellent!';
    
    if (errorPercentage > 5) {
      accuracy = 'Needs improvement';
    } else if (errorPercentage > 2) {
      accuracy = 'Good';
    } else if (errorPercentage > 1) {
      accuracy = 'Very good';
    }
    
    // Calculate Fe²⁺ concentration based on redox equation: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O
    const permanganateMoles = (volumeAdded * 0.02) / 1000; // moles = volume (L) * molarity
    const ferrusMoles = permanganateMoles * 5; // 1 mol KMnO₄ reacts with 5 mol Fe²⁺
    const ferrusConcentration = (ferrusMoles / 0.1).toFixed(4); // 100 mL = 0.1 L solution
    
    return {
      volumeAdded: volumeAdded.toFixed(1),
      expectedVolume: endpointVolume.toFixed(1),
      errorPercentage,
      accuracy,
      ferrusConcentration
    };
  };
  
  return (
    <div className="titration-experiment">
      <div className="experiment-controls">
        <div className="experiment-info">
          <h3>Permanganometry Redox Titration</h3>
          <p>Goal: Determine Fe²⁺ concentration by titrating with KMnO₄ until a persistent pink color appears.</p>
          <div className="solution-info">
            <div>
              <span className="label">Burette Solution:</span>
              <span>{burette.solution}</span>
            </div>
            <div>
              <span className="label">Flask Solution:</span>
              <span>{flask.solution}</span>
            </div>
          </div>
        </div>
        
        <div className="control-buttons">
          {experimentStatus === 'setup' && (
            <button 
              className="control-button start-button" 
              onClick={handleStart}
            >
              Start Titration
            </button>
          )}
          
          {experimentStatus === 'running' && (
            <button 
              className="control-button stop-button"
              onClick={handleStop}
            >
              Stop Titration
            </button>
          )}
          
          {experimentStatus === 'completed' && (
            <button 
              className="control-button reset-button"
              onClick={handleReset}
            >
              Reset Experiment
            </button>
          )}
        </div>
        
        <div className="readings">
          <div className="reading">
            <span className="reading-label">Burette Volume:</span>
            <span className="reading-value">{burette.currentVolume.toFixed(1)} mL</span>
          </div>
          <div className="reading">
            <span className="reading-label">Time Elapsed:</span>
            <span className="reading-value">{elapsedTime.toFixed(1)} s</span>
          </div>
        </div>
        
        {experimentStatus === 'completed' && (
          <div className="results">
            <h4>Experiment Results</h4>
            {calculateResults() && (
              <>
                <div className="result-item">
                  <span>Volume Added:</span>
                  <span>{calculateResults().volumeAdded} mL</span>
                </div>
                <div className="result-item">
                  <span>Expected Volume:</span>
                  <span>{calculateResults().expectedVolume} mL</span>
                </div>
                <div className="result-item">
                  <span>Error Percentage:</span>
                  <span>{calculateResults().errorPercentage}%</span>
                </div>
                <div className="result-item">
                  <span>Fe²⁺ Amount:</span>
                  <span>{calculateResults().ferrusConcentration} mol</span>
                </div>
                <div className="result-item accuracy">
                  <span>Accuracy:</span>
                  <span>{calculateResults().accuracy}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="experiment-visualization">
        <ChemistryEquipment 
          buretteVolume={burette.currentVolume}
          flaskColor={flask.color}
          isFlowing={burette.isFlowing}
          maxVolume={burette.initialVolume}
        />
      </div>
    </div>
  );
}

export default Permanganometry;