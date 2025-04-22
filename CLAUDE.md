# CLAUDE.md - Guidelines for Policy Action

## Commands
- `npm run test` - Run all tests with coverage
- `npm run test -- -t "test name"` - Run specific test
- `npm run format:write` - Format code with Prettier
- `npm run lint` - Run ESLint checks
- `npm run all` - Format, lint, test and package
- `npm run package` - Build the action

## Style Guidelines
- **Language**: JavaScript ES2023, Node.js >=22
- **Formatting**: Prettier, enforce with `npm run format:write`
- **Linting**: ESLint with GitHub plugin, enforce with `npm run lint`
- **Error Handling**: Use try/catch blocks with specific error handling
- **Imports**: CommonJS (require/module.exports)
- **Documentation**: JSDoc for functions
- **Testing**: Jest with 100% coverage target

## Naming Conventions
- camelCase for variables, functions, methods
- PascalCase for classes
- Clear descriptive names, no abbreviations

## Code Structure
- Keep functions small and single-purpose
- Handle errors explicitly with appropriate messaging
- Follow GitHub Actions best practices for input/output

## Security
- Always treat user inputs as untrusted
- Mark secrets with core.setSecret()
- Validate all inputs before use