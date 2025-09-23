# Contributing to Admin Dashboard

Thank you for your interest in contributing to the Admin Dashboard project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/yourusername/admin-dashboard.git
   cd admin-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow the existing code structure and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the existing component structure

### Component Guidelines
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Follow the existing naming conventions

### Styling Guidelines
- Use Tailwind CSS classes
- Follow the existing design system
- Use shadcn/ui components when possible
- Maintain responsive design principles

## 📝 Making Changes

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Use clear, descriptive commit messages:
```
feat: add image preview functionality
fix: resolve SLA calculation bug
docs: update README with new features
refactor: improve complaint card component
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests if applicable
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template
   - Submit the PR

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests
- Write tests for new components
- Test user interactions
- Test edge cases
- Maintain good test coverage

## 📚 Documentation

### Updating Documentation
- Update README.md for new features
- Add JSDoc comments for functions
- Update type definitions
- Keep the project structure documented

### Code Comments
- Add comments for complex logic
- Explain business rules
- Document API interfaces
- Keep comments up to date

## 🐛 Reporting Issues

### Bug Reports
When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and OS information

### Feature Requests
When requesting features, please include:
- Clear description of the feature
- Use case and benefits
- Mockups or examples if possible
- Any additional context

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── Login.tsx       # Authentication
│   ├── Sidebar.tsx     # Navigation
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Complaints.tsx  # Complaint management
│   ├── ComplaintCard.tsx # Individual complaint cards
│   └── Analytics.tsx   # Analytics dashboard
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── data/              # Mock data and services  
│   └── mockData.ts    # Sample complaints and users
├── services/          # Business logic
│   └── smartRouting.ts # Auto-categorization
├── types/            # TypeScript definitions
│   └── index.ts      # Type definitions
├── lib/              # Utilities
│   └── utils.ts      # Helper functions
└── App.tsx           # Main application
```

## 🎯 Areas for Contribution

### High Priority
- Backend integration
- Real-time notifications
- Mobile responsiveness improvements
- Performance optimizations
- Additional chart types

### Medium Priority
- Additional filtering options
- Export functionality
- Advanced analytics
- User management
- Audit trails

### Low Priority
- Theme customization
- Multi-language support
- Advanced reporting
- Integration with external services

## 📞 Getting Help

- Check existing issues and discussions
- Create a new issue for questions
- Join our community discussions
- Review the documentation

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the Admin Dashboard project! 🎉

