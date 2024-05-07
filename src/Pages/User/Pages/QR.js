import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../../../Firebase.js';
import Theme from '../../../Components/DarkMode/DarkMode';
import Bottombar from '../../../Components/Navbar/Bottombar';
import Navbar from '../../../Components/Navbar/Navbar';
import '../../../App.css';
import { Merge } from '@mui/icons-material';

QrScanner.WORKER_PATH = './worker.js';

function genAutoID(len) {
  var text = "";

  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}

const ReadQR = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraErrorMessage, setCameraErrorMessage] = useState('');
  const [scanning, setScanning] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showLinkButton, setShowLinkButton] = useState(false);
  const [hasScannedOnce, setHasScannedOnce] = useState(false);
  const [qrOrgID, setQrOrgID] = useState(null);
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

  const addToSessionHistory = async (userID, entryTime, exitTime, orgID) => {
    const sessionHistoryRef = collection(db, "session_history");
    await addDoc(sessionHistoryRef, {
      userID: userID,
      entryTime: entryTime,
      exitTime: exitTime,
      orgID: orgID
    });
  };

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
          localStorage.setItem('userID', uid);
          const userDocRef = doc(db, "users", uid);
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
              setHasScannedOnce(true);
              setShowLinkButton(true);
              setTimeout(() => {
                setShowSuccessMessage(false);
                setScanning(false);
              }, 3000);
              
              if (result) {
                setData(result);
                const qrOrgID = result.includes("org_id=") ? result.split("org_id=")[1] : null;
                setQrOrgID(qrOrgID);
            
                if (qrOrgID) {
                  if (docSnap.data().entryTime && !docSnap.data().exitTime) {
                    updateDoc(userDocRef, {
                      exitTime: formattedDateTime
                    }).then(() => {
                      addToSessionHistory(uid, docSnap.data().entryTime, formattedDateTime, qrOrgID);
                    });
                  } else {
                    updateDoc(userDocRef, {
                      entryTime: formattedDateTime,
                      exitTime: ""
                    }).then(() => {
                      addToSessionHistory(uid, formattedDateTime, "", qrOrgID);
                    });
                  }
                } else {
                  console.error("orgID is undefined. Cannot add to session history.");
                }
              }

              const userData = {
                entryTime: formattedDateTime,
                exitTime: "",
                // name: name,
                // id: uid,
                // type: entryType
              };

              if (!docSnap.exists()){
                userDocRef.set(userData)
                .then(() => {
                  console.log("Document created successfully!");
                  updateDoc(userDocRef, {
                    entryTime: formattedDateTime,
                    exitTime: ""
                  }).then(() => {
                    addToSessionHistory(uid, formattedDateTime, "");
                    }).catch((error) => {
                      console.error("Error updating document: ", error);
                    });
                }) .catch((error) => {
                  console.error("Error creating document: ", error);
                });
              }
            }
          });
      //         setDoc(userDocRef, userData, {merge: true})
      //           .then(() => {
      //             console.log("User document created successfully!");
      //             updateDoc(userDocRef, {
      //               entryTime: formattedDateTime,
      //               exitTime: ""
      //           }).then(() => {
      //             console.log("User document updated successfully!");
      //           }).catch((error) => {
      //             console.error("Error creating user document: ", error);
      //           });
      //       })
      //     .catch((error)=> {console.error("Error creating user document: ", error);
      //   });  
      // }
      // });

          const qrOrgID = result.split("org_id=")[1];
console.log("QR ORG ID: ", qrOrgID);
getDoc(userDocRef).then(docSnap => {
    if (docSnap.exists()) {
        const { name } = docSnap.data();
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
                    });
                }
            });
        } else {
            // const alertsCollectionRef = collection(db, "alerts");
            // console.log(data.alertsCollectionRef)
            // const alertData = {
            //   [uid]: formattedDate,
            // };
            // addDoc(alertsCollectionRef, alertData)
            //     .then(() => {
            //         console.log("Alert data added successfully to the alerts collection");
            //     })
            //     .catch((error) => {
            //         console.error("Error adding alert data to the alerts collection: ", error);
            //     });

                
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
                        const entryType = userOrgID === qrOrgID ? "employee" : "non-employee";
                        const entryAdded = await addDoc(orgCollectionFormattedDateRef, {
                            name: name,
                            entry: new Date().toLocaleTimeString().slice(0, -3),
                            exit: "",
                            id: uid,
                            type: entryType
                        });
                        localStorage.setItem("autoID", entryAdded.id);
                    });
                }
            });
        }
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

  const handleRedirect = () => {
    window.location.href = 'https://html.itch.zone/html/10151287/index.html';
  };

  return (
    <>
    <style>
        {`
          body {
            overflow: hidden;
          }
        `}
      </style>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="qr">
        <Theme />
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
              {showLinkButton && hasScannedOnce && (
                <>
                <button className="btn btn-primary mx-2 scan-button" onClick={handleRedirect}>Go to Link</button>
                <button className="btn btn-primary mx-2 scan-button" onClick={() => navigate(`/navigation/detail/${qrOrgID}`)}>Check Availablity</button>
                </>
              )}
            </div>
          </div>
          <div className="bottombar">
            <Bottombar value="QR" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadQR;