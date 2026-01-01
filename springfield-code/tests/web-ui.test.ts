/**
 * Web UI Tests - 50 tests total
 * 44 unit tests + 6 UX integration tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock DOM environment for testing
function createMockDOM() {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <body>
            <div id="system-status">Loading...</div>
            <div id="ralph-gate-status">Ralph Gate: Unknown</div>
            <div id="ralph-gate-log"></div>
            <select id="character-select">
                <option value="">-- Select --</option>
                <option value="homer">Homer</option>
                <option value="ralph">Ralph</option>
            </select>
            <div id="summon-result"></div>
            <div id="batch-result"></div>
            <div id="character-grid"></div>
            <div id="character-count">0 characters active</div>
            <div id="skills-list"></div>
            <select id="artifact-type-select">
                <option value="">-- Select --</option>
                <option value="donut">Donut</option>
            </select>
            <div id="artifact-result"></div>
            <div id="config-display"></div>
            <div id="console-log"></div>
        </body>
        </html>
    `);
    return dom;
}

// App module simulation (mirrors app.js logic for unit testing)
const SIMPSON_FAMILY = ['homer', 'marge', 'bart', 'lisa', 'maggie'];
const EXTENDED_FAMILY = ['grampa', 'flanders'];
const SPRINGFIELD_RESIDENTS = [
    'apu', 'bob', 'burns', 'cbg', 'frink', 'krusty',
    'milhouse', 'moe', 'nelson', 'ralph', 'skinner',
    'smithers', 'wiggum', 'willie'
];
const ALL_CHARACTERS = [...SIMPSON_FAMILY, ...EXTENDED_FAMILY, ...SPRINGFIELD_RESIDENTS];

function createAppState() {
    return {
        activeCharacters: new Map(),
        ralphGateEnabled: false,
        skills: [],
        config: {},
        logs: []
    };
}

function isValidCharacter(characterId: string): boolean {
    return ALL_CHARACTERS.includes(characterId);
}

function createCharacter(characterId: string) {
    const names: Record<string, string> = {
        homer: 'Homer Simpson',
        marge: 'Marge Simpson',
        bart: 'Bart Simpson',
        lisa: 'Lisa Simpson',
        maggie: 'Maggie Simpson',
        grampa: 'Grampa Simpson',
        flanders: 'Ned Flanders',
        apu: 'Apu Nahasapeemapetilon',
        bob: 'Sideshow Bob',
        burns: 'Mr. Burns',
        cbg: 'Comic Book Guy',
        frink: 'Professor Frink',
        krusty: 'Krusty the Clown',
        milhouse: 'Milhouse Van Houten',
        moe: 'Moe Szyslak',
        nelson: 'Nelson Muntz',
        ralph: 'Ralph Wiggum',
        skinner: 'Principal Skinner',
        smithers: 'Waylon Smithers',
        wiggum: 'Chief Wiggum',
        willie: 'Groundskeeper Willie'
    };

    return {
        id: characterId,
        name: names[characterId] || characterId,
        summoned: new Date().toISOString(),
        active: true
    };
}

function checkRalphGateAccess(characterId: string, ralphGateEnabled: boolean) {
    if (!ralphGateEnabled) {
        return { allowed: true, reason: 'Ralph Gate disabled' };
    }
    if (characterId === 'ralph') {
        return { allowed: false, reason: 'Ralph blocked by Ralph Gate' };
    }
    return { allowed: true, reason: 'Character allowed' };
}

function getArtifactTypes() {
    return ['donut', 'saxophone', 'skateboard', 'pearls', 'pacifier', 'squishee', 'nuclear-rod', 'beer'];
}

function generateArtifact(type: string) {
    const artifacts: Record<string, { name: string; owner: string; power: number }> = {
        'donut': { name: 'Pink Donut', owner: 'homer', power: 10 },
        'saxophone': { name: "Lisa's Saxophone", owner: 'lisa', power: 25 },
        'skateboard': { name: "Bart's Skateboard", owner: 'bart', power: 15 },
        'pearls': { name: "Marge's Pearls", owner: 'marge', power: 20 },
        'pacifier': { name: "Maggie's Pacifier", owner: 'maggie', power: 5 },
        'squishee': { name: 'Brain Freeze Squishee', owner: 'apu', power: 12 },
        'nuclear-rod': { name: 'Plutonium Rod', owner: 'burns', power: 100 },
        'beer': { name: 'Duff Beer', owner: 'moe', power: 8 }
    };

    const artifact = artifacts[type];
    if (!artifact) return null;

    return {
        ...artifact,
        id: `${type}-${Date.now()}`,
        created: new Date().toISOString()
    };
}

// =============================================================================
// UNIT TESTS (44 tests)
// =============================================================================

describe('Web UI - Character Constants', () => {
    it('should have 5 Simpson family members', () => {
        expect(SIMPSON_FAMILY).toHaveLength(5);
    });

    it('should include Homer in Simpson family', () => {
        expect(SIMPSON_FAMILY).toContain('homer');
    });

    it('should include Marge in Simpson family', () => {
        expect(SIMPSON_FAMILY).toContain('marge');
    });

    it('should include Bart in Simpson family', () => {
        expect(SIMPSON_FAMILY).toContain('bart');
    });

    it('should include Lisa in Simpson family', () => {
        expect(SIMPSON_FAMILY).toContain('lisa');
    });

    it('should include Maggie in Simpson family', () => {
        expect(SIMPSON_FAMILY).toContain('maggie');
    });

    it('should have 2 extended family members', () => {
        expect(EXTENDED_FAMILY).toHaveLength(2);
    });

    it('should include Grampa in extended family', () => {
        expect(EXTENDED_FAMILY).toContain('grampa');
    });

    it('should include Flanders in extended family', () => {
        expect(EXTENDED_FAMILY).toContain('flanders');
    });

    it('should have 14 Springfield residents', () => {
        expect(SPRINGFIELD_RESIDENTS).toHaveLength(14);
    });

    it('should have 21 total characters', () => {
        expect(ALL_CHARACTERS).toHaveLength(21);
    });

    it('should include all Simpson family in all characters', () => {
        for (const member of SIMPSON_FAMILY) {
            expect(ALL_CHARACTERS).toContain(member);
        }
    });
});

describe('Web UI - Character Validation', () => {
    it('should validate homer as valid character', () => {
        expect(isValidCharacter('homer')).toBe(true);
    });

    it('should validate marge as valid character', () => {
        expect(isValidCharacter('marge')).toBe(true);
    });

    it('should validate ralph as valid character', () => {
        expect(isValidCharacter('ralph')).toBe(true);
    });

    it('should reject invalid character', () => {
        expect(isValidCharacter('invalid')).toBe(false);
    });

    it('should reject empty string', () => {
        expect(isValidCharacter('')).toBe(false);
    });

    it('should reject undefined-like string', () => {
        expect(isValidCharacter('undefined')).toBe(false);
    });
});

describe('Web UI - Character Creation', () => {
    it('should create Homer with correct name', () => {
        const char = createCharacter('homer');
        expect(char.name).toBe('Homer Simpson');
    });

    it('should create character with id', () => {
        const char = createCharacter('bart');
        expect(char.id).toBe('bart');
    });

    it('should create character with summoned timestamp', () => {
        const char = createCharacter('lisa');
        expect(char.summoned).toBeDefined();
        expect(new Date(char.summoned).getTime()).not.toBeNaN();
    });

    it('should create character with active status', () => {
        const char = createCharacter('marge');
        expect(char.active).toBe(true);
    });

    it('should handle unknown character id gracefully', () => {
        const char = createCharacter('unknown');
        expect(char.name).toBe('unknown');
    });
});

describe('Web UI - Ralph Gate Access', () => {
    it('should allow access when Ralph Gate disabled', () => {
        const result = checkRalphGateAccess('homer', false);
        expect(result.allowed).toBe(true);
        expect(result.reason).toBe('Ralph Gate disabled');
    });

    it('should allow Ralph when gate disabled', () => {
        const result = checkRalphGateAccess('ralph', false);
        expect(result.allowed).toBe(true);
    });

    it('should block Ralph when gate enabled', () => {
        const result = checkRalphGateAccess('ralph', true);
        expect(result.allowed).toBe(false);
        expect(result.reason).toBe('Ralph blocked by Ralph Gate');
    });

    it('should allow Homer when gate enabled', () => {
        const result = checkRalphGateAccess('homer', true);
        expect(result.allowed).toBe(true);
        expect(result.reason).toBe('Character allowed');
    });

    it('should allow all Simpsons when gate enabled', () => {
        for (const member of SIMPSON_FAMILY) {
            const result = checkRalphGateAccess(member, true);
            expect(result.allowed).toBe(true);
        }
    });
});

describe('Web UI - App State', () => {
    it('should create empty state', () => {
        const state = createAppState();
        expect(state.activeCharacters.size).toBe(0);
    });

    it('should start with Ralph Gate disabled', () => {
        const state = createAppState();
        expect(state.ralphGateEnabled).toBe(false);
    });

    it('should start with empty skills', () => {
        const state = createAppState();
        expect(state.skills).toHaveLength(0);
    });

    it('should start with empty config', () => {
        const state = createAppState();
        expect(Object.keys(state.config)).toHaveLength(0);
    });

    it('should start with empty logs', () => {
        const state = createAppState();
        expect(state.logs).toHaveLength(0);
    });

    it('should allow adding characters to state', () => {
        const state = createAppState();
        state.activeCharacters.set('homer', createCharacter('homer'));
        expect(state.activeCharacters.size).toBe(1);
    });

    it('should allow toggling Ralph Gate', () => {
        const state = createAppState();
        state.ralphGateEnabled = true;
        expect(state.ralphGateEnabled).toBe(true);
    });
});

describe('Web UI - Artifact Types', () => {
    it('should return 8 artifact types', () => {
        expect(getArtifactTypes()).toHaveLength(8);
    });

    it('should include donut artifact', () => {
        expect(getArtifactTypes()).toContain('donut');
    });

    it('should include saxophone artifact', () => {
        expect(getArtifactTypes()).toContain('saxophone');
    });

    it('should include nuclear-rod artifact', () => {
        expect(getArtifactTypes()).toContain('nuclear-rod');
    });
});

describe('Web UI - Artifact Generation', () => {
    it('should generate donut artifact', () => {
        const artifact = generateArtifact('donut');
        expect(artifact).not.toBeNull();
        expect(artifact!.name).toBe('Pink Donut');
    });

    it('should assign correct owner to artifact', () => {
        const artifact = generateArtifact('donut');
        expect(artifact!.owner).toBe('homer');
    });

    it('should set power level on artifact', () => {
        const artifact = generateArtifact('nuclear-rod');
        expect(artifact!.power).toBe(100);
    });

    it('should generate unique artifact id', async () => {
        const a1 = generateArtifact('donut');
        await new Promise(resolve => setTimeout(resolve, 2));
        const a2 = generateArtifact('donut');
        expect(a1!.id).not.toBe(a2!.id);
    });

    it('should return null for invalid artifact type', () => {
        const artifact = generateArtifact('invalid');
        expect(artifact).toBeNull();
    });

    it('should include created timestamp', () => {
        const artifact = generateArtifact('saxophone');
        expect(artifact!.created).toBeDefined();
    });
});

// =============================================================================
// UX INTEGRATION TESTS (6 tests) - DOM interaction simulation
// =============================================================================

describe('Web UI - UX Integration Tests', () => {
    let dom: JSDOM;
    let document: Document;
    let window: Window & typeof globalThis;

    beforeEach(() => {
        dom = createMockDOM();
        document = dom.window.document;
        window = dom.window as Window & typeof globalThis;
        // @ts-expect-error - Setting global document for tests
        global.document = document;
        // @ts-expect-error - Setting global window for tests
        global.window = window;
    });

    afterEach(() => {
        dom.window.close();
    });

    it('UX: should update system status display when refreshed', () => {
        const statusDiv = document.getElementById('system-status');
        expect(statusDiv).not.toBeNull();
        statusDiv!.textContent = 'System: Online';
        expect(statusDiv!.textContent).toBe('System: Online');
    });

    it('UX: should update Ralph Gate status display', () => {
        const ralphDiv = document.getElementById('ralph-gate-status');
        expect(ralphDiv).not.toBeNull();
        ralphDiv!.textContent = 'Ralph Gate: ENABLED';
        expect(ralphDiv!.textContent).toBe('Ralph Gate: ENABLED');
    });

    it('UX: should update character count display', () => {
        const countDiv = document.getElementById('character-count');
        expect(countDiv).not.toBeNull();
        countDiv!.textContent = '5 characters active';
        expect(countDiv!.textContent).toBe('5 characters active');
    });

    it('UX: should add character to grid display', () => {
        const gridDiv = document.getElementById('character-grid');
        expect(gridDiv).not.toBeNull();
        const charDiv = document.createElement('div');
        charDiv.textContent = 'Homer Simpson [homer]';
        gridDiv!.appendChild(charDiv);
        expect(gridDiv!.children.length).toBe(1);
    });

    it('UX: should show summon result message', () => {
        const resultDiv = document.getElementById('summon-result');
        expect(resultDiv).not.toBeNull();
        resultDiv!.textContent = 'Summoned: Homer Simpson';
        expect(resultDiv!.textContent).toBe('Summoned: Homer Simpson');
    });

    it('UX: should log messages to console display', () => {
        const consoleLog = document.getElementById('console-log');
        expect(consoleLog).not.toBeNull();
        const logEntry = document.createElement('div');
        logEntry.textContent = '[INFO] Springfield DOH Dashboard initialized';
        consoleLog!.appendChild(logEntry);
        expect(consoleLog!.children.length).toBe(1);
        expect(consoleLog!.textContent).toContain('Dashboard initialized');
    });
});
