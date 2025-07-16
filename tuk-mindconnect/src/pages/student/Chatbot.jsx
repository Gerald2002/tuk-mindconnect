import { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m your MindConnect Assistant. How can I support you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
      });

      const botReply = response.data.reply;

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: botReply }
      ]);
    } catch (error) {
      console.error('Chatbot Error:', error.response?.data || error.message);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-lg font-semibold">
        TUK MindConnect Chat Assistant
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-sm px-4 py-2 rounded-lg text-sm ${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-white text-gray-800 mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 text-xs italic">Assistant is typing...</div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white flex border-t">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-l focus:outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
