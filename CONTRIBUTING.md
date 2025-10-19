# Contributing to Golden Ticket

Thank you for your interest in contributing to Golden Ticket! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, etc.)

### Suggesting Features

We welcome feature suggestions! Please:
- Check if the feature has already been requested
- Provide a clear use case
- Explain how it benefits users

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `test:` - Adding tests
   - `refactor:` - Code refactoring

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/golden-ticket.git
cd golden-ticket

# Install dependencies
cd frontend && pnpm install
cd ../backend && npm install

# Run tests
cd backend && npx hardhat test
```

### Code Style

- Use TypeScript for frontend code
- Use Solidity ^0.8.24 for contracts
- Follow existing formatting conventions
- Add comments for complex logic

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Add integration tests when appropriate

## Questions?

Feel free to open an issue or reach out on Twitter [@im0xmarco](https://x.com/im0xmarco)

Thank you for contributing! 🙏
