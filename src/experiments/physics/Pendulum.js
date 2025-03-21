import React, { useState, useEffect, useRef } from 'react';
import PhysicsEquipment from './PhysicsEquipment';
import '../../styles/experiments.css';

function Pendulum() {
  const [pendulumSettings, setPendulumSettings] = useState({
    length: 1.0, // in meters
    angle: 15, // in degrees
    gravity: 9.8 // in m/s²
  });
  
  const [experimentStatus, setExperimentStatus] = useState('setup'); // setup, running, completed
  const [measurements, setMeasurements] = useState({
    swings: 0,
    time: 0,
    period: 0
  });
  
  const [isSwinging, setIsSwinging] = useState(false);
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const swingsRef = useRef(0);
  const lastSwingTimeRef = useRef(0);
  
  // Calculate theoretical period using the formula T = 2π√(L/g)
  const calculateTheoreticalPeriod = () => {
    return 2 * Math.PI * Math.sqrt(pendulumSettings.length / pendulumSettings.gravity);
  };
  
  const handleStart = () => {
    setExperimentStatus('running');
    setIsSwinging(true);
    timeRef.current = 0;
    swingsRef.current = 0;
    lastSwingTimeRef.current = 0;
    setMeasurements({
      swings: 0,
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
        swings: swingsRef.current,
        period: swingsRef.current > 0 
          ? (currentTime / swingsRef.current).toFixed(2) 
          : 0
      }));
      
      // Auto-stop after 10 swings
      if (swingsRef.current >= 10) {
        handleStop();
      }
    }, 100);
  };
  
  const handleStop = () => {
    setExperimentStatus('completed');
    setIsSwinging(false);
    clearInterval(animationRef.current);
  };
  
  const handleReset = () => {
    setExperimentStatus('setup');
    setIsSwinging(false);
    clearInterval(animationRef.current);
    setMeasurements({
      swings: 0,
      time: 0,
      period: 0
    });
  };
  
  const handlePendulumSwing = () => {
    // Called from PhysicsEquipment component when pendulum completes one swing
    swingsRef.current += 1;
    
    // Calculate period between swings
    const currentTime = timeRef.current;
    if (lastSwingTimeRef.current > 0) {
      const swingPeriod = currentTime - lastSwingTimeRef.current;
      // Update period calculation in real-time
      setMeasurements(prev => ({
        ...prev,
        period: ((prev.period * (swingsRef.current - 1) + swingPeriod) / swingsRef.current).toFixed(2)
      }));
    }
    lastSwingTimeRef.current = currentTime;
  };
  
  const handlePendulumLengthChange = (e) => {
    setPendulumSettings(prev => ({
      ...prev,
      length: parseFloat(e.target.value)
    }));
  };
  
  const handlePendulumAngleChange = (e) => {
    setPendulumSettings(prev => ({
      ...prev,
      angle: parseInt(e.target.value)
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
          <h3>Simple Pendulum</h3>
          <p>Goal: Measure the period of a pendulum and verify the relationship T = 2π√(L/g).</p>
        </div>
        
        <div className="settings">
          <div className="setting">
            <label>Pendulum Length (m):</label>
            <input 
              type="range" 
              min="0.1" 
              max="2.0" 
              step="0.1" 
              value={pendulumSettings.length}
              onChange={handlePendulumLengthChange}
              disabled={experimentStatus !== 'setup'}
            />
            <span className="setting-value">{pendulumSettings.length.toFixed(1)}</span>
          </div>
          
          <div className="setting">
            <label>Initial Angle (degrees):</label>
            <input 
              type="range" 
              min="5" 
              max="45" 
              step="5" 
              value={pendulumSettings.angle}
              onChange={handlePendulumAngleChange}
              disabled={experimentStatus !== 'setup'}
            />
            <span className="setting-value">{pendulumSettings.angle}°</span>
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
            <span className="reading-label">Swings:</span>
            <span className="reading-value">{measurements.swings}</span>
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
        <PhysicsEquipment 
          length={pendulumSettings.length}
          angle={pendulumSettings.angle}
          isSwinging={isSwinging}
          onCompletedSwing={handlePendulumSwing}
          gravity={pendulumSettings.gravity}
        />
      </div>
    </div>
  );
}

export default Pendulum;