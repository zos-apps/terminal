# ⬛ Terminal

[![Version](https://img.shields.io/badge/version-4.2.0-blue.svg)](https://github.com/zos-apps/terminal/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Docs](https://img.shields.io/badge/docs-online-purple.svg)](https://zos-apps.github.io/terminal)

> Command-line interface with zsh-like shell

**[Documentation](https://zos-apps.github.io/terminal)** • **[App Store](https://zos-apps.github.io/app-store)** • **[All Apps](https://github.com/zos-apps)**

## Installation

```bash
npm install github:zos-apps/terminal
```

Or install via the [zOS App Store](https://zos-apps.github.io/app-store).

## Usage

```tsx
import Terminal from '@zos-apps/terminal';

function App() {
  return <Terminal />;
}
```

## Features

- Native zOS window integration
- Dark mode support
- Keyboard shortcuts (`Cmd+T`)
- Context menu actions
- Menu bar integration

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+T` | Open Terminal |

## Context Menu

Right-click the app icon for:
- **Open** - Launch the app
- **Open in New Window** - Open a new instance
- **Get Info** - View app details
- **Show in Finder** - Locate app files

## Menu Bar

When active, adds menus: Terminal, File, Edit, View, Window, Help

## Permissions

- `filesystem`
- `shell`

## Links

- [Documentation](https://zos-apps.github.io/terminal)
- [GitHub Repository](https://github.com/zos-apps/terminal)
- [Report Issues](https://github.com/zos-apps/terminal/issues)
- [All zOS Apps](https://github.com/zos-apps)

## License

MIT © [Hanzo AI](https://hanzo.ai)
