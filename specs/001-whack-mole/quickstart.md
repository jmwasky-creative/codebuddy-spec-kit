# Quickstart Guide: AI Character Puzzle Whack-a-Mole Game

**Feature**: AI Character Puzzle Whack-a-Mole Game
**Date**: 2026-01-08
**Phase**: Phase 1 - Design & Contracts

## Overview

This guide provides step-by-step instructions to run, test, and deploy the AI Character Puzzle Whack-a-Mole Game. The game is built with Vue 3, Vite, and uses browser storage for data persistence.

## Prerequisites

- **Node.js**: Version 18.x or higher (LTS recommended)
- **npm** or **yarn**: Package manager (npm comes with Node.js)
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **AI Image Generation Service**: OpenAI API key, Stability AI account, or similar (for AI character generation)
- **Git**: For version control (optional for running locally)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd codebuddy/whack-mole-game
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

This installs:
- Vue 3 and Vue Router
- Vite (build tool and dev server)
- Vitest (unit testing)
- Playwright (E2E testing)
- ESLint (linting)

### 3. Configure AI Service

Create a `.env` file in the project root:

```env
# AI Image Generation Service
VITE_AI_SERVICE=openai  # or stabilityai, dall-e, etc.
VITE_API_KEY=your-api-key-here
VITE_API_ENDPOINT=https://api.openai.com/v1/images/generations

# Optional: Default game parameters
VITE_DEFAULT_GAME_DURATION=60
VITE_DEFAULT_GRID_SIZE=3
VITE_DEFAULT_THEME_COLOR=#4CAF50
```

**Note**: For development/testing without AI service, the game will use placeholder character images.

## Running the Game

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
# or
yarn dev
```

The dev server will start at:
- **URL**: http://localhost:5173
- **Hot Reload**: Automatic on file changes
- **Console**: Check browser console for errors

Open the URL in your browser to see the game.

### Production Build

Build for production:

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build Locally

Preview the production build before deploying:

```bash
npm run preview
# or
yarn preview
```

This serves the `dist/` folder at http://localhost:4173

## Game Features

### 1. Starting a Game

1. Click "Start Game" on the main menu
2. Wait for AI character image to generate (5-10 seconds)
3. Game starts automatically when image is ready

### 2. Playing the Game

1. **Hit Moles**: Click on moles as they appear
2. **Collect Pieces**: Puzzle pieces drop when you hit a mole
3. **Assemble Puzzle**: Drag pieces to the puzzle grid to complete the character
4. **Score Points**: Get points for hits, lose points for misses
5. **Time Limit**: Complete the puzzle before time runs out

**Controls**:
- **Mouse**: Click to hit moles, drag and drop to assemble puzzle
- **Touch**: Tap to hit moles, drag to assemble puzzle
- **Keyboard** (optional): Arrow keys to navigate, Space to hit nearest mole

### 3. Configuring the Game

1. Click "Configure Game" on the main menu
2. Adjust parameters in each section:
   - **Game Settings**: Duration, puzzle grid size
   - **Mole Behavior**: Appearance speed, display duration
   - **Scoring Rules**: Points per hit, miss penalties, time bonuses
   - **Visual Settings**: Game area size, mole size, piece size, colors
3. Configure AI character prompt:
   - Enter custom prompt in text area
   - Or select from preset themes (fantasy, sci-fi, cartoon, etc.)
4. Click "Save" to apply changes
5. Click "Reset" to restore default values

### 4. Viewing High Scores

1. Click "High Scores" on the main menu
2. View top scores sorted by:
   - Score (highest first)
   - Time (fastest first)
   - Date (most recent first)
3. See character image and puzzle used for each score

## Testing

### Running Unit Tests

```bash
npm run test
# or
yarn test
```

This runs Vitest unit tests for composables and utilities:
- `useGameConfig.test.js`
- `useGameState.test.js`
- `useLocalStorage.test.js`
- `gameLogic.test.js`
- `puzzleGenerator.test.js`
- `validation.test.js`

**Expected Output**: All tests pass, coverage report generated

### Running Component Tests

```bash
npm run test:component
# or
yarn test:component
```

This runs Vue Test Utils component tests:
- `GameCanvas.test.vue`
- `ConfigPanel.test.vue`
- `PuzzlePiece.test.vue`

**Expected Output**: All components pass, snapshot tests pass

### Running E2E Tests

```bash
npm run test:e2e
# or
yarn test:e2e
```

This runs Playwright E2E tests:
- `gameplay.spec.js` - Full game flow
- `configuration.spec.js` - Configuration flow
- `scoring.spec.js` - Scoring and high scores

**Expected Output**: All E2E tests pass in headless mode

### Running All Tests

```bash
npm run test:all
# or
yarn test:all
```

This runs unit, component, and E2E tests sequentially.

### Linting

```bash
npm run lint
# or
yarn lint
```

This runs ESLint to check code quality:
- All files should pass with zero errors
- Auto-fix issues: `npm run lint --fix`

## Deployment

### One-Click Deployment to Netlify

**Option 1: Netlify CLI**

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy to Netlify:
```bash
netlify deploy --prod --dir=dist
```

4. Follow the URL provided to view the deployed game.

**Option 2: Netlify Dashboard**

1. Push code to GitHub repository
2. Connect repository to Netlify dashboard (app.netlify.com)
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy automatically on push to main branch

### One-Click Deployment to Vercel

**Option 1: Vercel CLI**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Build and deploy:
```bash
npm run build
vercel --prod
```

**Option 2: Vercel Dashboard**

1. Push code to GitHub repository
2. Import repository in Vercel dashboard (vercel.com)
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy automatically on push to main branch

### Deployment to GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Install `gh-pages`:
```bash
npm install -g gh-pages
```

3. Deploy to GitHub Pages:
```bash
gh-pages -d dist
```

4. Enable GitHub Pages in repository settings

**Note**: Update `vite.config.js` to set correct base path:
```javascript
export default defineConfig({
  base: '/your-repo-name/',  // Add this
  // ... other config
})
```

## Data Management

### Browser Storage

The game uses:
- **localStorage**: Configuration, prompts (fast access, ~5-10MB limit)
- **IndexedDB**: Game sessions, images, score records (larger datasets, ~50-100MB limit)

### Clearing Data

To reset all game data:

1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Under **Storage**:
   - Expand **Local Storage** → Select your site → Right-click → Clear
   - Expand **IndexedDB** → Select your site → Right-click → Delete database
4. Refresh the page

### Exporting/Importing Configuration

To save your configuration:
1. Go to **Configure Game**
2. Export configuration (JSON file)
3. Save to disk

To load configuration:
1. Go to **Configure Game**
2. Import configuration (JSON file)
3. Apply settings

## Troubleshooting

### Game Won't Start

**Problem**: Clicking "Start Game" does nothing

**Solutions**:
1. Check browser console (F12) for errors
2. Verify AI service is configured (or use placeholder mode)
3. Ensure API key is valid in `.env` file
4. Try refreshing the page

### Images Not Loading

**Problem**: Character images or puzzle pieces are missing

**Solutions**:
1. Check network connection (AI service requires internet)
2. Verify API key is valid and has credits
3. Check CORS settings (if using custom AI service)
4. Try using placeholder images (set `VITE_AI_SERVICE=none`)

### Performance Issues

**Problem**: Game lags or is slow to respond

**Solutions**:
1. Close other browser tabs
2. Reduce game area size in configuration
3. Use smaller puzzle grid (2x2 instead of 6x6)
4. Disable browser extensions
5. Check device performance (use desktop instead of mobile)

### Touch Controls Not Working

**Problem**: Cannot tap/drag on mobile device

**Solutions**:
1. Ensure viewport meta tag is in `index.html`
2. Test on actual mobile device (not just dev tools)
3. Check touch-action CSS property
4. Increase tap target sizes in visual settings

### Tests Failing

**Problem**: Unit/component/E2E tests fail

**Solutions**:
1. Update dependencies: `npm update`
2. Clear test cache: `rm -rf node_modules/.vitest`
3. Check test logs for specific failures
4. Verify browser versions for Playwright tests
5. Run tests individually: `npm run test:unit`, `npm run test:e2e`

## Development Workflow

### Recommended Workflow

1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Make Changes**: Edit code, components, tests
3. **Run Linting**: `npm run lint`
4. **Run Tests**: `npm run test:all`
5. **Build Locally**: `npm run build`
6. **Preview Build**: `npm run preview`
7. **Commit Changes**: `git commit -m "feat: add your feature"`
8. **Push to Remote**: `git push origin feature/your-feature`
9. **Create Pull Request**: Review and merge
10. **Deploy**: Auto-deploy to Netlify/Vercel

### Code Quality Gates

Before committing or merging:
- ✅ ESLint passes with zero errors
- ✅ All tests pass (unit, component, E2E)
- ✅ Code coverage >= 80%
- ✅ Production build succeeds
- ✅ No security vulnerabilities: `npm audit`

## Environment Variables

All environment variables (optional, have defaults):

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_AI_SERVICE` | string | "none" | AI service: "openai", "stabilityai", "none" |
| `VITE_API_KEY` | string | "" | API key for AI service |
| `VITE_API_ENDPOINT` | string | "" | Custom API endpoint URL |
| `VITE_DEFAULT_GAME_DURATION` | number | 60 | Default game duration (seconds) |
| `VITE_DEFAULT_GRID_SIZE` | number | 3 | Default grid size (N x N) |
| `VITE_DEFAULT_THEME_COLOR` | string | "#4CAF50" | Default theme color (hex) |

## Performance Targets

Based on success criteria, the game should achieve:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Game loop FPS | 60 fps | DevTools Performance tab |
| Click response time | <100ms | Performance.now() timing |
| Puzzle piece drop | <500ms | Timing from hit to render |
| AI image generation | <5 seconds | Timing from request to display |
| Initial page load | <3 seconds | DevTools Network tab |
| Configuration save/load | <500ms | localStorage timing |

## Browser Support

Tested and supported browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Not supported**:
- ❌ Internet Explorer
- ❌ Older browsers (Chrome <90, Firefox <88, Safari <14)

## Accessibility

The game supports:
- Keyboard navigation (arrow keys, space bar)
- Screen reader compatibility (ARIA labels)
- Touch-friendly controls (44px minimum tap targets)
- High contrast mode support
- Focus indicators for keyboard navigation

## Security Considerations

- All user inputs (prompts, parameters) are sanitized
- API keys stored in `.env` file (never committed)
- No sensitive data in localStorage (use IndexedDB for large data)
- CSP (Content Security Policy) configured in production
- Regular dependency audits: `npm audit`

## Support and Resources

- **Vue 3 Documentation**: https://vuejs.org
- **Vite Documentation**: https://vitejs.dev
- **Vitest Documentation**: https://vitest.dev
- **Playwright Documentation**: https://playwright.dev
- **Project Repository**: <repository-url>
- **Issue Tracker**: <repository-url>/issues

## Summary

This quickstart guide covers:
- ✅ Installation and setup
- ✅ Running development server
- ✅ Building for production
- ✅ One-click deployment (Netlify, Vercel, GitHub Pages)
- ✅ Testing (unit, component, E2E)
- ✅ Troubleshooting common issues
- ✅ Development workflow
- ✅ Performance and accessibility targets

For detailed technical specifications, see:
- [spec.md](./spec.md) - Feature specification
- [plan.md](./plan.md) - Implementation plan
- [data-model.md](./data-model.md) - Data model
- [contracts/component-contracts.md](./contracts/component-contracts.md) - Component contracts
