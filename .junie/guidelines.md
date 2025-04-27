# Development Guidelines for ReSharper InspectCode Action

This document provides guidelines and information for developers working on the ReSharper InspectCode GitHub Action project.

## Build and Configuration Instructions

### Prerequisites
- Node.js (version specified in `.tool-versions`)
- npm

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Build Process
The project uses TypeScript which is compiled to JavaScript. The main build commands are:

- **Build the project**:
  ```bash
  npm run build
  ```
  This compiles TypeScript files from `src/` to JavaScript in the `lib/` directory.

- **Package for distribution**:
  ```bash
  npm run package
  ```
  This uses `@vercel/ncc` to create a single file bundle in the `dist/` directory.

- **Run all build steps**:
  ```bash
  npm run all
  ```
  This runs build, format, lint, package, and test commands in sequence.

### Configuration Files
- **tsconfig.json**: TypeScript configuration
  - Target: ES6
  - Module system: CommonJS
  - Output directory: ./lib
  - Source directory: ./src
  - Strict type checking enabled

- **.editorconfig**: Basic editor settings
  - Line endings: LF
  - Character encoding: UTF-8
  - Indentation: 2 spaces for TS/JS/JSON files

- **.prettierrc.json**: Code formatting rules
  - Max line width: 80 characters
  - No semicolons
  - Single quotes
  - No trailing commas

## Testing Information

### Test Framework
The project uses Jest for testing. Tests are located in the `__tests__/` directory.

### Running Tests
- **Run all tests**:
  ```bash
  npm test
  ```

- **Run a specific test file**:
  ```bash
  npm test -- path/to/test.test.ts
  ```

### Writing Tests
Tests follow the Jest pattern with describe/test blocks. The project uses jest-extended for additional matchers.

#### Example Test
```typescript
import {describe, test, expect} from '@jest/globals'

// Function to test
function formatSeverity(severity: string): string {
  return severity.toUpperCase()
}

describe('Example test suite', () => {
  test('formatSeverity should convert severity to uppercase', () => {
    expect(formatSeverity('warning')).toBe('WARNING')
    expect(formatSeverity('error')).toBe('ERROR')
    expect(formatSeverity('notice')).toBe('NOTICE')
  })
})
```

### Test Fixtures
- Test fixtures are stored in the `__fixtures__/` directory
- Expected test data is stored in `__tests__/expected_data/`

## Code Style and Development Practices

### Code Style
- The project uses Prettier for code formatting and ESLint for linting
- Run formatter: `npm run format`
- Check formatting: `npm run format-check`
- Run linter: `npm run lint`

### TypeScript Conventions
- Strict type checking is enabled
- Use explicit types for function parameters and return values
- Follow the existing patterns in the codebase

### Project Structure
- **src/**: Source code
  - **main.ts**: Entry point for the GitHub Action
  - **issue.ts**: Issue class definition
  - **report/**: Report parsing and handling
  - **installer.ts**: ReSharper installation logic
- **__tests__/**: Test files
- **__fixtures__/**: Test fixtures
- **lib/**: Compiled JavaScript (generated)
- **dist/**: Packaged code for distribution (generated)

### GitHub Action Development
- The action is defined in `action.yml`
- The action runs ReSharper's InspectCode tool on C# solutions
- It parses the output and creates annotations in GitHub PRs
- See README.md for all available input parameters and usage examples
