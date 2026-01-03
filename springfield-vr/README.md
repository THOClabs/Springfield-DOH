# Springfield VR

> Immersive Problem-Solving Through Procedurally Generated Simpsons Episodes

A VR application that transforms your problem statements into interactive Simpsons episodes, where each character guides you through a specific aspect of solution design.

## Vision

You enter VR, state your problem, and Springfield materializes around you. The system generates a custom episode optimized for your problem type, sequences the right characters in the right order, and walks you through an immersive design process. When you reach the playground, Ralph takes your design documents and builds the solution while you're away.

## Architecture

```
springfield-vr/
├── api/                    # Episode Generation & Orchestration API
│   ├── src/
│   │   ├── classifier/     # Problem classification engine
│   │   ├── sequencer/      # Character sequence optimization
│   │   ├── generator/      # Scene & episode generation
│   │   ├── router/         # Claude Code agent routing
│   │   └── executor/       # Ralph build engine
│   └── tests/
├── patterns/               # Episode Pattern Library
│   ├── episodes/           # 192 episode templates
│   ├── characters/         # 40+ character configs
│   ├── scenes/             # Scene definitions
│   └── mappings/           # Problem → Episode mappings
├── client/                 # VR Client (WebXR/Unity)
│   ├── scenes/             # Springfield environments
│   ├── characters/         # Character avatars & animations
│   └── ui/                 # VR interface components
├── agents/                 # Claude Code agent definitions
│   └── interviews/         # Character interview protocols
└── artifacts/              # Session artifact storage
```

## Quick Start

```bash
# Install dependencies
cd springfield-vr/api
npm install

# Start the Episode Generation API
npm run dev

# In another terminal, start the VR client
cd ../client
npm run dev
```

## How It Works

1. **Problem Input** → User states their problem in VR
2. **Classification** → NLP classifies problem domain and complexity
3. **Episode Generation** → System selects optimal episode template and character sequence
4. **Scene Materialization** → VR environment loads with appropriate locations
5. **Character Interactions** → Each character interviews user, generating artifacts
6. **Playground Handoff** → Lisa briefs Ralph with consolidated design documents
7. **Background Execution** → Ralph builds the solution using persistent iteration
8. **Return Visit** → User returns to find completed application

## Episode Pattern Library

The system draws from 192 episode structures, each encoding:
- Narrative arc suitable for specific problem types
- Character dynamics that surface design tensions
- Scene progressions that build understanding
- Resolution patterns that consolidate decisions

## Character Agents

Each character is a specialized Claude Code agent with:
- Personality-specific question patterns
- Domain expertise focus
- Artifact generation templates
- Handoff protocols to next character

## Status

🚧 **Under Development**

- [x] Project structure
- [ ] Episode Pattern Library
- [ ] Problem Classifier
- [ ] Character Sequencer
- [ ] Scene Generator
- [ ] Agent Router
- [ ] Artifact Store
- [ ] Ralph Execution Engine
- [ ] VR Client Prototype
