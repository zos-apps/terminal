# 💻 Terminal

Command line interface

## Category
`system`

## Installation

```bash
npm install @anthropic/terminal
# or
pnpm add @anthropic/terminal
```

## Usage

```tsx
import App from '@anthropic/terminal';

function MyComponent() {
  return <App onClose={() => console.log('closed')} />;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev
```

## zOS Integration

This app is designed to run within zOS, a web-based operating system. It follows the zOS app specification with:

- Standalone React component
- TypeScript support
- Tailwind CSS styling
- Window management integration

## License

MIT
