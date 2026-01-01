# Templates Directory

> **Status:** Reserved for v3.0.0

This directory is reserved for customizable artifact templates that will allow users to override default character output formats.

## Planned Features (v3.0.0)

- **Custom Templates:** Override default artifact templates per character
- **Project Templates:** Define project-specific artifact structures
- **Template Variables:** Rich variable interpolation in templates
- **Template Validation:** Ensure templates include required sections

## Future Structure

```
templates/
├── index.ts              # Template registry
├── types.ts              # Template type definitions
├── defaults/             # Default templates (fallback)
│   ├── homer.md
│   ├── marge.md
│   └── ...
└── overrides/            # User template overrides
    └── .gitkeep
```

## Usage (v3.0.0)

```typescript
// Register a custom template
registerTemplate("homer", `
# Homer's Custom Questions

{{userInput}}

## My Questions
{{questions}}
`);
```

*This directory is intentionally minimal until v3.0.0.*
