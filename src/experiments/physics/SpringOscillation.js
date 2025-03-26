import React, { useState, useEffect, useRef } from 'react';
import SpringEquipment from './SpringEquipment';
import '../../styles/experiments.css';

function SpringOscillation() {
  const [springSettings, setSpringSettings] = useState({
    springConstant: 10.0, // in N/m
    mass: 0.5, // in kg
    initialDisplacement: 0.15 // in meters
  });
  
  const [experimentStatus, setExperimentStatus] = useState('setup'); // setup, running, completed
  const [measurements, setMeasurements] = useState({
    oscillations: 0,
    time: 0,
    period: 0
  });
  
  const [isOscillating, setIsOscillating] = useState(false);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const oscillationsRef = useRef(0);
  const lastOscillationTimeRef = useRef(0);
  
  // Calculate theoretical period using the formula T = 2π√(m/k)
  const calculateTheoreticalPeriod = () => {
    return 2 * Math.PI * Math.sqrt(springSettings.mass / springSettings.springConstant);
  };
  
  const handleStart = () => {
    setExperimentStatus('running');
    setIsOscillating(true);
    timeRef.current = 0;
    oscillationsRef.current = 0;
    lastOscillationTimeRef.current = 0;
    setMeasurements({
      oscillations: 0,
      time: 0,
      period: 0
    });
    
    let startTime = Date.now();
    
    animationRef.current = setInterval(() => {
      // Update elapsed time
      const currentTime = (Date.now() - startTime) / 1000;
      timeRef.current = currentTime;
      
      // Update measurements display every 100ms
      setMeasurements(prev => ({
        ...prev,
        time: currentTime.toFixed(2),
        oscillations: oscillationsRef.current,
        period: oscillationsRef.current > 0 
          ? (currentTime / oscillationsRef.current).toFixed(2) 
          : 0
      }));
      
      // Auto-stop after 10 oscillations
      if (oscillationsRef.current >= 10) {
        handleStop();
      }
    }, 100);
  };
  
  const handleStop = () => {
    setExperimentStatus('completed');
    setIsOscillating(false);
    clearInterval(animationRef.current);
  };
  
  const handleReset = () => {
    setExperimentStatus('setup');
    setIsOscillating(false);
    clearInterval(animationRef.current);
    setMeasurements({
      oscillations: 0,
      time: 0,
      period: 0
    });
  };
  
  const handleSpringOscillation = () => {
    // Called from SpringEquipment component when spring completes one oscillation
    oscillationsRef.current += 1;
    
    // Calculate period between oscillations
    const currentTime = timeRef.current;
    if (lastOscillationTimeRef.current > 0) {
      const oscillationPeriod = currentTime - lastOscillationTimeRef.current;
      // Update period calculation in real-time
      setMeasurements(prev => ({
        ...prev,
        period: ((prev.period * (oscillationsRef.current - 1) + oscillationPeriod) / oscillationsRef.current).toFixed(2)
      }));
    }
    lastOscillationTimeRef.current = currentTime;
  };
  
  const handleSpringConstantChange = (e) => {
    setSpringSettings(prev => ({
      ...prev,
      springConstant: parseFloat(e.target.value)
    }));
  };
  
  const handleMassChange = (e) => {
    setSpringSettings(prev => ({
      ...prev,
      mass: parseFloat(e.target.value)
    }));
  };
  
  const handleDisplacementChange = (e) => {
    setSpringSettings(prev => ({
      ...prev,
      initialDisplacement: parseFloat(e.target.value)
    }));
  };
  
  // Calculate accuracy at the end
  const calculateAccuracy = () => {
    if (experimentStatus !== 'completed') return null;
    
    const theoreticalPeriod = calculateTheoreticalPeriod();
    const measuredPeriod = parseFloat(measurements.period);
    const errorPercentage = Math.abs((measuredPeriod - theoreticalPeriod) / theoreticalPeriod * 100).toFixed(2);
    
    let accuracy = 'Excellent!';
    if (errorPercentage > 5) {
      accuracy = 'Needs improvement';
    } else if (errorPercentage > 2) {
      accuracy = 'Good';
    } else if (errorPercentage > 1) {
      accuracy = 'Very good';
    }
    
    return {
      measuredPeriod: measuredPeriod.toFixed(2),
      theoreticalPeriod: theoreticalPeriod.toFixed(2),
      errorPercentage,
      accuracy
    };
  };
  
  return (
    <div className="pendulum-experiment">
      <div className="experiment-controls">
        <div className="experiment-info">
          <h3>Spring Oscillation</h3>
          <p>Goal: Measure the period of a spring-mass system and verify the relationship T = 2π√(m/k).</p>
        </div>
        
        <div className="settings">
          <div className="setting">
            <label>Spring Constant (N/m):</label>
            <input 
              type="range" 
              min="5" 
              max="30" 
              step="1" 
              value={springSettings.springConstant}
              onChange={handleSpringConstantChange}
              disabled={experimentStatus !== 'setup'}
            />
            <span className="setting-value">{springSettings.springConstant.toFixed(1)}</span>
          </div>
          
          <div className="setting">
            <label>Mass (kg):</label>
            <input 
              type="range" 
              min="0.1" 
              max="2.0" 
              step="0.1" 
              value={springSettings.mass}
              onChange={handleMassChange}
              disabled={experimentStatus !== 'setup'}
            />
            <span className="setting-value">{springSettings.mass.toFixed(1)}</span>
          </div>
          
          <div className="setting">
            <label>Initial Displacement (m):</label>
            <input 
              type="range" 
              min="0.05" 
              max="0.30" 
              step="0.05" 
              value={springSettings.initialDisplacement}
              onChange={handleDisplacementChange}
              disabled={experimentStatus !== 'setup'}
            />
            <span className="setting-value">{springSettings.initialDisplacement.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="control-buttons">
          {experimentStatus === 'setup' && (
            <button 
              className="control-button start-button" 
              onClick={handleStart}
            >
              Start Experiment
            </button>
          )}
          
          {experimentStatus === 'running' && (
            <button 
              className="control-button stop-button"
              onClick={handleStop}
            >
              Stop Experiment
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
            <span className="reading-label">Time:</span>
            <span className="reading-value">{measurements.time} s</span>
          </div>
          <div className="reading">
            <span className="reading-label">Oscillations:</span>
            <span className="reading-value">{measurements.oscillations}</span>
          </div>
          <div className="reading">
            <span className="reading-label">Measured Period:</span>
            <span className="reading-value">{measurements.period} s</span>
          </div>
          <div className="reading">
            <span className="reading-label">Theoretical Period:</span>
            <span className="reading-value">{calculateTheoreticalPeriod().toFixed(2)} s</span>
          </div>
        </div>
        
        {experimentStatus === 'completed' && calculateAccuracy() && (
          <div className="results">
            <h4>Experiment Results</h4>
            <div className="result-item">
              <span>Measured Period:</span>
              <span>{calculateAccuracy().measuredPeriod} s</span>
            </div>
            <div className="result-item">
              <span>Theoretical Period:</span>
              <span>{calculateAccuracy().theoreticalPeriod} s</span>
            </div>
            <div className="result-item">
              <span>Error Percentage:</span>
              <span>{calculateAccuracy().errorPercentage}%</span>
            </div>
            <div className="result-item accuracy">
              <span>Accuracy:</span>
              <span>{calculateAccuracy().accuracy}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="experiment-visualization">
        <SpringEquipment 
          springConstant={springSettings.springConstant}
          mass={springSettings.mass}
          initialDisplacement={springSettings.initialDisplacement}
          isOscillating={isOscillating}
          onCompletedOscillation={handleSpringOscillation}
        />
      </div>
    </div>
  );
}

export default SpringOscillation;