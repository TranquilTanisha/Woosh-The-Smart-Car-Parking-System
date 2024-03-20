import React, { useState, useEffect, useRef } from 'react';
import QrScanner from 'react-qr-scanner';
import Navbar from '../../../Components/Navbar/Navbar';
import Bottombar from '../../../Components/Navbar/Bottombar';
import '../../../App.css';

function QR() {
  const qrRef = useRef();
  const [qrResult, setQrResult] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [cameraErrorMessage, setCameraErrorMessage] = useState('');
  
  const requestCameraPermission = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const rearCamera = devices.find(device => device.kind === 'videoinput' && device.label.includes('back'));
      
      if (rearCamera) {
        await navigator.mediaDevices.getUserMedia({ video: { deviceId: rearCamera.deviceId } });
        setPermissionGranted(true);
      } else {
        setCameraErrorMessage('Rear camera not found.');
      }
    } catch (error) {
      setCameraErrorMessage('Error accessing camera.');
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

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

  const handleRequestPermissionAgain = () => {
    setPermissionGranted(false);
    setCameraErrorMessage('');
    requestCameraPermission();
  };

  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div style={{ textAlign: 'center', position: 'relative', height: '100vh' }}>
        <h1>QR test</h1>
        {permissionGranted && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '300px' }}>
            <div className="scanner-animation">
              <QrScanner
                ref={qrRef}
                onScan={handleScan}
                onError={handleError}
                style={{ width: '100%' }}
                constraints={{facingMode: 'environment'}}
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
        <Bottombar value="QR"/>
      </div>
    </div>
  );
}

export default QR;








// import { useRef, useState } from 'react';
// import QrScanner from 'qr-scanner';

// // Configure QrScanner
// QrScanner.WORKER_PATH = 'path/to/qr-scanner-worker.min.js';

// const ReadQR = () => {
//   const [file, setFile] = useState(null);
//   const [data, setData] = useState(null);
//   const fileRef = useRef();

//   const handleChange = async (e) => {
//     const file = e.target.files[0];
//     setFile(file);
//     const result = await QrScanner.scanImage(file);
//     setData(result);
//   };

//   const handleCameraScan = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } });
//       const videoElement = document.createElement('video');
//       videoElement.srcObject = stream;
//       videoElement.setAttribute('playsinline', 'true'); // Required for iOS Safari
//       document.body.appendChild(videoElement);
//       const scanner = new QrScanner(videoElement, (result) => {
//         setData(result);
//         scanner.stop();
//         videoElement.remove();
//       });
//       scanner.start();
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//     }
//   };

//   const clearAll = (e) => {
//     e.preventDefault();
//     setData(null);
//     setFile(null);
//   };

//   const handleClick = () => {
//     fileRef.current.click();
//   };

//   return (
//     <div className="col-md-6 mx-auto">
//       <h2 className="text-center mb-4">Scan QR Code</h2>
//       <div className="card border-0">
//         <div className="card-body d-flex flex-column align-items-center justify-content-center">
//           <div className="d-flex align-items-center justify-content-between">
//             <button
//               type="button"
//               style={{ height: '50px' }}
//               className="btn btn-success px-4 mx-2"
//               onClick={handleCameraScan}
//             >
//               Scan QR Code from Rear Camera
//             </button>
//             <button
//               onClick={clearAll}
//               type="button"
//               className="btn btn-outline-danger my-4"
//             >
//               &#x2715;
//             </button>
//           </div>
//           <input
//             type="file"
//             accept=".png, .jpg, .jpeg"
//             className="d-none"
//             onChange={handleChange}
//             ref={fileRef}
//           />
//           <div className="mt-5 pt-4 d-flex flex-column align-items-center justify-content-between">
//             {file && (
//               <img
//                 className="w-75"
//                 src={URL.createObjectURL(file)}
//                 alt="QR Code"
//               />
//             )}
//             {data && (
//               <p className="mt-2">
//                 Data: <br /> {data}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReadQR;






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
