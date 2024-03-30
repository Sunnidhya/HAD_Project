import React, { useState, useEffect } from 'react';
import './ChatRoom.css';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  let stompClient = null;

  useEffect(() => {
    // Establish WebSocket connection when component mounts
    connectToWebSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectToWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      // Subscribe to receive messages from the server
      stompClient.subscribe('/topic/public', (message) => {
        handleMessageReceived(JSON.parse(message.body));
      });
    });
  };

  const handleMessageReceived = (message) => {
    setMessages([...messages, { text: message.text, sender: message.sender }]);
  };

  const handleMessageSend = () => {
    if (stompClient && inputMessage.trim() !== '') {
      const message = {
        text: inputMessage.trim(),
        sender: 'You'
      };
      stompClient.send('/app/message', {}, JSON.stringify(message));
      setInputMessage('');
    }
  };

  return (
    <div className="chat-room">
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <div className="sender">{message.sender}</div>
            <div className="text">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;

