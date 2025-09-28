import React, { useState, useEffect } from 'react';

const PledgeForm = ({ selectedState, onStateChange, zipCode, onZipChange, handleSubmit }) => {
  // New state to hold our validation error message
  const [validationError, setValidationError] = useState('');
  const statesAndTerritories = [
    "Alabama", "Alaska", "American Samoa", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia", "Guam", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Northern Mariana Islands", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "U.S. Virgin Islands", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  // This effect will run whenever the user changes the zip code or state
  useEffect(() => {
    // We only want to validate when we have a full 5-digit zip code and a selected state
    if (zipCode.length === 5 && selectedState) {
      const validateZip = async () => {
        try {
          const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
          if (!response.ok) { // The API returns an error for invalid zip codes
            setValidationError('Invalid Zip Code.');
            return;
          }
          const data = await response.json();
          const apiState = data.places[0]['state'];

          // Compare the state from the API with the state selected in the dropdown
          if (apiState !== selectedState) {
            setValidationError('State and Zip Code do not match!');
          } else {
            setValidationError(''); // If they match, clear the error
          }
        } catch (error) {
          console.error("Zip code validation error:", error);
          setValidationError('Could not validate Zip Code.');
        }
      };
      
      // Use a timer to prevent calling the API on every single keystroke
      const timerId = setTimeout(() => {
        validateZip();
      }, 500); // Wait 500ms after the user stops typing

      return () => clearTimeout(timerId); // Clean up the timer
    } else {
      setValidationError(''); // Clear any errors if the zip isn't 5 digits long
    }
  }, [zipCode, selectedState]);


  return (
    <form onSubmit={handleSubmit} className="pledge-form">
      <div className="form-group">
        <label htmlFor="state-select">Select Your State / Territory</label>
        <select id="state-select" value={selectedState} onChange={onStateChange} required>
          <option value="" disabled>-- Please choose an option --</option>
          {statesAndTerritories.map(name => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="zip-input">Enter Your Zip Code</label>
        <input 
          id="zip-input"
          type="text" 
          value={zipCode} 
          onChange={onZipChange}
          placeholder="e.g., 62249"
          pattern="[0-9]{5}"
          title="Please enter a 5-digit zip code."
          required 
        />
        {/* If a validation error exists, display it here */}
        {validationError && <p className="validation-error">{validationError}</p>}
      </div>
      <button 
        type="submit" 
        className="pledge-button" 
        disabled={!!validationError || !selectedState || zipCode.length !== 5} // Disable button if there's an error or form is incomplete
      >
        Make the Pledge!
      </button>
    </form>
  );
};

export default PledgeForm;