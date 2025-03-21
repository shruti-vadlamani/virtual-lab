// Helper functions for experiment calculations and data processing

/**
 * Calculates the endpoint volume for a titration experiment based on concentrations and volumes
 * @param {Number} acidConcentration - concentration of acid (mol/L)
 * @param {Number} acidVolume - volume of acid (mL)
 * @param {Number} baseConcentration - concentration of base (mol/L)
 * @returns {Number} - expected endpoint volume in mL
 */
export const calculateTitrationEndpoint = (acidConcentration, acidVolume, baseConcentration) => {
    // Using the formula: c₁v₁ = c₂v₂
    return (acidConcentration * acidVolume) / baseConcentration;
  };
  
  /**
   * Calculates the theoretical period of a pendulum
   * @param {Number} length - pendulum length in meters
   * @param {Number} gravity - gravitational acceleration in m/s²
   * @returns {Number} - period in seconds
   */
  export const calculatePendulumPeriod = (length, gravity = 9.8) => {
    return 2 * Math.PI * Math.sqrt(length / gravity);
  };
  
  /**
   * Calculates accuracy percentage between measured and theoretical values
   * @param {Number} measured - measured value
   * @param {Number} theoretical - theoretical value
   * @returns {Number} - accuracy percentage
   */
  export const calculateAccuracy = (measured, theoretical) => {
    return 100 - Math.abs((measured - theoretical) / theoretical * 100);
  };
  
  /**
   * Formats a measurement with appropriate units
   * @param {Number} value - the value to format
   * @param {String} unit - the unit symbol
   * @param {Number} precision - number of decimal places
   * @returns {String} - formatted measurement
   */
  export const formatMeasurement = (value, unit, precision = 2) => {
    return `${value.toFixed(precision)} ${unit}`;
  };