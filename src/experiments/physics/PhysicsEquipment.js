import React, { useEffect, useRef } from 'react';

function PhysicsEquipment({ length, angle, isSwinging, onCompletedSwing, gravity }) {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const startTimeRef = useRef(0);
  const swingDirectionRef = useRef(1);
  const lastAngleSignRef = useRef(null);
  
  // Convert pendulum length to pixels (scale factor)
  const lengthToPixels = (l) => l * 150;
  
  // Convert angle to radians
  const toRadians = (degrees) => degrees * Math.PI / 180;
  
  // Calculate period using the formula T = 2π√(L/g)
  const calculatePeriod = () => {
    return 2 * Math.PI * Math.sqrt(length / gravity);
  };
  
  const drawPendulum = (ctx, canvas, currentAngle) => {
    const pivotX = canvas.width / 2;
    const pivotY = 100;
    const bobRadius = 20;
    const pendulumLength = lengthToPixels(length);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw pivot point
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
    
    // Calculate bob position
    const bobX = pivotX + pendulumLength * Math.sin(currentAngle);
    const bobY = pivotY + pendulumLength * Math.cos(currentAngle);
    
    // Draw pendulum string
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw pendulum bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#c00';
    ctx.fill();
    ctx.strokeStyle = '#900';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw support structure
    ctx.beginPath();
    ctx.moveTo(pivotX - 100, pivotY - 5);
    ctx.lineTo(pivotX + 100, pivotY - 5);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Draw vertical support
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY - 5);
    ctx.lineTo(pivotX, pivotY - 50);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Optional: Add angle indicator
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 30, -Math.PI/2, -Math.PI/2 + currentAngle);
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add angle text
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(`${(currentAngle * 180 / Math.PI).toFixed(1)}°`, pivotX + 35, pivotY + 5);
    
    // Check for completed swing (when angle changes sign)
    const currentAngleSign = Math.sign(currentAngle);
    if (
      lastAngleSignRef.current !== null && 
      currentAngleSign !== lastAngleSignRef.current && 
      currentAngleSign === 1
    ) {
      onCompletedSwing();
    }
    lastAngleSignRef.current = currentAngleSign;
  };
  
  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const elapsed = (timestamp - startTimeRef.current) / 1000; // in seconds
    
    // Calculate current angle using simple harmonic motion formula
    const period = calculatePeriod();
    const maxAngle = toRadians(angle);
    const currentAngle = maxAngle * Math.cos(2 * Math.PI * elapsed / period);
    
    drawPendulum(ctx, canvas, currentAngle);
    
    if (isSwinging) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Reset to starting position when stopped
      drawPendulum(ctx, canvas, toRadians(angle));
    }
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 400;
    
    // Initial drawing
    drawPendulum(ctx, canvas, toRadians(angle));
    
    if (isSwinging) {
      startTimeRef.current = 0;
      lastAngleSignRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [isSwinging, length, angle]);
  
  return (
    <div className="physics-equipment">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default PhysicsEquipment;