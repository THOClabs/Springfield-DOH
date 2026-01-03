import type { RalphStatus } from '../store';

interface RalphMonitorProps {
  status: RalphStatus;
  onStart: () => void;
}

export function RalphMonitor({ status, onStart }: RalphMonitorProps) {
  return (
    <div className="ralph-monitor">
      <div className="ralph-status">
        <span 
          className={`status-indicator ${status.state === 'running' ? 'running' : ''} ${status.state === 'error' ? 'error' : ''}`} 
        />
        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
          {status.state === 'idle' && 'Ready to execute'}
          {status.state === 'running' && 'Executing...'}
          {status.state === 'completed' && 'Completed!'}
          {status.state === 'error' && 'Error occurred'}
        </span>
      </div>
      
      {status.branch && (
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-muted)',
          marginBottom: '0.5rem',
        }}>
          Branch: <code style={{ color: 'var(--primary)' }}>{status.branch}</code>
        </div>
      )}
      
      {status.currentStep && (
        <div style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text)',
          marginBottom: '0.5rem',
        }}>
          {status.currentStep}
        </div>
      )}
      
      {status.state === 'running' && (
        <div className="ralph-progress">
          <div 
            className="ralph-progress-bar" 
            style={{ width: `${status.progress}%` }}
          />
        </div>
      )}
      
      {status.logs.length > 0 && (
        <div className="ralph-log">
          {status.logs.slice(-5).map((log, i) => (
            <div key={i} className="ralph-log-line">
              <span style={{ color: 'var(--text-muted)' }}>›</span> {log}
            </div>
          ))}
        </div>
      )}
      
      {status.state === 'idle' && (
        <button 
          className="btn btn-primary" 
          onClick={onStart}
          style={{ width: '100%', marginTop: '0.75rem' }}
        >
          🖍️ Start Ralph Execution
        </button>
      )}
      
      {status.state === 'completed' && (
        <div style={{ 
          marginTop: '0.75rem',
          padding: '0.75rem',
          background: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid var(--success)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: 'var(--success)',
        }}>
          ✓ Implementation complete! Check the generated branch.
        </div>
      )}
      
      {status.state === 'error' && (
        <button 
          className="btn btn-secondary" 
          onClick={onStart}
          style={{ width: '100%', marginTop: '0.75rem' }}
        >
          Retry Execution
        </button>
      )}
    </div>
  );
}
