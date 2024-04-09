import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Bottombar from '../../Components/Navbar/Bottombar';
import { db } from '../../Firebase';
import icon1 from '../../Images/parking_icon.png';

const Location = () => {
    const [parkinglotLocations, setParkinglotLocations] = useState([]);
    const [initialPosition, setInitialPosition] = useState(null);
    const [setMapLoaded] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    // eslint-disable-next-line
    const [selectedOrg, setSelectedOrg] = useState(null);
    // eslint-disable-next-line
    const [nearbyParkingSpots, setNearbyParkingSpots] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const organizationsRef = collection(db, 'organization');
                const snapshot = await getDocs(organizationsRef);
                const locations = [];

                snapshot.forEach(doc => {
                    const data = doc.data();
                    const [latitude, longitude] = data.location.split(',');
                    if (!isNaN(latitude) && !isNaN(longitude)) {
                        locations.push({ id: doc.id, latitude, longitude, name: data.org_name });
                    }
                });

                setParkinglotLocations(locations);
                setFetchError(null);
                console.log('Parking lot locations:', locations);

                onSnapshot(organizationsRef, (snapshot) => {
                    const updatedLocations = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const [latitude, longitude] = data.location.split(',');
                        if (!isNaN(latitude) && !isNaN(longitude)) {
                            updatedLocations.push({ id: doc.id, latitude, longitude, name: data.org_name });
                        }
                    });
                    setParkinglotLocations(updatedLocations);
                });

            } catch (error) {
                console.error('Error fetching organizations:', error);
                setFetchError('Error fetching data. Please try again later.');
            }
        };

        fetchData();
        getGeoLocation();
    }, []);

    useEffect(() => {
        if (initialPosition && parkinglotLocations.length > 0) {
            filterVisibleLocations();
        }
    // eslint-disable-next-line
    }, [initialPosition, parkinglotLocations]);

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

    const blueIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const customIcon = new L.Icon({
        iconUrl: icon1,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const filterVisibleLocations = () => {
        if (!initialPosition) return;

        const nearbySpots = [];
        parkinglotLocations.forEach(location => {
            const distance = getDistance(initialPosition[0], initialPosition[1], location.latitude, location.longitude);
            if (distance <= 5000) {
                nearbySpots.push({ id: location.id, name: location.name, distance: distance });
            }
        });
        setNearbyParkingSpots(nearbySpots);

        const nearSpot = nearbySpots.find(spot => spot.distance <= 1000);
        if (nearSpot) {
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
            }
            alert(`Parking spot available nearby: ${nearSpot.name}. Distance: ${(nearSpot.distance / 1000).toFixed(2)} km`);
        }
    };

    const handleMarkerClick = (location) => {
        setSelectedOrg(location.name);
    };

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d * 1000;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    // eslint-disable-next-line
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredLocations = parkinglotLocations.filter(location => {
        return location.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <div className="search-bar" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <input type="text" className="search-input" placeholder="Search..." />

            </div>
            <div style={{ height: '60%', width: '100%' }}>
                {fetchError && <p>{fetchError}</p>}
                {initialPosition && (
                    <MapContainer
                        center={initialPosition}
                        zoom={13}
                        style={{ height: '80vh', width: '100%' }}
                        whenCreated={handleMapLoad}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {initialPosition && (
                            <Marker position={initialPosition} icon={blueIcon}>
                                <Popup>You are here</Popup>
                            </Marker>
                        )}
                        {filteredLocations.map((location, index) => (
                            <Marker
                                key={index}
                                position={[location.latitude, location.longitude]}
                                title={location.name}
                                icon={customIcon}
                                eventHandlers={{
                                    click: () => {
                                        handleMarkerClick(location);
                                    }
                                }}
                            >
                                <Popup>{location.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
            <div className="bottombar">
                <Bottombar />
            </div>
        </>
    );
};

export default Location;
