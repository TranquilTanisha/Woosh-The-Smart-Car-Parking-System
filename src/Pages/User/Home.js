import React, { useState } from 'react';
import '../../App.css';
import Bottombar from '../../Components/Navbar/Bottombar';
import Navbar from '../../Components/Navbar/Navbar';
import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import chatbotIcon from '../../Images/chat-bot.png';
import config from '../../Components/Chatbot/Config';
import ActionProvider from '../../Components/Chatbot/ActionProvider';
import MessageParser from '../../Components/Chatbot/MessageParser';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user);
  const value = "Home";

  // const handleLogout = async() => {
  //   try {
  //     await signOut(auth);
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user');
  //     navigate('/login');
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const [chatbotVisible, setChatbotVisible] = useState(false);

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };

  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div>
        <h1 style={{marginTop: '8rem'}}>Welcomeeee {user.displayName}!</h1>
      </div>
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
      <div className="bottombar">
        <Bottombar value={value} />
      </div>
    </div>
  );
};

export default Home;
