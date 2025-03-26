import React, { useEffect, useRef } from 'react';

function SpringEquipment({ springConstant, mass, initialDisplacement, isOscillating, onCompletedOscillation }) {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastDisplacementSignRef = useRef(null);
  
  // Convert mass to visual size (radius in pixels)
  const massToRadius = (m) => 15 + m * 10;
  
  // Calculate period using the formula T = 2π√(m/k)
  const calculatePeriod = () => {
    return 2 * Math.PI * Math.sqrt(mass / springConstant);
  };
  
  // Convert displacement from meters to pixels
  const displacementToPixels = (d) => d * 200;
  
  const drawSpring = (ctx, canvas, currentDisplacement) => {
    const centerX = canvas.width / 2;
    const topY = 100;
    const restLength = 150;
    const currentLength = restLength + displacementToPixels(currentDisplacement);
    const massRadius = massToRadius(mass);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ceiling mount
    ctx.beginPath();
    ctx.moveTo(centerX - 80, topY - 5);
    ctx.lineTo(centerX + 80, topY - 5);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Draw spring attachment point
    ctx.beginPath();
    ctx.arc(centerX, topY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
    
    // Calculate mass position
    const massY = topY + currentLength;
    
    // Draw spring (zigzag)
    const springWidth = 30;
    const segments = 16;
    const segmentHeight = currentLength / segments;
    
    ctx.beginPath();
    ctx.moveTo(centerX, topY);
    
    for (let i = 0; i < segments; i++) {
      const y = topY + i * segmentHeight;
      const x = centerX + (i % 2 === 0 ? springWidth : -springWidth);
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(centerX, massY);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw mass (circle)
    ctx.beginPath();
    ctx.arc(centerX, massY, massRadius, 0, 2 * Math.PI);
    
    // Color based on mass
    const intensity = Math.min(mass / 2, 1);
    ctx.fillStyle = `rgb(${180 - 50 * intensity}, ${20 + 50 * intensity}, ${50 + 150 * intensity})`;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add mass label
    ctx.font = '14px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${mass.toFixed(1)} kg`, centerX, massY);
    
    // Draw displacement indicator
    ctx.beginPath();
    ctx.moveTo(centerX + 60, topY + restLength);
    ctx.lineTo(centerX + 100, topY + restLength);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Current position line
    ctx.beginPath();
    ctx.moveTo(centerX + 60, massY);
    ctx.lineTo(centerX + 100, massY);
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Vertical line connecting them
    ctx.beginPath();
    ctx.moveTo(centerX + 80, topY + restLength);
    ctx.lineTo(centerX + 80, massY);
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Add displacement text
    ctx.font = '12px Arial';
    ctx.fillStyle = '#00f';
    ctx.textAlign = 'left';
    ctx.fillText(`${Math.abs(currentDisplacement).toFixed(2)} m`, centerX + 90, (topY + restLength + massY) / 2);
    
    // Check for completed oscillation (when displacement changes sign)
    const currentDisplacementSign = Math.sign(currentDisplacement);
    if (
      lastDisplacementSignRef.current !== null && 
      currentDisplacementSign !== lastDisplacementSignRef.current && 
      currentDisplacementSign === 1
    ) {
      onCompletedOscillation();
    }
    lastDisplacementSignRef.current = currentDisplacementSign;
  };
  
  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const elapsed = (timestamp - startTimeRef.current) / 1000; // in seconds
    
    // Calculate current displacement using simple harmonic motion formula
    const period = calculatePeriod();
    const amplitude = initialDisplacement;
    const currentDisplacement = amplitude * Math.cos(2 * Math.PI * elapsed / period);
    
    drawSpring(ctx, canvas, currentDisplacement);
    
    if (isOscillating) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Reset to starting position when stopped
      drawSpring(ctx, canvas, initialDisplacement);
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 400;
    
    // Initial drawing
    drawSpring(ctx, canvas, initialDisplacement);
    
    if (isOscillating) {
      startTimeRef.current = 0;
      lastDisplacementSignRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [isOscillating, springConstant, mass, initialDisplacement]);
  
  return (
    <div className="physics-equipment">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default SpringEquipment;