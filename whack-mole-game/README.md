# AI Character Puzzle Whack-a-Mole Game

A browser-based game where players click moles to collect puzzle pieces that form AI-generated animated characters.

## Features

- **Core Gameplay**: Click moles as they appear to collect puzzle pieces
- **AI Character Generation**: Customize prompts to generate unique animated character puzzles
- **Configurable Parameters**: Adjust game duration, difficulty, grid size, scoring rules, and visual settings
- **High Scores**: Track your best performances across multiple game sessions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Testing**: Vitest (unit), Playwright (E2E), Vue Test Utils (component)
- **Storage**: localStorage and IndexedDB (browser-side)
- **Deployment**: Static hosting ready (Netlify, Vercel, GitHub Pages)

## Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd whack-mole-game
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment (optional):
   ```bash
   cp .env.example .env
   # Edit .env with your AI image generation API credentials
   ```

## Running the Game

### Development

```bash
npm run dev
```

The game will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## Testing

### Unit Tests

```bash
npm run test
```

### Component Tests

```bash
npm run test:component
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:coverage
```

## Code Quality

```bash
npm run lint
npm run lint:fix
```

## Deployment

This project is ready for one-click deployment to static hosting platforms:

- **Netlify**: Connect your repository and deploy automatically
- **Vercel**: Connect your repository and deploy automatically
- **GitHub Pages**: Use `npm run build` and deploy the `dist/` folder

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```
2. Upload the `dist/` folder to your hosting provider
3. Ensure the hosting serves `index.html` as the default file

## Configuration

The game supports extensive customization:

- **Game Settings**: Duration (30-300s), puzzle grid size (2x2 to 6x6)
- **Mole Behavior**: Appearance speed (0.5-5s), display duration (0.3-3s)
- **Scoring Rules**: Points per hit, miss penalties, time bonuses
- **Visual Settings**: Game area size, mole size, piece size, theme colors
- **AI Prompts**: Custom character descriptions and preset themes

Access configuration through the "Configure Game" option in the main menu.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT
