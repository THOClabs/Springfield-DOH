/**
 * HUD Component
 * 2D overlay for conversation and controls
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSpringfieldStore } from '../store';

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '1rem',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    color: 'white',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    zIndex: 100
  },
  conversationBox: {
    maxWidth: '800px',
    margin: '0 auto',
    maxHeight: '200px',
    overflowY: 'auto',
    marginBottom: '1rem',
    padding: '0.5rem'
  },
  message: {
    marginBottom: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    maxWidth: '80%'
  },
  userMessage: {
    background: 'rgba(100, 149, 237, 0.8)',
    marginLeft: 'auto',
    textAlign: 'right' as const
  },
  characterMessage: {
    background: 'rgba(255, 215, 0, 0.8)',
    color: '#1a1a2e'
  },
  inputContainer: {
    display: 'flex',
    maxWidth: '800px',
    margin: '0 auto',
    gap: '0.5rem'
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '2px solid rgba(255, 215, 0, 0.5)',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    outline: 'none'
  },
  sendButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    background: '#ffd700',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    padding: '1rem',
    background: 'linear-gradient(rgba(0,0,0,0.8), transparent)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100
  },
  episodeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  characterIndicator: {
    background: 'rgba(255, 215, 0, 0.8)',
    color: '#1a1a2e',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: 'bold'
  },
  ralphStatus: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.9)',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center' as const,
    zIndex: 200
  },
  ralphButton: {
    marginTop: '1rem',
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    background: '#ffd700',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export function HUD() {
  const [inputValue, setInputValue] = useState('');
  const conversationRef = useRef<HTMLDivElement>(null);
  
  const { 
    session, 
    currentCharacter, 
    conversationHistory, 
    sendMessage, 
    isLoading,
    ralphJob,
    startRalph,
    checkRalphStatus,
    reset
  } = useSpringfieldStore();
  
  // Auto-scroll conversation
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversationHistory]);
  
  // Poll Ralph status
  useEffect(() => {
    if (ralphJob && (ralphJob.status === 'running' || ralphJob.status === 'iterating')) {
      const interval = setInterval(checkRalphStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [ralphJob, checkRalphStatus]);
  
  const handleSend = useCallback(async () => {
    if (inputValue.trim() && !isLoading) {
      await sendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, sendMessage, isLoading]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);
  
  // Show Ralph status if at playground
  const isAtPlayground = session?.status === 'at-playground' || 
                         currentCharacter?.scene === 'elementary-playground';
  
  return (
    <>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.episodeInfo}>
          <h2 style={{ margin: 0, color: '#ffd700' }}>
            🍩 {session?.episode.title || 'Springfield VR'}
          </h2>
        </div>
        
        {currentCharacter && (
          <div style={styles.characterIndicator}>
            Talking to: {currentCharacter.character}
          </div>
        )}
        
        <button 
          onClick={reset}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          New Episode
        </button>
      </div>
      
      {/* Conversation & Input */}
      <div style={styles.container}>
        {/* Conversation history */}
        <div style={styles.conversationBox} ref={conversationRef}>
          {conversationHistory.map((msg, i) => (
            <div 
              key={i} 
              style={{
                ...styles.message,
                ...(msg.role === 'user' ? styles.userMessage : styles.characterMessage)
              }}
            >
              {msg.role === 'character' && msg.character && (
                <strong>{msg.character}: </strong>
              )}
              {msg.content}
            </div>
          ))}
          
          {isLoading && (
            <div style={{ ...styles.message, ...styles.characterMessage, opacity: 0.6 }}>
              Thinking...
            </div>
          )}
        </div>
        
        {/* Input */}
        {!isAtPlayground && (
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Talk to ${currentCharacter?.character || 'the character'}...`}
              style={styles.input}
              disabled={isLoading}
            />
            <button 
              onClick={handleSend} 
              style={styles.sendButton}
              disabled={isLoading || !inputValue.trim()}
            >
              Send
            </button>
          </div>
        )}
      </div>
      
      {/* Ralph Modal */}
      {isAtPlayground && !ralphJob && (
        <div style={styles.ralphStatus}>
          <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>
            🏫 Welcome to the Playground
          </h2>
          <p>
            Lisa has prepared all the design documents.<br/>
            Ralph is ready to build your solution.
          </p>
          <button style={styles.ralphButton} onClick={startRalph}>
            "I'm Helping!" - Start Ralph
          </button>
        </div>
      )}
      
      {/* Ralph Progress */}
      {ralphJob && (
        <div style={styles.ralphStatus}>
          <h2 style={{ color: '#ffd700', marginBottom: '1rem' }}>
            🔨 Ralph is Building...
          </h2>
          <p>Status: {ralphJob.status}</p>
          <p>Iteration: {ralphJob.iteration}</p>
          
          {ralphJob.status === 'complete' && ralphJob.result && (
            <>
              <p style={{ color: ralphJob.result.success ? '#00ff00' : '#ff0000' }}>
                {ralphJob.result.success ? '✅ Build Complete!' : '❌ Build Failed'}
              </p>
              {ralphJob.result.filesCreated && (
                <p>Files created: {ralphJob.result.filesCreated.length}</p>
              )}
              <button style={styles.ralphButton} onClick={reset}>
                Start New Episode
              </button>
            </>
          )}
          
          {(ralphJob.status === 'running' || ralphJob.status === 'iterating') && (
            <div style={{ marginTop: '1rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
              <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>
                "My cat's breath smells like cat food"
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
