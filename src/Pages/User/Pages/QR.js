import React, { useState, useEffect } from 'react';
import Navbar from '../../../Components/Navbar/Navbar';
import Bottombar from '../../../Components/Navbar/Bottombar';
import QrScanner from 'react-qr-scanner';
import '../../../App.css';

function QR() {
  const [qrResult, setQrResult] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraErrorMessage, setCameraErrorMessage] = useState('');

  const handleScan = data => {
    if (data) {
      setQrResult(data);
      if (isValidURL(data.text)) {
        window.open(data.text, '_blank');
      }
      setPermissionGranted(false);
    }
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleError = err => {
    console.error(err);
  };

  useEffect(() => {
    const requestCameraPermission = () => {
      const isConfirmed = window.confirm("Allow this website to access your camera?");
      if (isConfirmed) {
        navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            const rearCamera = devices.find(device => device.kind === 'videoinput' && device.label.includes('back'));
            const frontCamera = devices.find(device => device.kind === 'videoinput' && device.label.includes('front'));
            const camera = rearCamera || frontCamera;
            if (camera) {
              navigator.mediaDevices.getUserMedia({ video: { deviceId: camera.deviceId } })
                .then(() => setPermissionGranted(true))
                .catch(() => {
                  setCameraErrorMessage('Camera not accessible.');
                });
            } else {
              setCameraErrorMessage('No camera found.');
            }
          })
          .catch(() => {
            setCameraErrorMessage('Error enumerating devices.');
          });
      }
    };
    
    requestCameraPermission();
  }, []);

  const handleRequestPermissionAgain = () => {
    setPermissionGranted(false);
    setCameraErrorMessage('');
    const requestCameraPermission = () => {
      const isConfirmed = window.confirm("Allow this website to access your camera?");
      if (isConfirmed) {
        navigator.mediaDevices.enumerateDevices()
          .then(devices => {
            const rearCamera = devices.find(device => device.kind === 'videoinput' && device.label.includes('back'));
            const frontCamera = devices.find(device => device.kind === 'videoinput' && device.label.includes('front'));
            const camera = rearCamera || frontCamera;
            if (camera) {
              navigator.mediaDevices.getUserMedia({ video: { deviceId: camera.deviceId } })
                .then(() => setPermissionGranted(true))
                .catch(() => {
                  setCameraErrorMessage('Camera not accessible.');
                });
            } else {
              setCameraErrorMessage('No camera found.');
            }
          })
          .catch(() => {
            setCameraErrorMessage('Error enumerating devices.');
          });
      }
    };
    requestCameraPermission();
  };

  const value = "QR";

  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div style={{ textAlign: 'center', position: 'relative', height: '100vh' }}>
        <h1>QR</h1>
        {permissionGranted && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '300px' }}>
            <div className="scanner-animation">
              <QrScanner
                onScan={handleScan}
                onError={handleError}
                style={{ width: '100%' }}
                facingMode='environment'
              />
            </div>
          </div>
        )}
        {qrResult && <p>Scanned QR Code Content: {qrResult.text}</p>}
        {cameraErrorMessage && <p>{cameraErrorMessage}</p>}
        {!permissionGranted && !qrResult && (
          <button onClick={handleRequestPermissionAgain} className="camera-permission-button">
            Request Camera Permission
          </button>
        )}
      </div>
      <div className="bottombar">
        <Bottombar value={value}/>
      </div>
    </div>
  )
}

export default QR;
