import React, { useState, useRef, useEffect } from 'react';
import type { TerminalProps, TerminalEntry } from './types';

const themes = {
  dark: { bg: 'bg-black', text: 'text-white' },
  light: { bg: 'bg-gray-100', text: 'text-gray-800' },
  dracula: { bg: 'bg-[#282a36]', text: 'text-[#f8f8f2]' },
  nord: { bg: 'bg-[#2e3440]', text: 'text-[#d8dee9]' },
  monokai: { bg: 'bg-[#272822]', text: 'text-[#f8f8f2]' }
};

const ZTerminal: React.FC<TerminalProps> = ({
  className,
  fontSize = 14,
  theme = 'dark'
}) => {
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { id: '1', output: 'Welcome to zOS Terminal v4.2.0\nType "help" for available commands.\n' }
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const executeCommand = (cmd: string) => {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';
    let isError = false;

    switch (command) {
      case 'help':
        output = `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  echo     - Print text
  date     - Show current date
  whoami   - Show current user
  pwd      - Print working directory
  ls       - List files
  neofetch - System information`;
        break;
      case 'clear':
        setEntries([]);
        return;
      case 'echo':
        output = args.join(' ');
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'whoami':
        output = 'guest@zos';
        break;
      case 'pwd':
        output = '/Users/guest';
        break;
      case 'ls':
        output = 'Desktop  Documents  Downloads  Pictures  Music';
        break;
      case 'neofetch':
        output = `
       .:'          guest@zos
    _ :'_           ---------
 .''\`_\`-'_\`\`.       OS: zOS 4.2.0
:________.-'        Host: Browser
:_______:           Kernel: WebKit
 :_______\`-;        Uptime: ${Math.floor(performance.now() / 1000)}s
  \`._.-._.'         Shell: zsh`;
        break;
      default:
        output = `zsh: command not found: ${command}`;
        isError = true;
    }

    setEntries(prev => [...prev, {
      id: Date.now().toString(),
      command: cmd,
      output,
      isError
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory(prev => [input, ...prev]);
    executeCommand(input);
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      if (history[newIndex]) setInput(history[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      setInput(newIndex >= 0 ? history[newIndex] : '');
    }
  };

  const themeStyle = themes[theme] || themes.dark;

  return (
    <div
      className={`h-full overflow-hidden ${themeStyle.bg} ${themeStyle.text} ${className || ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="h-full overflow-y-auto p-4 font-mono" style={{ fontSize }}>
        {entries.map(entry => (
          <div key={entry.id} className="mb-2">
            {entry.command && (
              <div className="flex items-center">
                <span className="text-cyan-400 mr-1">guest@zos</span>
                <span className="text-blue-400 mr-1">~</span>
                <span className="text-purple-400 mr-2">❯</span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <pre className={`whitespace-pre-wrap mt-1 ${entry.isError ? 'text-red-400' : ''}`}>
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        <div className="flex items-center">
          <span className="text-cyan-400 mr-1">guest@zos</span>
          <span className="text-blue-400 mr-1">~</span>
          <span className="text-purple-400 mr-2">❯</span>
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent w-full outline-none"
              style={{ fontSize }}
              autoFocus
            />
          </form>
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default ZTerminal;
