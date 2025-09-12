import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import mentatLogo from '/mentat.png';

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    // Load initial messages
    fetchMessages();

    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !username.trim()) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          text: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh messages
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!isUsernameSet) {
        if (username.trim()) {
          setIsUsernameSet(true);
        }
      } else {
        sendMessage();
      }
    }
  };

  if (!isUsernameSet) {
    return (
      <div
        style={{
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          justifyContent: 'center',
          padding: '20px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div>
          <a href="https://mentat.ai" target="_blank">
            <img src={mentatLogo} alt="Mentat Logo" />
          </a>
        </div>

        <div
          className="paper"
          style={{ maxWidth: '400px', textAlign: 'center' }}
        >
          <h1>🎉 Mentat Party</h1>
          <p style={{ marginBottom: '20px', color: '#6b7280' }}>
            Welcome to the party! Enter your username to join the chat.
          </p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your username..."
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '16px',
            }}
            autoFocus
          />
          <button
            onClick={() => username.trim() && setIsUsernameSet(true)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Join the Party! 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <a href="https://mentat.ai" target="_blank">
          <img src={mentatLogo} alt="Mentat Logo" style={{ height: '32px' }} />
        </a>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🎉 Mentat Party</h1>
        <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#6b7280' }}>
          Welcome, <strong>{username}</strong>!
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{ textAlign: 'center', color: '#6b7280', marginTop: '40px' }}
          >
            No messages yet. Be the first to say something! 👋
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="section"
              style={{
                maxWidth: '70%',
                alignSelf:
                  message.username === username ? 'flex-end' : 'flex-start',
                backgroundColor:
                  message.username === username ? '#3b82f6' : 'white',
                color: message.username === username ? 'white' : '#1f2937',
              }}
            >
              <div
                style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}
              >
                <strong>{message.username}</strong> •{' '}
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
              <div>{message.text}</div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '16px 20px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Send 🚀
        </button>
      </div>
    </div>
  );
}

export default App;
