import { useState, useEffect } from 'react';
import './App.css';
import PledgeForm from './components/PledgeForm';
import USMap from './components/USMap';
import GoalThermometer from './components/GoalThermometer';
import CountdownTimer from './components/CountdownTimer';
import SharePledge from './components/SharePledge';

const API_URL = 'https://pledge-to-vote-2026-backend.onrender.com/api';

const determineCurrentGoal = (pledges) => {
  if (pledges < 500) return 500;
  if (pledges < 5000) return 5000;
  if (pledges < 50000) return 50000;
  return 1000000;
};

function App() {
  const [totalPledges, setTotalPledges] = useState(0);
  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  const currentGoal = determineCurrentGoal(totalPledges);

  // THIS IS THE HOOK THAT WAS MISSING. It runs once on load to get the latest data.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [countResponse, stateResponse] = await Promise.all([
          fetch(`${API_URL}/pledges/count`),
          fetch(`${API_URL}/pledges/by-state`)
        ]);
        const countData = await countResponse.json();
        const statePledges = await stateResponse.json();
        setTotalPledges(countData.totalPledges);
        setStateData(statePledges);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const postResponse = await fetch(`${API_URL}/pledges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: selectedState, zipCode }),
      });
      if (!postResponse.ok) throw new Error('Pledge submission failed');
      const postData = await postResponse.json();
      
      const stateResponse = await fetch(`${API_URL}/pledges/by-state`);
      const statePledges = await stateResponse.json();
      
      setTotalPledges(postData.totalPledges);
      setStateData(statePledges);
      setPledgeSuccess(true);
      
      setSelectedState('');
      setZipCode('');
    } catch (error) {
      console.error("Error submitting pledge:", error);
      alert("Sorry, there was an error submitting your pledge. Please try again.");
    }
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Take the Pledge to Vote in the 2026 Midterms</h1>
        <p>Make your voice heard! Join thousands of others by pledging to vote in the 2026 Midterm Elections!</p>
        <CountdownTimer />
      </header>

      <GoalThermometer currentPledges={totalPledges} currentGoal={currentGoal} />
      
      <main className="main-content">
        <section className="pledge-section">
          <h2>Total Pledges: {totalPledges.toLocaleString()}</h2>
          {pledgeSuccess ? (
            <SharePledge />
          ) : (
            <PledgeForm 
              selectedState={selectedState}
              onStateChange={(e) => setSelectedState(e.target.value)}
              zipCode={zipCode}
              onZipChange={(e) => setZipCode(e.target.value)}
              handleSubmit={handleSubmit}
            />
          )}
        </section>
        
        <section className="map-section">
          <h2>Pledges by Location</h2>
          <USMap stateData={stateData} />
        </section>
      </main>
    </div>
  );
}

export default App;