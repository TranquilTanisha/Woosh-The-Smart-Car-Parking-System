import React, { useEffect, useState } from 'react';
import '../../../App.css';
import Bottombar from '../../../Components/Navbar/Bottombar';
import Navbar from '../../../Components/Navbar/Navbar';
import Location from '../Location';
import { Box } from '@mui/material';
import SessionHistory from '../../../Components/SessionHistory';
// import Chatbot from 'react-chatbot-kit';
// import 'react-chatbot-kit/build/main.css';
// import ActionProvider from '../../../Components/Chatbot/ActionProvider';
// import config from '../../../Components/Chatbot/Config';
// import MessageParser from '../../../Components/Chatbot/MessageParser';
// import chatbotIcon from '../../../Images/chat-bot.png';

const Home = () => {
  const [username, setUsername] = useState('');
  // const [chatbotVisible, setChatbotVisible] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    if (profile !== "undefined" && profile !== null) {
      setUsername(JSON.parse(profile).name);
    }
  }, []);

  // const toggleChatbot = () => {
  //   setChatbotVisible(!chatbotVisible);
  // };

  return (
    <div>
      <div className='navbar'>
      <Navbar />
      </div>
      <div className='home'>
        <div>
          <h1 style={{ marginTop: '8rem', textAlign: 'center' }}>Welcome {username}! Explore nearby parking areas. </h1>
        </div>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
         <div className='lb'>
         <div className='location_box' >
            <Location />
          </div>
         </div>
        </Box>
        <SessionHistory />
        <div>
          <img
            src={chatbotIcon}
            alt="Chatbot"
            className={chatbotVisible ? 'chatbot-icon animate-zoom' : 'chatbot-icon'}
            style={{ position: 'fixed', bottom: '60px', right: '20px', width: '60px', height: '60px', cursor: 'pointer' }}
            onClick={toggleChatbot}
          />
          {chatbotVisible && (
            <div className="chatbot-window" style={{ position: 'fixed', bottom: '130px', right: '70px' }}>
              <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
              />
            </div>
          )}
        </div>
      </div>
      <div className='bottombar'>
      <Bottombar value="Home" />
      </div>
    </div>
  );
};

export default Home;