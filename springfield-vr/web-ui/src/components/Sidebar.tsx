import { useStore } from '../store';
import { CharacterGrid } from './CharacterGrid';
import { RalphMonitor } from './RalphMonitor';
import { EpisodeList } from './EpisodeList';

export function Sidebar() {
  const { 
    classification, 
    activeCharacter,
    consultedCharacters,
    selectCharacter,
    relevantEpisodes,
    ralphStatus,
    startRalph,
  } = useStore();
  
  return (
    <aside className="sidebar">
      {/* Classification */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Classification</h3>
        {classification ? (
          <div className="classification">
            <div className="classification-domains">
              {classification.domains.map((domain, i) => (
                <span 
                  key={domain} 
                  className={`domain-tag ${i === 0 ? 'primary' : ''}`}
                >
                  {domain}
                </span>
              ))}
            </div>
            <div style={{ 
              marginTop: '0.5rem', 
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
            }}>
              Complexity: <span style={{ 
                color: classification.complexity === 'extreme' ? 'var(--error)' :
                       classification.complexity === 'high' ? 'var(--warning)' :
                       classification.complexity === 'medium' ? 'var(--primary)' :
                       'var(--success)'
              }}>{classification.complexity}</span>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Submit a problem to see classification
          </div>
        )}
      </div>
      
      {/* Characters */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Characters</h3>
        <CharacterGrid 
          activeCharacter={activeCharacter}
          consultedCharacters={consultedCharacters}
          suggestedCharacters={classification?.suggestedCharacters || []}
          onSelect={selectCharacter}
        />
      </div>
      
      {/* Ralph Execution */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Ralph Execution</h3>
        <RalphMonitor status={ralphStatus} onStart={startRalph} />
      </div>
      
      {/* Episode Context */}
      {relevantEpisodes.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">Episode Context</h3>
          <EpisodeList episodes={relevantEpisodes} />
        </div>
      )}
    </aside>
  );
}
