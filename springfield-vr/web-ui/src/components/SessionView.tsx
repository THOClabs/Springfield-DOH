import { useStore } from '../store';
import { ChatPanel } from './ChatPanel';

export function SessionView() {
  const { problem, classification, reset } = useStore();
  
  return (
    <div className="problem-form-container">
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">
          <h2 className="card-title">Problem Statement</h2>
          <button className="btn btn-secondary" onClick={reset} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            New Session
          </button>
        </div>
        <p style={{ color: 'var(--text)', lineHeight: 1.6 }}>
          {problem}
        </p>
        
        {classification && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: 'var(--bg-lighter)',
            borderRadius: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <strong style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
                Primary Domain:
              </strong>
              <span style={{ color: 'var(--text)' }}>{classification.primaryDomain}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>
                Recommended Characters:
              </strong>
              <span style={{ color: 'var(--text)' }}>
                {classification.suggestedCharacters.join(', ')}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <ChatPanel />
    </div>
  );
}
