import React, { useState, useEffect } from 'react';

// NEW: A more structured list of states with names and abbreviations
const states = [
  { name: 'Alabama', abbr: 'AL' }, { name: 'Alaska', abbr: 'AK' },
  { name: 'Arizona', abbr: 'AZ' }, { name: 'Arkansas', abbr: 'AR' },
  { name: 'California', abbr: 'CA' }, { name: 'Colorado', abbr: 'CO' },
  { name: 'Connecticut', abbr: 'CT' }, { name: 'Delaware', abbr: 'DE' },
  { name: 'District of Columbia', abbr: 'DC' }, { name: 'Florida', abbr: 'FL' },
  { name: 'Georgia', abbr: 'GA' }, { name: 'Hawaii', abbr: 'HI' },
  { name: 'Idaho', abbr: 'ID' }, { name: 'Illinois', abbr: 'IL' },
  { name: 'Indiana', abbr: 'IN' }, { name: 'Iowa', abbr: 'IA' },
  { name: 'Kansas', abbr: 'KS' }, { name: 'Kentucky', abbr: 'KY' },
  { name: 'Louisiana', abbr: 'LA' }, { name: 'Maine', abbr: 'ME' },
  { name: 'Maryland', abbr: 'MD' }, { name: 'Massachusetts', abbr: 'MA' },
  { name: 'Michigan', abbr: 'MI' }, { name: 'Minnesota', abbr: 'MN' },
  { name: 'Mississippi', abbr: 'MS' }, { name: 'Missouri', abbr: 'MO' },
  { name: 'Montana', abbr: 'MT' }, { name: 'Nebraska', abbr: 'NE' },
  { name: 'Nevada', abbr: 'NV' }, { name: 'New Hampshire', abbr: 'NH' },
  { name: 'New Jersey', abbr: 'NJ' }, { name: 'New Mexico', abbr: 'NM' },
  { name: 'New York', abbr: 'NY' }, { name: 'North Carolina', abbr: 'NC' },
  { name: 'North Dakota', abbr: 'ND' }, { name: 'Ohio', abbr: 'OH' },
  { name: 'Oklahoma', abbr: 'OK' }, { name: 'Oregon', abbr: 'OR' },
  { name: 'Pennsylvania', abbr: 'PA' }, { name: 'Rhode Island', abbr: 'RI' },
  { name: 'South Carolina', abbr: 'SC' }, { name: 'South Dakota', abbr: 'SD' },
  { name: 'Tennessee', abbr: 'TN' }, { name: 'Texas', abbr: 'TX' },
  { name: 'Utah', abbr: 'UT' }, { name: 'Vermont', abbr: 'VT' },
  { name: 'Virginia', abbr: 'VA' }, { name: 'Washington', abbr: 'WA' },
  { name: 'West Virginia', abbr: 'WV' }, { name: 'Wisconsin', abbr: 'WI' },
  { name: 'Wyoming', abbr: 'WY' }
];


const PledgeForm = ({ selectedState, onStateChange, zipCode, onZipChange, handleSubmit }) => {
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (zipCode.length === 5 && selectedState) {
      const validateZip = async () => {
        try {
          // Find the full name of the state from our new list based on the abbreviation
          const selectedStateFullName = states.find(s => s.abbr === selectedState)?.name;
          if (!selectedStateFullName) {
            setValidationError(''); // No state selected to validate against
            return;
          }

          const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
          if (!response.ok) {
            setValidationError('Invalid Zip Code.');
            return;
          }
          const data = await response.json();
          const apiState = data.places[0]['state'];

          // Compare the API state with the full name we found
          if (apiState !== selectedStateFullName) {
            setValidationError('State and Zip Code do not match!');
          } else {
            setValidationError('');
          }
        } catch (error) {
          console.error("Zip code validation error:", error);
          setValidationError('Could not validate Zip Code.');
        }
      };
      
      const timerId = setTimeout(() => validateZip(), 500);
      return () => clearTimeout(timerId);
    } else {
      setValidationError('');
    }
  }, [zipCode, selectedState]);


  return (
    <form onSubmit={handleSubmit} className="pledge-form">
      <div className="form-group">
        <label htmlFor="state-select">Select Your State</label>
        {/* The `value` is now the abbreviation (e.g., "IL") */}
        <select id="state-select" value={selectedState} onChange={onStateChange} required>
          <option value="" disabled>-- Please choose an option --</option>
          {/* UPDATED: We map over the new `states` array */}
          {states.map(state => (
            <option key={state.abbr} value={state.abbr}>
              {state.name}
            </option>
          ))}
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
        {validationError && <p className="validation-error">{validationError}</p>}
      </div>
      <button 
        type="submit" 
        className="pledge-button" 
        disabled={!!validationError || !selectedState || zipCode.length !== 5}
      >
        Make the Pledge!
      </button>
    </form>
  );
};

export default PledgeForm;