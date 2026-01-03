import { useStore } from '../store';

export function ProblemForm() {
  const { problem, setProblem, submitProblem, isClassifying } = useStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitProblem();
  };
  
  return (
    <div className="problem-form-container">
      <form className="problem-form" onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">What problem would you like to solve?</h2>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="problem">
              Describe your problem in detail. The Springfield characters will help analyze and solve it.
            </label>
            <textarea
              id="problem"
              className="form-textarea"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Example: I need to build a real-time notification system that can handle millions of users. It should support web push, mobile notifications, and email fallback. The system needs to be scalable and have low latency..."
              disabled={isClassifying}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setProblem('')}
              disabled={isClassifying || !problem}
            >
              Clear
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isClassifying || !problem.trim()}
            >
              {isClassifying ? (
                <>
                  <span className="spinner" style={{ marginRight: '0.5rem' }} />
                  Analyzing...
                </>
              ) : (
                'Start Session'
              )}
            </button>
          </div>
        </div>
        
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title">How it works</h3>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1.5rem',
            fontSize: '0.9rem',
          }}>
            <div>
              <strong style={{ color: 'var(--primary)' }}>1. Classify</strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Your problem is analyzed and classified into domains like infrastructure, 
                security, data, or user experience.
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--primary)' }}>2. Consult</strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Interview Springfield characters. Each has unique expertise - Homer asks 
                the "dumb" questions, Lisa provides structure, Bart finds edge cases.
              </p>
            </div>
            <div>
              <strong style={{ color: 'var(--primary)' }}>3. Execute</strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Ralph implements the solution using Claude Code, creating branches, 
                writing code, and running tests.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
