import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [
    createChatBotMessage("Hello world")
  ],
  botName: "Car Assistant",
  lang: "en",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#b81c21",
    },
    chatButton: {
      backgroundColor: "#b81c21",
    },
    headerText: {
      color: "#b81c21",
    },
  },
};

export default config;
