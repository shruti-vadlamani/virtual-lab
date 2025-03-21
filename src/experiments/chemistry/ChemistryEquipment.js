import React from 'react';

function ChemistryEquipment({ buretteVolume, flaskColor, isFlowing, maxVolume }) {
  // Calculate fill percentage for burette
  const fillPercentage = (buretteVolume / maxVolume) * 100;
  
  // Determine flask color class
  const flaskColorClass = `flask-solution ${flaskColor}`;
  
  return (
    <div className="chemistry-equipment">
      <svg viewBox="0 0 300 500" xmlns="http://www.w3.org/2000/svg">
        {/* Burette Stand */}
        <rect x="30" y="20" width="20" height="400" fill="#555" />
        <rect x="20" y="20" width="40" height="20" fill="#555" />
        <rect x="20" y="420" width="200" height="10" fill="#555" />
        
        {/* Burette */}
        <g className="burette">
          <rect x="100" y="50" width="30" height="300" fill="none" stroke="#333" strokeWidth="2" />
          
          {/* Burette Fill Level */}
          <rect 
            x="100" 
            y={50 + ((100 - fillPercentage) / 100 * 300)} 
            width="30" 
            height={fillPercentage / 100 * 300} 
            fill="#e6f7ff" 
            opacity="0.8" 
          />
          
          {/* Burette Markings */}
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <line 
                x1="100" 
                y1={50 + i * 30} 
                x2="105" 
                y2={50 + i * 30} 
                stroke="#333" 
                strokeWidth="1" 
              />
              <text 
                x="85" 
                y={55 + i * 30} 
                fontSize="12" 
                textAnchor="end" 
                fill="#333"
              >
                {maxVolume - (i * (maxVolume / 10))}
              </text>
            </g>
          ))}
          
          {/* Burette Tip */}
          <path d="M115 350 L115 370 L110 380 L120 380 L115 370" fill="#333" />
          
          {/* Burette Stopcock */}
          <circle cx="115" cy="350" r="5" fill="#c00" />
          
          {/* Dripping animation if flowing */}
          {isFlowing && (
            <>
              <circle cx="115" cy="390" r="2" fill="#e6f7ff">
                <animate 
                  attributeName="cy" 
                  from="390" 
                  to="430" 
                  dur="1s" 
                  repeatCount="indefinite" 
                />
                <animate 
                  attributeName="opacity" 
                  from="1" 
                  to="0" 
                  dur="1s" 
                  repeatCount="indefinite" 
                />
              </circle>
            </>
          )}
        </g>
        
        {/* Flask */}
        <g className="flask">
          <path 
            d="M90 430 L140 430 L160 480 L70 480 Z" 
            fill="none" 
            stroke="#333" 
            strokeWidth="2" 
          />
          
          {/* Flask Solution */}
          <path 
            d="M90 430 L140 430 L160 480 L70 480 Z" 
            className={flaskColorClass}
            opacity="0.8" 
          />
          
          {/* Flask Bottom */}
          <ellipse cx="115" cy="480" rx="45" ry="10" fill="none" stroke="#333" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export default ChemistryEquipment;