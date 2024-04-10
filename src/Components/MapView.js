import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function MapView() {
  useEffect(() => {
    // Initialize Leaflet map
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker
    L.marker([51.505, -0.09]).addTo(map)
      .bindPopup('A sample location')
      .openPopup();
  }, []);

  return (
    <div id="map" style={{ height: '100vh' }}></div>
  );
}

export default MapView;
