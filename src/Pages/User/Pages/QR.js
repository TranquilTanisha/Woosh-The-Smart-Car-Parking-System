import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import QrScanner from 'qr-scanner';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../App.css';
import Bottombar from '../../../Components/Navbar/Bottombar';
import Navbar from '../../../Components/Navbar/Navbar';
import { auth, db } from '../../../Firebase.js';

QrScanner.WORKER_PATH = './worker.js';

// eslint-disable-next-line
function genAutoID(len) {
  var text = "";

  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}

const ReadQR = () => {
  // eslint-disable-next-line
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [data, setData] = useState(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraErrorMessage, setCameraErrorMessage] = useState('');
  const [scanning, setScanning] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
          const userDocRef = doc(db, "users", uid);
          // Logic to update entry/exit time on user side
          getDoc(userDocRef).then(docSnap => {
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

              setShowSuccessMessage(true);
              setTimeout(() => {
                setShowSuccessMessage(false);
                scannerRef.current.stop();
                videoElement.remove();
                setScanning(false);
              }, 3000);

              if (docSnap.data().entryTime && !docSnap.data().exitTime) {
                updateDoc(userDocRef, {
                  exitTime: formattedDateTime
                });
              } else {
                updateDoc(userDocRef, {
                  entryTime: formattedDateTime,
                  exitTime: ""
                });
              }
            } else {
              console.log("No such document!");
            }
          });

          // Logic to update entry/exit time on admin side
          const qrOrgID = result.split("org_id=")[1];
          console.log("QR ORG ID: ", qrOrgID);
          getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
              const userOrgID = docSnap.data().orgID;
              const currentDate = new Date();
              const year = currentDate.getFullYear();
              const month = String(currentDate.getMonth() + 1).padStart(2, '0');
              const day = String(currentDate.getDate()).padStart(2, '0');
              const formattedDate = `${year}-${month}-${day}`;
              console.log("Formatted Date: ", formattedDate);

              const autoID = localStorage.getItem("autoID");
              console.log("Auto ID: ", autoID);
              if (autoID !== null) {
                // This means that the autoID exists, thus the user is trying to exit
                getDoc(doc(db, "organization", qrOrgID)).then(docSnap => {
                  if (docSnap.exists()) {
                    const orgDocRef = doc(db, "organization", qrOrgID);
                    const orgDocFormattedDateRef = doc(orgDocRef, "dates", formattedDate);
                    getDoc(orgDocFormattedDateRef).then(async docSnap => {
                      const orgDocRef = doc(db, "organization", qrOrgID);
                      const orgCollectionFormattedDateRef = collection(orgDocRef, formattedDate);
                      await updateDoc(doc(orgCollectionFormattedDateRef, autoID), {
                        exit: new Date().toLocaleTimeString().slice(0, -3)
                      });
                      localStorage.removeItem("autoID");
                    }
                    );
                  }
                })
              }
              else {
                getDoc(doc(db, "organization", qrOrgID)).then(docSnap => {
                  if (docSnap.exists()) {
                    const orgDocRef = doc(db, "organization", qrOrgID);
                    const orgDocFormattedDateRef = doc(orgDocRef, "dates", formattedDate);
                    getDoc(orgDocFormattedDateRef).then(async docSnap => {

                      console.log("Creating document!");
                      const orgDocRef = doc(db, "organization", qrOrgID);
                      const orgCollectionFormattedDateRef = collection(orgDocRef, formattedDate);
                      console.log("User Org ID: ", userOrgID);
                      console.log("QR Org ID: ", qrOrgID);
                      const entryAdded = await addDoc(orgCollectionFormattedDateRef, {
                        entry: new Date().toLocaleTimeString().slice(0, -3),
                        exit: "",
                        id: uid,
                        type: userOrgID === qrOrgID ? "employee" : "non-employee"
                      })
                      localStorage.setItem("autoID", entryAdded.id);
                    }
                    );
                  }
                }
                );
              }
            }
          }
          );

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
            {showSuccessMessage && <p className="success-message">QR code has successfully been scanned</p>}
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
          <Bottombar value={value} />
        </div>
      </div>
    </>
  );
};

export default ReadQR;
