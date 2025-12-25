# ⬛ Terminal

> Command-line interface with zsh-like shell

Part of the [zOS Apps](https://github.com/zos-apps) ecosystem.

## Installation

```bash
npm install github:zos-apps/terminal
```

## Usage

```tsx
import App from '@zos-apps/terminal';

function MyApp() {
  return <App />;
}
```

## Package Spec

App metadata is defined in `package.json` under the `zos` field:

```json
{
  "zos": {
    "id": "ai.hanzo.terminal",
    "name": "Terminal",
    "icon": "⬛",
    "category": "developer",
    "permissions": ["filesystem","shell"],
    "installable": true
  }
}
```

## Version

v4.2.0

## License

MIT © Hanzo AI
