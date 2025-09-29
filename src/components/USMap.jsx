import React, { useState } from 'react'; // <-- Import useState
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const USMap = ({ stateData }) => {
  // --- New state for our custom tooltip ---
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const maxPledges = Math.max(...stateData.map(d => d.count), 0);
  const colorScale = scaleQuantize()
    .domain([0, maxPledges > 0 ? maxPledges : 1])
    .range(["#aeb8d3", "#8e9dc1", "#6d82af", "#4d679d", "#2c4c8b", "#0b3179"]);

  // --- New event handlers for mouse events ---
  const handleMouseEnter = (geo, pledgeCount) => {
    setTooltipContent(`${geo.properties.name}: ${pledgeCount.toLocaleString()} Pledges`);
  };

  const handleMouseLeave = () => {
    setTooltipContent('');
  };

  const handleMouseMove = (event) => {
    // Position the tooltip slightly offset from the cursor
    setTooltipPosition({ x: event.clientX + 15, y: event.clientY + 15 });
  };

  return (
    <div style={{ position: 'relative' }}>
      <ComposableMap projection="geoAlbersUsa" onMouseMove={handleMouseMove}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const curState = stateData.find(s => s.state === geo.properties.name);
              const pledgeCount = curState ? curState.count : 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(pledgeCount)}
                  stroke="#1e2a4a"
                  // --- Add the new mouse event handlers ---
                  onMouseEnter={() => handleMouseEnter(geo, pledgeCount)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "rgba(255, 215, 0, 0.5)" },
                      pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* --- Conditionally render our custom tooltip --- */}
      {tooltipContent && (
        <div 
          className="map-tooltip"
          style={{
            position: 'fixed',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default USMap;