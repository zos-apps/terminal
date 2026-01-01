import { useState, useRef, useEffect, useCallback } from 'react';

interface TerminalProps {
  onClose: () => void;
}

interface HistoryEntry {
  command: string;
  output: string;
  isError?: boolean;
}

const COMMANDS: Record<string, (args: string[], fs: Record<string, string>) => string> = {
  help: () => `Available commands:
  help     - Show this help message
  echo     - Print text
  clear    - Clear terminal
  date     - Show current date/time
  whoami   - Show current user
  pwd      - Print working directory
  ls       - List files
  cat      - Show file contents
  mkdir    - Create directory
  touch    - Create file
  rm       - Remove file
  cd       - Change directory
  history  - Show command history
  neofetch - System info`,
  
  echo: (args) => args.join(' '),
  date: () => new Date().toString(),
  whoami: () => 'guest@zos',
  pwd: () => '/home/guest',
  
  ls: (_args, fs) => {
    const entries = Object.keys(fs);
    if (entries.length === 0) return '';
    return entries.map(e => fs[e] === 'dir' ? `\x1b[34m${e}/\x1b[0m` : e).join('  ');
  },
  
  cat: (args, fs) => {
    if (!args[0]) return 'cat: missing operand';
    const content = fs[args[0]];
    if (!content || content === 'dir') return `cat: ${args[0]}: No such file`;
    return content;
  },
  
  mkdir: (args, fs) => {
    if (!args[0]) return 'mkdir: missing operand';
    fs[args[0]] = 'dir';
    return '';
  },
  
  touch: (args, fs) => {
    if (!args[0]) return 'touch: missing operand';
    fs[args[0]] = '';
    return '';
  },
  
  rm: (args, fs) => {
    if (!args[0]) return 'rm: missing operand';
    if (!(args[0] in fs)) return `rm: ${args[0]}: No such file`;
    delete fs[args[0]];
    return '';
  },
  
  cd: (args) => {
    if (!args[0] || args[0] === '~') return '';
    return `cd: ${args[0]}: Not implemented in sandbox`;
  },
  
  neofetch: () => `
\x1b[36m        .--.       \x1b[0m  guest@zos
\x1b[36m       |o_o |      \x1b[0m  ----------
\x1b[36m       |:_/ |      \x1b[0m  OS: z/OS Web Edition
\x1b[36m      //   \\ \\     \x1b[0m  Kernel: React 18.x
\x1b[36m     (|     | )    \x1b[0m  Shell: zsh
\x1b[36m    /'\_   _/'\`\\   \x1b[0m  Terminal: xterm-256color
\x1b[36m    \\___)=(___/    \x1b[0m  CPU: JavaScript Engine
`,
};

const Terminal: React.FC<TerminalProps> = ({ onClose: _onClose }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { command: '', output: 'Welcome to z/OS Terminal v1.0\nType "help" for available commands.\n' }
  ]);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [fs, setFs] = useState<Record<string, string>>({
    'readme.txt': 'Welcome to z/OS!',
    'documents': 'dir',
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [history]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const _args = parts.slice(1);

    let output = '';
    let isError = false;

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    if (command === 'history') {
      output = commandHistory.map((c, i) => `${i + 1}  ${c}`).join('\n');
    } else if (COMMANDS[command]) {
      output = COMMANDS[command](_args, fs);
      setFs({ ...fs });
    } else {
      output = `zsh: command not found: ${command}`;
      isError = true;
    }

    setHistory(h => [...h, { command: trimmed, output, isError }]);
    setCommandHistory(h => [...h, trimmed]);
    setHistoryIndex(-1);
  }, [commandHistory, fs]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cmds = Object.keys(COMMANDS).filter(c => c.startsWith(input));
      if (cmds.length === 1) setInput(cmds[0]);
    }
  }, [input, executeCommand, commandHistory, historyIndex]);

  const renderOutput = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Simple ANSI color parsing
      let html = line
        .replace(/\x1b\[36m/g, '<span class="text-cyan-400">')
        .replace(/\x1b\[34m/g, '<span class="text-blue-400">')
        .replace(/\x1b\[0m/g, '</span>');
      return <div key={i} dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  return (
    <div
      className="h-full flex flex-col bg-[#1a1a1a] text-gray-200 font-mono text-sm"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="flex-1 text-center text-gray-400">Terminal — zsh</span>
      </div>

      {/* Terminal content */}
      <div ref={containerRef} className="flex-1 p-4 overflow-auto">
        {history.map((entry, i) => (
          <div key={i} className="mb-2">
            {entry.command && (
              <div className="flex">
                <span className="text-green-400">guest@zos</span>
                <span className="text-gray-500">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-500">$ </span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <div className={entry.isError ? 'text-red-400' : 'text-gray-300'}>
                {renderOutput(entry.output)}
              </div>
            )}
          </div>
        ))}

        {/* Input line */}
        <div className="flex">
          <span className="text-green-400">guest@zos</span>
          <span className="text-gray-500">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-gray-500">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none caret-gray-400"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
