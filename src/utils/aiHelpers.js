// AI helper functions for generating responses and tips

/**
 * Basic keyword-based AI response generator for experiment questions
 * @param {String} experimentId - ID of the current experiment
 * @param {String} question - User's question
 * @returns {String} - AI response
 */
export const generateAIResponse = (experimentId, question) => {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Common responses for any experiment
    if (normalizedQuestion.includes('how do i start')) {
      return "To start the experiment, adjust any settings you'd like to change, then click the 'Start Experiment' button.";
    }
    
    if (normalizedQuestion.includes('how to reset')) {
      return "You can reset the experiment by clicking the 'Reset Experiment' button after you've completed or stopped the current run.";
    }
    
    // Experiment-specific responses
    if (experimentId === 'titration') {
      if (normalizedQuestion.includes('endpoint') || normalizedQuestion.includes('color change')) {
        return "The endpoint of a titration is when the reaction is complete. For acid-base titrations with phenolphthalein indicator, this is marked by a color change from colorless to light pink. In this simulation, you should stop the titration immediately when you see a pink color appear in the flask.";
      }
      
      if (normalizedQuestion.includes('indicator') || normalizedQuestion.includes('phenolphthalein')) {
        return "Phenolphthalein is an indicator used in acid-base titrations. It's colorless in acidic solutions and turns pink in basic solutions. This color change happens at a pH of approximately 8.2, which is close to the endpoint of titrations involving strong acids and strong bases.";
      }
      
      if (normalizedQuestion.includes('calculation') || normalizedQuestion.includes('formula')) {
        return "For a titration, we use the formula c₁v₁ = c₂v₂, where c is concentration and v is volume. With this, you can calculate the unknown concentration of a solution if you know the concentration of the other solution and the volumes at the endpoint.";
      }
    }
    
    if (experimentId === 'pendulum') {
      if (normalizedQuestion.includes('period') || normalizedQuestion.includes('time')) {
        return "The period of a pendulum is the time it takes to complete one full swing (back and forth). The theoretical period is calculated using the formula T = 2π√(L/g), where L is the length of the pendulum and g is the acceleration due to gravity (9.8 m/s²).";
      }
      
      if (normalizedQuestion.includes('length') || normalizedQuestion.includes('longer')) {
        return "The length of a pendulum directly affects its period. According to the formula T = 2π√(L/g), increasing the length increases the period, meaning the pendulum swings more slowly. Try adjusting the length slider and observe how it affects the swing speed.";
      }
      
      if (normalizedQuestion.includes('gravity') || normalizedQuestion.includes('force')) {
        return "Gravity provides the restoring force for a pendulum. On Earth, we use 9.8 m/s² as the acceleration due to gravity. On the Moon, gravity is about 1/6 that of Earth, which would result in pendulums swinging more slowly.";
      }
    }
    
    // Default response if no specific answer is found
    return `I'm here to help with your ${experimentId} experiment! If you have questions about the procedure, concepts, or calculations, please be specific and I'll try to assist you.`;
  };
  
  /**
   * Generate an appropriate hint based on experiment state
   * @param {String} experimentId - ID of the current experiment
   * @param {Object} experimentState - Current state of the experiment
   * @returns {String} - Contextual hint
   */
  export const generateContextualHint = (experimentId, experimentState) => {
    if (experimentId === 'titration') {
      if (experimentState.status === 'setup') {
        return "Tip: In real titrations, you'd first rinse the burette with the solution it will contain, then fill it to the 0 mL mark. Here, you can just click Start when ready.";
      }
      
      if (experimentState.status === 'running') {
        return "Tip: Watch the flask carefully for the first sign of color change. In a real lab, you might add the titrant drop by drop near the expected endpoint.";
      }
      
      if (experimentState.status === 'completed') {
        return "Tip: In a real titration, you'd repeat the experiment 2-3 times and take the average for more accurate results.";
      }
    }
    
    if (experimentId === 'pendulum') {
      if (experimentState.status === 'setup') {
        return "Tip: Try adjusting the pendulum length and observe how it affects the theoretical period calculation before starting.";
      }
      
      if (experimentState.status === 'running') {
        return "Tip: Count the number of complete oscillations and divide the total time by that number to get the period. The simulation is automatically doing this for you.";
      }
      
      if (experimentState.status === 'completed') {
        return "Tip: Compare your measured period with the theoretical period. The small difference is due to the simplifications in the pendulum model.";
      }
    }
    
    return "Tip: Careful observation is key to successful experiments. Take your time and pay attention to details.";
  };