import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// NEW: A mapping object to connect full state names to their abbreviations
const stateNameMapping = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH',
  'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC',
  'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA',
  'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN',
  'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
  'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
};

const USMap = ({ stateData }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const maxPledges = Math.max(...stateData.map(d => d.count), 0);
  const colorScale = scaleQuantize()
    .domain([0, maxPledges > 0 ? maxPledges : 1])
    .range(["#aeb8d3", "#8e9dc1", "#6d82af", "#4d679d", "#2c4c8b", "#0b3179"]);

  const handleMouseEnter = (geo, pledgeCount) => {
    setTooltipContent(`${geo.properties.name}: ${pledgeCount.toLocaleString()} Pledges`);
  };

  const handleMouseLeave = () => {
    setTooltipContent('');
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX + 15, y: event.clientY + 15 });
  };

  return (
    <div style={{ position: 'relative' }}>
      <ComposableMap projection="geoAlbersUsa" onMouseMove={handleMouseMove}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              // UPDATED LOGIC:
              // 1. Look up the abbreviation for the current state's full name
              const stateAbbr = stateNameMapping[geo.properties.name];
              // 2. Find the data using the correct abbreviation
              const curState = stateData.find(s => s.state === stateAbbr);
              
              const pledgeCount = curState ? curState.count : 0;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(pledgeCount)}
                  stroke="#1e2a4a"
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