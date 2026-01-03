import type { Episode } from '../store';

interface EpisodeListProps {
  episodes: Episode[];
}

export function EpisodeList({ episodes }: EpisodeListProps) {
  if (episodes.length === 0) {
    return (
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        No relevant episodes found
      </div>
    );
  }
  
  return (
    <div className="episode-list">
      {episodes.map((ep) => (
        <div key={ep.code} className="episode-item">
          <span className="episode-code">{ep.code}</span>
          <span className="episode-title">{ep.title}</span>
          {ep.themes.length > 0 && (
            <div style={{ 
              marginTop: '0.25rem',
              display: 'flex',
              gap: '0.25rem',
              flexWrap: 'wrap',
            }}>
              {ep.themes.slice(0, 3).map((theme) => (
                <span 
                  key={theme} 
                  style={{
                    fontSize: '0.6rem',
                    padding: '0.125rem 0.375rem',
                    background: 'var(--bg-dark)',
                    borderRadius: '4px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {theme}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
