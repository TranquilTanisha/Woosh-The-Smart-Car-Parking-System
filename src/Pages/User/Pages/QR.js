import { doc, getDoc, updateDoc } from "firebase/firestore";
import QrScanner from 'qr-scanner';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../App.css';
import Bottombar from '../../../Components/Navbar/Bottombar';
import Navbar from '../../../Components/Navbar/Navbar';
import { auth, db } from '../../../Firebase.js';

QrScanner.WORKER_PATH = './worker.js';

const ReadQR = () => {
  // eslint-disable-next-line
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [data, setData] = useState(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraErrorMessage, setCameraErrorMessage] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const handleCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraPermissionGranted(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraPermissionGranted(false);
        setCameraErrorMessage('Error accessing camera.');
      }
    };

    handleCameraPermission();
  }, []);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
      const videoElement = document.getElementById('qrScanner');
      if (videoElement) {
        videoElement.remove();
      }
    };
  }, []);

  const handleCameraScan = async () => {
    if (!cameraPermissionGranted) {
      alert('Please grant camera permission before scanning.');
      return;
    }

    if (scanning) {
      return;
    }

    try {
      let constraints = { video: { facingMode: 'environment' } };
      const devices = await navigator.mediaDevices.enumerateDevices();
      const rearCamera = devices.find(device => device.kind === 'videoinput' && device.label.toLowerCase().includes('back'));

      if (!rearCamera) {
        constraints = { video: { facingMode: 'user' } };
      }

      setScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.setAttribute('playsinline', 'true');
      videoElement.setAttribute('id', 'qrScanner');
      document.body.appendChild(videoElement);

      scannerRef.current = new QrScanner(videoElement, (result) => {
        if (result) {
          setData(result);
          const user = auth.currentUser;
          const uid = user.uid;
          const docRef = doc(db, "users", uid);

          getDoc(docRef).then(docSnap => {
            if (docSnap.exists()) {
              console.log(docSnap.data());
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const hours = String(currentDate.getHours()).padStart(2, '0');
                const minutes = String(currentDate.getMinutes()).padStart(2, '0');
                const seconds = String(currentDate.getSeconds()).padStart(2, '0');
                const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                if (docSnap.data().entryTime && !docSnap.data().exitTime) {
                    updateDoc(docRef, {
                        exitTime: formattedDateTime

                    });
                } else {
                    updateDoc(docRef, {
                        entryTime: formattedDateTime,
                        exitTime: ""
                    });
                }
            } else {
                console.log("No such document!");
            }
        });
        
          scannerRef.current.stop();
          videoElement.remove();
          setScanning(false);
        }
      });

      scannerRef.current.start();
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraErrorMessage('Error accessing camera.');
      setScanning(false);
    }
  };

  const value = "QR";

  return (
    <>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="container">
        <h2 className="text-center mb-4">Scan QR Code</h2>
        <div className="card border-0">
          <div className="card-body d-flex flex-column align-items-center justify-content-center">
            {cameraErrorMessage && <p className="error-message">{cameraErrorMessage}</p>}
            <button
              type="button"
              className="btn btn-primary mx-2 scan-button"
              onClick={handleCameraScan}
              disabled={!cameraPermissionGranted || scanning}
            >
              {scanning ? 'Scanning...' : 'Scan QR Code'}
            </button>
          </div>
        </div>
        <div className="bottombar">
          <Bottombar value={value}/>
        </div>
      </div>
    </>
  );
};

export default ReadQR;









// import React, { useState, useEffect } from 'react';
// import Navbar from '../../../Components/Navbar/Navbar';
// import Bottombar from '../../../Components/Navbar/Bottombar';
// import QrScanner from 'react-qr-scanner';
// import '../../../App.css';

// function QR() {
//   const [qrResult, setQrResult] = useState(null);
//   const [permissionGranted, setPermissionGranted] = useState(false);
//   const [cameraErrorMessage, setCameraErrorMessage] = useState('');

//   const requestCameraPermission = async () => {
//     try {
//       const devices = await navigator.mediaDevices.enumerateDevices();
//       const rearCamera = devices.find(device => device.kind === 'videoinput' && device.label.includes('back'));
      
//       if (rearCamera) {
//         await navigator.mediaDevices.getUserMedia({ video: { deviceId: rearCamera.deviceId } });
//         setPermissionGranted(true);
//       } else {
//         setCameraErrorMessage('Rear camera not found.');
//       }
//     } catch (error) {
//       setCameraErrorMessage('Error accessing camera.');
//     }
//   };

//   useEffect(() => {
//     requestCameraPermission();
//   }, []);

//   const handleScan = data => {
//     if (data) {
//       setQrResult(data);
//       if (isValidURL(data.text)) {
//         window.open(data.text, '_blank');
//       }
//       setPermissionGranted(false);
//     }
//   };

//   const isValidURL = (url) => {
//     try {
//       new URL(url);
//       return true;
//     } catch (error) {
//       return false;
//     }
//   };

//   const handleError = err => {
//     console.error(err);
//   };

//   const handleRequestPermissionAgain = () => {
//     setPermissionGranted(false);
//     setCameraErrorMessage('');
//     requestCameraPermission();
//   };

//   const value = "QR";

//   return (
//     <div>
//       <div className="navbar">
//         <Navbar />
//       </div>
//       <div style={{ textAlign: 'center', position: 'relative', height: '100vh' }}>
//         <h1>QR test</h1>
//         {permissionGranted && (
//           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '300px' }}>
//             <div className="scanner-animation">
//               <QrScanner
//                 onScan={handleScan}
//                 onError={handleError}
//                 style={{ width: '100%' }}
//                 constraints={{facingMode: 'environment'}}
//               />
//             </div>
//           </div>
//         )}
//         {qrResult && <p>Scanned QR Code Content: {qrResult.text}</p>}
//         {cameraErrorMessage && <p>{cameraErrorMessage}</p>}
//         {!permissionGranted && !qrResult && (
//           <button onClick={handleRequestPermissionAgain} className="camera-permission-button">
//             Request Camera Permission
//           </button>
//         )}
//       </div>
//       <div className="bottombar">
//         <Bottombar value={value}/>
//       </div>
//     </div>
//   )
// }

// export default QR;
