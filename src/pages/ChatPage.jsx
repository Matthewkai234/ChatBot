import React, { useState } from 'react';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { sendMessageToLex } from '../services/lexService';
import './ChatPage.css';

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi there! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({ global: true }); 
      window.location.replace('/');    
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const lexResponse = await sendMessageToLex(userMessage.text);
      const botMessage = { from: 'bot', text: lexResponse };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message to Lex:', error);
      const errorMsg = { from: 'bot', text: 'Sorry, something went wrong.' };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !isSending) {
      handleSend();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h2>🤖 Cloud Assistant</h2>
          <button className="signout-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>

        <div className="chat-messages" id="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.from}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={isSending}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={isSending || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
