import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const ChatComponent = ({ chatId }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);
  const socketRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg bg-white shadow-lg border border-black rounded-3xl p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex flex-col h-64 overflow-y-auto border border-gray-300 rounded-lg p-2 mb-4">
        {chatMessages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>User {msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg p-2"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
