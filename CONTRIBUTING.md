# Contributing to Stellar Launchpad Web

Thank you for your interest in contributing to Stellar Launchpad Web! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git
- Freighter wallet extension (for testing)
- Basic knowledge of React, Next.js, and TypeScript

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/stellar-launchpad-web.git
   cd stellar-launchpad-web
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

### Key Directories

- `/app` - Next.js 14 App Router pages
- `/components` - React components organized by feature
- `/hooks` - Custom React hooks for state management
- `/lib` - Utility functions and external service integrations
- `/types` - TypeScript type definitions

### Component Organization

Components are organized by domain:
- `wallet/` - Wallet connection and management
- `launch/` - Token launch form and steps
- `token/` - Token display and information
- `vesting/` - Vesting schedule management
- `airdrop/` - Airdrop campaign management
- `explore/` - Token discovery and filtering
- `ui/` - Reusable UI components

## 📝 Code Style Guidelines

### TypeScript

- Use strict TypeScript settings
- Define interfaces for all props and data structures
- Avoid `any` types - use proper typing
- Use optional chaining (`?.`) and nullish coalescing (`??`) appropriately

### React Components

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused on a single responsibility
- Use descriptive names for components and props

### File Naming

- Components: `PascalCase.tsx` (e.g., `TokenCard.tsx`)
- Hooks: `camelCase.ts` starting with "use" (e.g., `useWallet.ts`)
- Utilities: `camelCase.ts` (e.g., `stellar.ts`)
- Types: `camelCase.ts` (e.g., `index.ts`)

### CSS and Styling

- Use Tailwind CSS classes exclusively
- Follow the dark mode design system
- Use semantic color variables (e.g., `text-muted-foreground`)
- Maintain consistent spacing and sizing

## 🔧 Development Workflow

### Branch Naming

- Features: `feat/description` (e.g., `feat/add-token-search`)
- Bug fixes: `fix/description` (e.g., `fix/wallet-connection-error`)
- Improvements: `improve/description` (e.g., `improve/loading-performance`)

### Commit Messages

Follow conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example: `feat: add token holder analytics page`

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, focused commits
3. Test your changes thoroughly
4. Update documentation if needed
5. Submit a pull request with:
   - Clear description of changes
   - Screenshots for UI changes
   - Testing instructions

## 🧪 Testing Guidelines

### Manual Testing

- Test with Freighter wallet on both testnet and mainnet
- Verify responsive design on different screen sizes
- Test error states and edge cases
- Ensure accessibility with keyboard navigation

### Feature Testing Checklist

For new features, ensure:
- [ ] Wallet connection works correctly
- [ ] Form validation provides clear feedback
- [ ] Loading states are implemented
- [ ] Error handling is graceful
- [ ] Mobile responsive design
- [ ] Dark mode compatibility
- [ ] Accessibility considerations

## 🎨 UI/UX Guidelines

### Design Principles

- **Dark First**: Optimize for dark mode experience
- **Mobile Responsive**: Ensure all features work on mobile
- **Accessibility**: Use semantic HTML and ARIA labels
- **Performance**: Minimize bundle size and optimize loading

### Component Standards

- Use consistent spacing (Tailwind scale: 4, 6, 8, 12, 16, 20, 24)
- Implement loading and error states for all async operations
- Provide visual feedback for user actions
- Use proper color contrast ratios

## 🚀 Feature Development

### Adding New Pages

1. Create page in appropriate `/app` directory
2. Follow existing page structure and layout
3. Implement proper error boundaries
4. Add navigation links where appropriate

### Adding New Components

1. Create component in appropriate feature directory
2. Export from directory index file if needed
3. Write comprehensive props interface
4. Include proper TypeScript types

### Integrating External APIs

1. Create service functions in `/lib`
2. Implement proper error handling
3. Add TypeScript types for API responses
4. Use React hooks for state management

## 🔍 Code Review Guidelines

### Review Checklist

- [ ] Code follows established patterns and conventions
- [ ] TypeScript types are properly defined
- [ ] Components are accessible and responsive
- [ ] Error handling is implemented
- [ ] Performance considerations are addressed
- [ ] Documentation is updated if needed

### Review Focus Areas

- **Security**: Ensure wallet integration is secure
- **Performance**: Check for unnecessary re-renders or large bundles
- **Accessibility**: Verify keyboard navigation and screen reader support
- **User Experience**: Ensure intuitive and smooth user flows

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and wallet version
- Screenshots or error messages
- Network (testnet/mainnet) if relevant

## 💡 Feature Requests

For feature requests, please provide:
- Clear description of the feature
- Use case and user benefit
- Proposed implementation approach (if applicable)
- Mockups or wireframes (if applicable)

## 🤝 Community Guidelines

- Be respectful and inclusive in all interactions
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct
- Ask questions when unclear

## 📞 Getting Help

- Create an issue for bugs or questions
- Join community discussions
- Reach out to maintainers for guidance
- Check existing issues and documentation first

Thank you for contributing to Stellar Launchpad Web! 🌟