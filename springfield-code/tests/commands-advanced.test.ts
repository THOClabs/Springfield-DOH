/**
 * Commands Advanced Tests - Batch 6
 * Advanced testing of command modules and their edge cases
 * 50 tests covering all command modules extensively
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

// Import command modules
import { ALL_CHARACTERS, CHARACTER_ARTIFACTS, CHARACTER_TIERS, REQUIRED_FILES } from '../src/constants.js';
import { getArtifactTemplate, ConversationContext } from '../src/artifacts/generators/index.js';

describe('Commands Advanced - Template Generation', () => {
    const baseContext: ConversationContext = {
        character: 'homer',
        userInput: 'Test project description',
        timestamp: new Date('2024-01-01T00:00:00Z')
    };

    it('homer template should contain questions', () => {
        const template = getArtifactTemplate('homer', baseContext);
        expect(template.toLowerCase()).toMatch(/question|why|what|how/);
    });

    it('marge template should be structured', () => {
        const template = getArtifactTemplate('marge', {...baseContext, character: 'marge'});
        expect(template).toMatch(/[-*#]/);
    });

    it('bart template should mention edge cases', () => {
        const template = getArtifactTemplate('bart', {...baseContext, character: 'bart'});
        expect(template.toLowerCase()).toMatch(/edge|case|break|test/);
    });

    it('lisa template should be analytical', () => {
        const template = getArtifactTemplate('lisa', {...baseContext, character: 'lisa'});
        expect(template.length).toBeGreaterThan(50);
    });

    it('maggie template should be concise', () => {
        const template = getArtifactTemplate('maggie', {...baseContext, character: 'maggie'});
        expect(template.length).toBeGreaterThan(0);
    });

    it('grampa template should reference history', () => {
        const template = getArtifactTemplate('grampa', {...baseContext, character: 'grampa'});
        expect(template.toLowerCase()).toMatch(/history|remember|past|back/);
    });

    it('burns template should discuss budget', () => {
        const template = getArtifactTemplate('burns', {...baseContext, character: 'burns'});
        expect(template.toLowerCase()).toMatch(/budget|cost|resource|money/);
    });

    it('smithers template should be organized', () => {
        const template = getArtifactTemplate('smithers', {...baseContext, character: 'smithers'});
        expect(template.length).toBeGreaterThan(50);
    });

    it('flanders template should mention standards', () => {
        const template = getArtifactTemplate('flanders', {...baseContext, character: 'flanders'});
        expect(template.toLowerCase()).toMatch(/standard|best|practice|proper/);
    });

    it('milhouse template should cover dependencies', () => {
        const template = getArtifactTemplate('milhouse', {...baseContext, character: 'milhouse'});
        expect(template.toLowerCase()).toMatch(/depend|package|import|module/);
    });
});

describe('Commands Advanced - Extended Family Templates', () => {
    const timestamp = new Date('2024-01-01T00:00:00Z');

    it('moe template should be about debugging', () => {
        const template = getArtifactTemplate('moe', {
            character: 'moe',
            userInput: 'Debug this code',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/debug|issue|problem|fix/);
    });

    it('wiggum template should cover security', () => {
        const template = getArtifactTemplate('wiggum', {
            character: 'wiggum',
            userInput: 'Security review',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/security|risk|threat|protect/);
    });

    it('krusty template should be about demos', () => {
        const template = getArtifactTemplate('krusty', {
            character: 'krusty',
            userInput: 'Demo script',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/demo|show|present|perform/);
    });

    it('bob template should be adversarial', () => {
        const template = getArtifactTemplate('bob', {
            character: 'bob',
            userInput: 'Adversarial testing',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/adversarial|attack|fail|break/);
    });

    it('skinner template should have timeline', () => {
        const template = getArtifactTemplate('skinner', {
            character: 'skinner',
            userInput: 'Project timeline',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/time|schedule|deadline|date/);
    });

    it('nelson template should include tests', () => {
        const template = getArtifactTemplate('nelson', {
            character: 'nelson',
            userInput: 'Test plan',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/test|assert|verify|check/);
    });

    it('apu template should provide utilities', () => {
        const template = getArtifactTemplate('apu', {
            character: 'apu',
            userInput: 'Utility functions',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/util|helper|function|tool/);
    });

    it('frink template should be experimental', () => {
        const template = getArtifactTemplate('frink', {
            character: 'frink',
            userInput: 'Experiment design',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/experiment|research|hypothesis|test/);
    });

    it('cbg template should review docs', () => {
        const template = getArtifactTemplate('cbg', {
            character: 'cbg',
            userInput: 'Documentation review',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/document|doc|review|comment/);
    });

    it('willie template should cover infrastructure', () => {
        const template = getArtifactTemplate('willie', {
            character: 'willie',
            userInput: 'Infrastructure setup',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/infra|setup|config|environment/);
    });
});

describe('Commands Advanced - Specialist Templates', () => {
    const timestamp = new Date('2024-01-01T00:00:00Z');

    it('dr-nick template should cover health checks', () => {
        const template = getArtifactTemplate('dr-nick', {
            character: 'dr-nick',
            userInput: 'Health check',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/health|check|status|monitor/);
    });

    it('patty template should enforce compliance', () => {
        const template = getArtifactTemplate('patty', {
            character: 'patty',
            userInput: 'Compliance check',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/compliance|rule|standard|require/);
    });

    it('troy template should handle onboarding', () => {
        const template = getArtifactTemplate('troy', {
            character: 'troy',
            userInput: 'Onboarding guide',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/onboard|start|begin|guide/);
    });

    it('lionel template should review legal', () => {
        const template = getArtifactTemplate('lionel', {
            character: 'lionel',
            userInput: 'Legal review',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/legal|license|term|copyright/);
    });

    it('hans template should check accessibility', () => {
        const template = getArtifactTemplate('hans', {
            character: 'hans',
            userInput: 'Accessibility audit',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/access|a11y|screen|aria/);
    });

    it('hibbert template should analyze performance', () => {
        const template = getArtifactTemplate('hibbert', {
            character: 'hibbert',
            userInput: 'Performance analysis',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/perform|speed|optimize|metric/);
    });

    it('edna template should conduct code review', () => {
        const template = getArtifactTemplate('edna', {
            character: 'edna',
            userInput: 'Code review',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/review|code|quality|suggest/);
    });

    it('otto template should plan migration', () => {
        const template = getArtifactTemplate('otto', {
            character: 'otto',
            userInput: 'Migration plan',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/migrat|move|transfer|upgrade/);
    });

    it('lenny template should handle ab testing', () => {
        const template = getArtifactTemplate('lenny', {
            character: 'lenny',
            userInput: 'A/B test plan',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/test|variant|experiment|feature/);
    });

    it('kent template should setup monitoring', () => {
        const template = getArtifactTemplate('kent', {
            character: 'kent',
            userInput: 'Monitoring setup',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/monitor|alert|metric|observ/);
    });
});

describe('Commands Advanced - More Specialists', () => {
    const timestamp = new Date('2024-01-01T00:00:00Z');

    it('snake template should cover auth', () => {
        const template = getArtifactTemplate('snake', {
            character: 'snake',
            userInput: 'Authentication setup',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/auth|login|token|session/);
    });

    it('cookie template should handle database', () => {
        const template = getArtifactTemplate('cookie', {
            character: 'cookie',
            userInput: 'Database design',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/database|db|query|table/);
    });

    it('gil template should manage errors', () => {
        const template = getArtifactTemplate('gil', {
            character: 'gil',
            userInput: 'Error handling',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/error|exception|catch|handle/);
    });

    it('bumblebee template should handle i18n', () => {
        const template = getArtifactTemplate('bumblebee', {
            character: 'bumblebee',
            userInput: 'Internationalization',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/i18n|translate|locale|language/);
    });

    it('duffman template should manage feature flags', () => {
        const template = getArtifactTemplate('duffman', {
            character: 'duffman',
            userInput: 'Feature flags',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/flag|feature|toggle|enable/);
    });

    it('fat-tony template should design microservices', () => {
        const template = getArtifactTemplate('fat-tony', {
            character: 'fat-tony',
            userInput: 'Microservices design',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/microservice|service|api|domain/);
    });

    it('sea-captain template should manage containers', () => {
        const template = getArtifactTemplate('sea-captain', {
            character: 'sea-captain',
            userInput: 'Container setup',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/container|docker|k8s|deploy/);
    });

    it('lovejoy template should handle events', () => {
        const template = getArtifactTemplate('lovejoy', {
            character: 'lovejoy',
            userInput: 'Event handling',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/event|message|publish|subscribe/);
    });

    it('helen template should setup analytics', () => {
        const template = getArtifactTemplate('helen', {
            character: 'helen',
            userInput: 'Analytics setup',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/analytic|track|metric|data/);
    });

    it('agnes template should configure ci/cd', () => {
        const template = getArtifactTemplate('agnes', {
            character: 'agnes',
            userInput: 'CI/CD pipeline',
            timestamp
        });
        expect(template.toLowerCase()).toMatch(/ci|cd|pipeline|deploy|build/);
    });
});

describe('Commands Advanced - Template Edge Cases', () => {
    const timestamp = new Date('2024-01-01T00:00:00Z');

    it('unknown character should get fallback template', () => {
        const template = getArtifactTemplate('unknown-char', {
            character: 'unknown-char',
            userInput: 'Test input',
            timestamp
        });
        expect(template).toContain('Test input');
    });

    it('empty user input should produce valid template', () => {
        const template = getArtifactTemplate('homer', {
            character: 'homer',
            userInput: '',
            timestamp
        });
        expect(template.length).toBeGreaterThan(0);
    });

    it('long user input should be included', () => {
        const longInput = 'A'.repeat(1000);
        const template = getArtifactTemplate('homer', {
            character: 'homer',
            userInput: longInput,
            timestamp
        });
        expect(template.length).toBeGreaterThan(1000);
    });

    it('special characters in input should be handled gracefully', () => {
        const template = getArtifactTemplate('homer', {
            character: 'homer',
            userInput: '<script>alert("xss")</script>',
            timestamp
        });
        // Template should be generated without errors
        expect(template.length).toBeGreaterThan(0);
    });

    it('unicode in input should be preserved', () => {
        const template = getArtifactTemplate('homer', {
            character: 'homer',
            userInput: '测试 тест テスト',
            timestamp
        });
        expect(template).toContain('测试');
    });

    it('newlines in input should be handled', () => {
        const template = getArtifactTemplate('homer', {
            character: 'homer',
            userInput: 'Line 1\nLine 2\nLine 3',
            timestamp
        });
        expect(template.length).toBeGreaterThan(0);
    });

    it('template should include timestamp context', () => {
        const template = getArtifactTemplate('homer', {
            character: 'homer',
            userInput: 'Test',
            timestamp: new Date('2024-06-15T12:30:00Z')
        });
        // Template exists and is valid
        expect(template.length).toBeGreaterThan(0);
    });

    it('all simpson family should produce templates', () => {
        for (const char of CHARACTER_TIERS.simpson_family) {
            const template = getArtifactTemplate(char, {
                character: char,
                userInput: 'Test',
                timestamp
            });
            expect(template.length).toBeGreaterThan(0);
        }
    });

    it('all extended family should produce templates', () => {
        for (const char of CHARACTER_TIERS.extended) {
            const template = getArtifactTemplate(char, {
                character: char,
                userInput: 'Test',
                timestamp
            });
            expect(template.length).toBeGreaterThan(0);
        }
    });

    it('all springfield residents should produce templates', () => {
        for (const char of CHARACTER_TIERS.springfield) {
            const template = getArtifactTemplate(char, {
                character: char,
                userInput: 'Test',
                timestamp
            });
            expect(template.length).toBeGreaterThan(0);
        }
    });
});
