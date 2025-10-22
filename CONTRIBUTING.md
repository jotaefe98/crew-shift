# Contributing to CrewShift

First off, thank you for considering contributing to CrewShift! It's people like you that make this project better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by respect, kindness, and professionalism. By participating, you are expected to uphold these values.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots** if applicable
- **Include your environment details** (browser, OS, Angular version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

### Pull Requests

1. Fork the repository and create your branch from `master`
2. Make your changes following our coding guidelines
3. Ensure your code follows the existing style
4. Update documentation if needed
5. Write or update tests as needed
6. Ensure all tests pass
7. Create a pull request with a clear description

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Firebase account (for testing backend features)

### Local Development

1. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/crew-shift.git
   cd crew-shift
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment**

   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   cp src/environments/environment.example.ts src/environments/environment.prod.ts
   ```

   Then add your Firebase configuration to both files.

4. **Start development server**
   ```bash
   npm start
   ```

## Coding Guidelines

This project follows Angular and TypeScript best practices as outlined in `.github/copilot-instructions.md`:

### TypeScript

- Use strict type checking
- Prefer type inference when obvious
- Avoid `any` type; use `unknown` when uncertain

### Angular Components

- Always use standalone components
- Use signals for state management
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Use native control flow (`@if`, `@for`, `@switch`)

### Services

- Design services around single responsibility
- Use `providedIn: 'root'` for singleton services
- Use `inject()` function instead of constructor injection

### Templates

- Keep templates simple
- Avoid complex logic in templates
- Use async pipe for observables
- Use `class` bindings instead of `ngClass`
- Use `style` bindings instead of `ngStyle`

### Code Style

- All comments and documentation must be in English
- Use meaningful variable and function names
- Keep functions small and focused
- Write self-documenting code

## Testing

Run the test suite before submitting your PR:

```bash
npm test
```

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Examples

```
Add vacation balance indicator to calendar header

- Implement new computed signal for vacation count
- Add visual indicator when approaching limit
- Update tests for new functionality

Fixes #123
```

## Project Structure

Understanding the project structure will help you navigate the codebase:

```
src/app/
├── core/           # Singleton services, models, constants
├── pages/          # Page-level components
├── shared/         # Reusable components and utilities
└── environments/   # Environment configurations (not committed)
```

### Adding New Features

1. **Components**: Add to `src/app/shared/components/` if reusable, or `src/app/pages/` if page-specific
2. **Services**: Add to `src/app/core/services/`
3. **Models**: Add to `src/app/core/models/`
4. **Constants**: Add to `src/app/core/constants/`

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for complex functions
- Update this CONTRIBUTING.md if you change the development process

## Questions?

Feel free to open an issue with your question, and we'll be happy to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
