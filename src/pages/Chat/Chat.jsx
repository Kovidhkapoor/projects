import React, { useContext, useEffect, useState } from 'react';
import './Chat.css';
import LeftSideBar from '../../Components/LeftSideBar/LeftSideBar';
import ChatBox from '../../Components/Chatbox/ChatBox';
import RightSideBar from '../../Components/RightSideBar/RightSideBar';
import { Appcontext } from '../../context/Appcontext';

const Chat = () => {
  const { chatData, userData } = useContext(Appcontext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [chatData, userData]);

  return (
    <div className='chat'>
      {loading ? (
        <p className='loading'>Loading...</p>
      ) : (
        <div className='chat-container'>
          <LeftSideBar />
          <ChatBox />
          <RightSideBar />
        </div>
      )}
    </div>
  );
};

export default Chat;
