import type { CharacterId } from '../store';

const CHARACTERS: { id: CharacterId; name: string; emoji: string }[] = [
  { id: 'homer', name: 'Homer', emoji: '🍩' },
  { id: 'marge', name: 'Marge', emoji: '💙' },
  { id: 'bart', name: 'Bart', emoji: '⚡' },
  { id: 'lisa', name: 'Lisa', emoji: '🎷' },
  { id: 'grampa', name: 'Grampa', emoji: '📜' },
  { id: 'burns', name: 'Burns', emoji: '💰' },
  { id: 'smithers', name: 'Smithers', emoji: '📋' },
  { id: 'flanders', name: 'Ned', emoji: '✝️' },
  { id: 'milhouse', name: 'Milhouse', emoji: '👓' },
  { id: 'moe', name: 'Moe', emoji: '🍺' },
  { id: 'wiggum', name: 'Wiggum', emoji: '🚔' },
  { id: 'ralph', name: 'Ralph', emoji: '🖍️' },
  { id: 'frink', name: 'Frink', emoji: '🔬' },
  { id: 'krusty', name: 'Krusty', emoji: '🤡' },
];

interface CharacterGridProps {
  activeCharacter: CharacterId | null;
  consultedCharacters: CharacterId[];
  suggestedCharacters: CharacterId[];
  onSelect: (character: CharacterId) => void;
}

export function CharacterGrid({
  activeCharacter,
  consultedCharacters,
  suggestedCharacters,
  onSelect,
}: CharacterGridProps) {
  return (
    <div className="character-grid">
      {CHARACTERS.map((char) => {
        const isActive = activeCharacter === char.id;
        const isConsulted = consultedCharacters.includes(char.id);
        const isSuggested = suggestedCharacters.includes(char.id);
        
        return (
          <button
            key={char.id}
            className={`character-badge ${isActive ? 'active' : ''} ${isConsulted ? 'consulted' : ''}`}
            onClick={() => onSelect(char.id)}
            title={`${char.name}${isSuggested ? ' (Recommended)' : ''}${isConsulted ? ' (Consulted)' : ''}`}
            style={{
              outline: isSuggested && !isActive && !isConsulted ? '2px dashed var(--warning)' : undefined,
            }}
          >
            <div className="character-avatar" style={{
              background: isConsulted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--bg-card)',
            }}>
              {char.emoji}
            </div>
            <span className="character-name">{char.name}</span>
          </button>
        );
      })}
    </div>
  );
}
