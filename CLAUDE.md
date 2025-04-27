# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Test Commands
- Build: `npm run build` (TypeScript compilation)
- Lint: `npm run lint` (ESLint)
- Format check: `npm run format-check` (Prettier)
- Format fix: `npm run format` (Prettier)
- Test all: `npm test` (Node.js test runner)
- Run single test: `node --test --require ts-node/register --project tsconfig.test.json "__tests__/<test-file>.node.test.ts" -t '<test-name>'`
- Run Jest tests: `npm run test:jest`
- Package: `npm run package` (ncc build)
- Full workflow: `npm run all` (build, format, lint, package, test)

## Code Style Guidelines
- TypeScript with strict typing (noImplicitAny enabled)
- Use explicit function return types
- ES6 target with CommonJS modules
- Follow ESLint rules from eslint-plugin-github
- No explicit any types allowed
- No require imports (use ES imports)
- Error handling should be explicit with proper types
- Use camelCase for variables and methods
- Avoid unnecessary type assertions
- Use arrow functions with async/await for promises
- Use template strings for string concatenation
- Ensure all code passes tests and linting before committing