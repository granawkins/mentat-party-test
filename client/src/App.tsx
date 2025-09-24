import { useState, useEffect } from 'react';
import mentatLogo from '/mentat.png';
import ChessGame from './Chess';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'chess'>('home');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackendMessage = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api');

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setMessage(data.message);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBackendMessage();
  }, []);

  const renderHomeContent = () => (
    <>
      {/* Logo */}
      <div>
        <a href="https://mentat.ai" target="_blank">
          <img src={mentatLogo} alt="Mentat Logo" />
        </a>
      </div>

      {/* Main content */}
      <div
        className="paper"
        style={{
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <h1>Mentat Template JS</h1>

        {/* Tech stack */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          {[
            ['Frontend', 'React, Vite, Vitest'],
            ['Backend', 'Node.js, Express, Jest'],
            ['Utilities', 'TypeScript, ESLint, Prettier'],
          ].map(([title, techs]) => (
            <div
              className="section"
              style={{ textAlign: 'center' }}
              key={title}
            >
              <div
                style={{
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#e2e8f0',
                  marginBottom: '4px',
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{techs}</div>
            </div>
          ))}
        </div>

        {/* Server message */}
        <div className="section">
          <div
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#e2e8f0',
              marginBottom: '8px',
            }}
          >
            Message from server:
          </div>
          <div style={{ fontSize: '14px', color: '#e2e8f0' }}>
            {loading ? (
              'Loading message from server...'
            ) : error ? (
              <span style={{ color: '#f87171' }}>Error: {error}</span>
            ) : message ? (
              message
            ) : (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                No message from server
              </span>
            )}
          </div>
        </div>

        {/* Call to action */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#94a3b8',
          }}
        >
          Create a new GitHub issue and tag{' '}
          <code
            style={{
              backgroundColor: 'rgba(51, 65, 85, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '13px',
              color: '#e2e8f0',
            }}
          >
            @MentatBot
          </code>{' '}
          to get started.
        </div>
      </div>
    </>
  );

  return (
    <div
      style={{
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
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '2px',
          marginBottom: '20px',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '8px',
          padding: '4px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <button
          onClick={() => setActiveTab('home')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor:
              activeTab === 'home' ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
            color: activeTab === 'home' ? '#ffffff' : '#cbd5e1',
            boxShadow:
              activeTab === 'home'
                ? '0 2px 8px rgba(59, 130, 246, 0.3)'
                : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('chess')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor:
              activeTab === 'chess' ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
            color: activeTab === 'chess' ? '#ffffff' : '#cbd5e1',
            boxShadow:
              activeTab === 'chess'
                ? '0 2px 8px rgba(59, 130, 246, 0.3)'
                : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          Chess
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'home' ? renderHomeContent() : <ChessGame />}
    </div>
  );
}

export default App;
