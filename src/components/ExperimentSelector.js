import React from 'react';

function ExperimentSelector({ experiments, onSelect }) {
  return (
    <div className="experiment-selector">
      <h3>Available Experiments</h3>
      <div className="experiment-buttons">
        {experiments.map(exp => (
          <button 
            key={exp.id}
            className="experiment-button"
            onClick={() => onSelect(exp.id)}
          >
            <span className="subject-badge">{exp.subject}</span>
            {exp.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExperimentSelector;