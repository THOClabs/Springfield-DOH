/**
 * Problem Input Component
 * Initial screen where user states their problem
 */

import React, { useState, useCallback } from 'react';
import { useSpringfieldStore } from '../store';

export function ProblemInput() {
  const [problem, setProblem] = useState('');
  const { startEpisode, isLoading } = useSpringfieldStore();
  
  const handleSubmit = useCallback(async () => {
    if (problem.trim()) {
      await startEpisode(problem.trim());
    }
  }, [problem, startEpisode]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit();
    }
  }, [handleSubmit]);
  
  return (
    <div className="problem-input">
      <h1>🍩 SPRINGFIELD VR</h1>
      <p className="tagline">Immersive Problem-Solving Through Procedurally Generated Simpsons Episodes</p>
      
      <textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe the problem you'd like to solve...

Examples:
• I need to build an API that handles 100k requests per second
• Design a user authentication system with social login
• Migrate our monolith to microservices
• Create a real-time collaboration feature"
        disabled={isLoading}
      />
      
      <button 
        onClick={handleSubmit} 
        disabled={isLoading || !problem.trim()}
      >
        {isLoading ? 'Generating Episode...' : 'Enter Springfield'}
      </button>
      
      <p style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.6 }}>
        "I'm helping!" - Ralph Wiggum
      </p>
    </div>
  );
}
