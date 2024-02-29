import React, { useState, useEffect } from 'react';
import Bottombar from '../../Components/Navbar/Bottombar';
import Navbar from '../../Components/Navbar/Navbar';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '@mui/material/Button';
import L from 'leaflet';

const Location = () => {
    const [parkinglotLocations, setParkinglotLocations] = useState([]); 
    const [initialPosition, setInitialPosition] = useState(null);
    const [setMapLoaded] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [visibleLocations, setVisibleLocations] = useState([]);

    useEffect(() => {
        fetchData();
        getGeoLocation();
    }, []);

    useEffect(() => {
        if (initialPosition && parkinglotLocations.length > 0) {
            filterVisibleLocations();
        }
    // eslint-disable-next-line
    }, [initialPosition, parkinglotLocations]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'https://docs.google.com/spreadsheets/d/1ZlwPVJ5R5UJ09vP8XaizBG0nyqXEt4L_ww2gdvyVGh8/gviz/tq?tqx=out:json&sheet=Sheet1'
            );

            const data = JSON.parse(response.data.substr(47).slice(0, -2));

            const locations = data.table.rows.map((row) => {
                const locationUrl = row.c[1]?.v;
                const name = row.c[2]?.v;

                if (locationUrl) {
                    const matches = locationUrl.match(/[-+]?([0-9]*\.[0-9]+|[0-9]+)/g);

                    if (matches && matches.length >= 2) {
                        const latitude = parseFloat(matches[0]);
                        const longitude = parseFloat(matches[1]);
                        const range = parseFloat(matches[2]);

                        // Check if latitude and longitude are valid numbers
                        if (!isNaN(latitude) && !isNaN(longitude)) {
                            return { latitude, longitude, range, name };
                        }
                    }
                }

                return null;
            }).filter((location) => location !== null);

            setParkinglotLocations(locations);
            setFetchError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setFetchError('Error fetching data. Please try again later.');
        }
    };

    const getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setInitialPosition([latitude, longitude]);
                },
                (error) => {
                    console.error(error);
                    alert('Please allow location access to use this feature.');
                },
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleMapLoad = () => {
        setMapLoaded(true);
    };

    const openGoogleForm = () => {
        if (initialPosition) {
            const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf8UgZlEYexiycrfeaQUhIOBf_QYosdXdaJVwLLpcibCDmK0g/viewform?usp=sf_link';
            const latitude = initialPosition[0];
            const longitude = initialPosition[1];
            const urlWithLocation = `${googleFormUrl}&entry.260777333=${encodeURIComponent(`https://www.google.com/maps/place/${latitude},${longitude}`)}`;
            window.open(urlWithLocation, '_blank');
        } else {
            console.log('Location is not available');
        }
    };

    const blueIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const filterVisibleLocations = () => {
        const visible = parkinglotLocations.filter(location => {
            const distance = getDistance(initialPosition[0], initialPosition[1], location.latitude, location.longitude);
            return distance <= 5000; // You can change the threshold (in meters) here
        });
        setVisibleLocations(visible);
    };

    //Haversine formula
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d * 1000;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    return (
        <><div className="navbar">
            <Navbar />
        </div>
        <div style={{ height: '100%', width: '100%' }}>
                {fetchError && <p>{fetchError}</p>}
                {initialPosition && (
                    <MapContainer
                        center={initialPosition}
                        zoom={13}
                        style={{ height: '80vh', width: '100%' }}
                        whenCreated={handleMapLoad}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={initialPosition} icon={blueIcon} />
                        {visibleLocations.map((location, index) => (
                            <CircleMarker
                                key={index}
                                center={[location.latitude, location.longitude]}
                                pathOptions={{ color: 'red' }}
                                radius={location.range || 20}
                            >
                            </CircleMarker>
                        ))}
                    </MapContainer>
                )}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#b81c21' }}
                    onClick={openGoogleForm}
                    style={{ marginTop: '10px' }}>
                    Edit Location
                (only for admins)
                </Button>
                </div>
            </div>
            <div className="bottombar">
        <Bottombar/>
      </div></>
    );
};

export default Location;
