import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';

const CHARACTER_COLORS: Record<string, string> = {
  homer: '#FFD700',
  marge: '#4169E1',
  bart: '#FF6B35',
  lisa: '#FF69B4',
  maggie: '#87CEEB',
  grampa: '#8B4513',
  burns: '#800080',
  smithers: '#20B2AA',
  flanders: '#32CD32',
  milhouse: '#4682B4',
  moe: '#A0522D',
  wiggum: '#1E90FF',
  ralph: '#FF4500',
  frink: '#00CED1',
  krusty: '#DC143C',
  user: '#FFD700',
};

function getInitials(name: string): string {
  if (name === 'user') return 'U';
  return name.charAt(0).toUpperCase();
}

export function ChatPanel() {
  const { 
    messages, 
    activeCharacter, 
    sendMessage, 
    isSending 
  } = useStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeCharacter) return;
    
    sendMessage(input);
    setInput('');
  };
  
  return (
    <div className="card chat-panel" style={{ height: 'calc(100vh - 280px)' }}>
      <div className="card-header">
        <h3 className="card-title">
          {activeCharacter ? (
            <>Chat with {activeCharacter.charAt(0).toUpperCase() + activeCharacter.slice(1)}</>
          ) : (
            'Select a character to chat'
          )}
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {messages.length} messages
        </span>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '2rem',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
            <p>
              {activeCharacter ? (
                <>
                  Start a conversation with {activeCharacter.charAt(0).toUpperCase() + activeCharacter.slice(1)}!
                  <br />
                  <span style={{ fontSize: '0.85rem' }}>
                    Ask about your problem and get their unique perspective.
                  </span>
                </>
              ) : (
                <>
                  Select a character from the sidebar to begin.
                  <br />
                  <span style={{ fontSize: '0.85rem' }}>
                    Each character brings their own expertise and perspective.
                  </span>
                </>
              )}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <div className="message-header">
                <div 
                  className="message-avatar"
                  style={{ background: CHARACTER_COLORS[msg.sender] || '#666' }}
                >
                  {getInitials(msg.sender)}
                </div>
                <span className="message-sender">
                  {msg.sender === 'user' ? 'You' : msg.sender.charAt(0).toUpperCase() + msg.sender.slice(1)}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className={`message-content ${msg.sender === 'user' ? 'user' : ''}`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input-container" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={
            activeCharacter 
              ? `Ask ${activeCharacter}...`
              : 'Select a character first'
          }
          disabled={!activeCharacter || isSending}
          rows={2}
        />
      </form>
    </div>
  );
}
