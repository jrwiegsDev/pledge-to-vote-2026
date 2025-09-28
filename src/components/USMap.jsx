import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';

// A URL to a GeoJSON file containing the US states map data
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const USMap = ({ stateData }) => {
  // Find the highest pledge count to set our color scale's maximum
  const maxPledges = Math.max(...stateData.map(d => d.count), 0);

  // This function will determine the color of a state based on its pledge count
  const colorScale = scaleQuantize()
    .domain([0, maxPledges > 0 ? maxPledges : 1]) // Domain goes from 0 to the max count
    .range([
      "#aeb8d3", // Lightest shade (low pledges)
      "#8e9dc1",
      "#6d82af",
      "#4d679d",
      "#2c4c8b",
      "#0b3179"  // Darkest shade (high pledges)
    ]);

  return (
    <ComposableMap projection="geoAlbersUsa">
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => {
            const curState = stateData.find(s => s.state === geo.properties.name);
            const pledgeCount = curState ? curState.count : 0;
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={colorScale(pledgeCount)} // The state's color is set here
                stroke="#1e2a4a" // The border color between states
                style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#bf0a30" }, // Red hover effect
                    pressed: { outline: "none" },
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
};

export default USMap;