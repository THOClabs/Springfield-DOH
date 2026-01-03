import { useStore } from './store';
import { ProblemForm } from './components/ProblemForm';
import { Sidebar } from './components/Sidebar';
import { SessionView } from './components/SessionView';

export function App() {
  const { sessionId, wsConnected } = useStore();
  
  return (
    <div className="app">
      <header className="header">
        <h1>
          🍩 Springfield Problem Solver
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {sessionId && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Session: {sessionId.substring(0, 8)}...
            </span>
          )}
          {wsConnected && (
            <span style={{ 
              fontSize: '0.7rem', 
              padding: '0.25rem 0.5rem',
              background: 'rgba(74, 222, 128, 0.2)',
              color: 'var(--success)',
              borderRadius: '4px',
            }}>
              ● Connected
            </span>
          )}
        </div>
      </header>
      
      <main className="main-content">
        {sessionId ? <SessionView /> : <ProblemForm />}
        {sessionId && <Sidebar />}
      </main>
    </div>
  );
}
