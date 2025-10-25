// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sensor, setSensor] = useState({ moisture: 65, temp: 24 });
  const [advice, setAdvice] = useState('');
  const [history, setHistory] = useState([]);

  // Fake sensor update every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      const newMoisture = Math.round(20 + Math.random() * 60);
      const newTemp = Math.round(18 + Math.random() * 15);
      setSensor({ moisture: newMoisture, temp: newTemp });

      // Save to history (max 7 days = 7 entries)
      setHistory(prev => {
        const newEntry = { date: new Date().toLocaleString(), ...{ moisture: newMoisture, temp: newTemp } };
        return [newEntry, ...prev.slice(0, 6)];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get AI advice
  useEffect(() => {
    fetch(`http://localhost:5000/advice?moisture=${sensor.moisture}&temp=${sensor.temp}`)
      .then(r => r.json())
      .then(data => setAdvice(data.advice));
  }, [sensor]);

  return (
    <div className="App">
      <header>
        <h1>AgroSmart</h1>
        <p>Free Plan Active</p>
      </header>

      <div className="sensor">
        <h2>Sensor 1</h2>
        <p>Moisture: <strong>{sensor.moisture}%</strong></p>
        <p>Temperature: <strong>{sensor.temp}°C</strong></p>
        <div className="bar" style={{ width: `${sensor.moisture}%` }}></div>
      </div>

      <div className="advice">
        <h3>AI Advice</h3>
        <p>{advice || 'Analyzing...'}</p>
      </div>

      <div className="history">
        <h3>7-Day History</h3>
        {history.length === 0 ? <p>No data yet</p> : (
          <ul>
            {history.map((h, i) => (
              <li key={i}>{h.date} → {h.moisture}% | {h.temp}°C</li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => alert('Upgrade to Premium for 10 sensors + 90 days!')}>
        Upgrade to Premium
      </button>
    </div>
  );
}

export default App;