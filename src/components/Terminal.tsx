import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import styled, { keyframes } from 'styled-components';
import 'xterm/css/xterm.css';

const flicker = keyframes`
  0% { opacity: 1; }
  98% { opacity: 1; }
  99% { opacity: 0.8; }
  100% { opacity: 1; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 15px rgba(58, 134, 255, 0.1); }
  50% { box-shadow: 0 0 20px rgba(93, 226, 255, 0.15); }
  100% { box-shadow: 0 0 15px rgba(58, 134, 255, 0.1); }
`;

const TerminalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #0B132B;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const TerminalWindow = styled.div`
  width: 700px;
  height: 500px;
  background: rgba(11, 19, 43, 0.95);
  border: 1px solid rgba(93, 226, 255, 0.2);
  border-radius: 8px;
  position: relative;
  animation: ${pulse} 4s infinite ease-in-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 28px;
    background: rgba(93, 226, 255, 0.05);
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid rgba(93, 226, 255, 0.2);
  }

  &::after {
    content: '● ● ●';
    position: absolute;
    top: 8px;
    left: 12px;
    color: rgba(93, 226, 255, 0.4);
    font-size: 10px;
    letter-spacing: 2px;
  }
`;

const TerminalContent = styled.div`
  padding: 35px 15px 15px 15px;
  height: calc(100% - 28px);
  animation: ${flicker} 8s infinite;
`;

interface Mode {
  name: string;
  description: string;
  color: string;
}

const modes: Mode[] = [
  {
    name: 'LAB42',
    description: 'Bio-Research Terminal',
    color: '#3A86FF'
  },
  {
    name: 'TOP-TRADERS',
    description: 'Market Analysis System',
    color: '#00FF9D'
  },
  {
    name: 'X-MANAGER',
    description: 'System Control Interface',
    color: '#FF5F5F'
  },
  {
    name: 'AI-ASSISTANT',
    description: 'Neural Network Terminal',
    color: '#B18CFF'
  }
];

const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const initializationRef = useRef<boolean>(false);
  const [currentMode, setCurrentMode] = useState<Mode>(modes[0]);

  const handleCommand = async (term: XTerm, command: string) => {
    if (command.trim().toLowerCase() === 'modes') {
      term.write('\r\n');
      for (const mode of modes) {
        term.write(`\x1b[38;2;${hexToRgb(mode.color)}m${mode.name}\x1b[0m - ${mode.description}\r\n`);
      }
    } else if (command.trim().toLowerCase().startsWith('switch ')) {
      const modeName = command.split(' ')[1]?.toUpperCase();
      const newMode = modes.find(m => m.name === modeName);
      if (newMode) {
        setCurrentMode(newMode);
        term.write('\r\n\x1b[33mSwitching mode...\x1b[0m\r\n');
        await new Promise(resolve => setTimeout(resolve, 500));
        term.clear();
        initializeContent(term);
      } else {
        term.write('\r\n\x1b[31mInvalid mode. Type "modes" to see available modes.\x1b[0m\r\n');
      }
    }
    term.write('\r\n> ');
  };

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)};${parseInt(result[2], 16)};${parseInt(result[3], 16)}`
      : '255;255;255';
  };

  const initializeContent = async (term: XTerm) => {
    const writeToTerminal = async (text: string, delay = 15, center = false) => {
      const cols = term.cols;
      const displayText = center 
        ? ' '.repeat(Math.floor((cols - text.length) / 2)) + text
        : text;
      
      for (let char of displayText) {
        if (!xtermRef.current) break;
        term.write(char);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      if (xtermRef.current) term.write('\r\n');
    };

    await writeToTerminal(`${currentMode.name} - ${currentMode.description}`, 20, true);
    await writeToTerminal('━'.repeat(40), 10, true);
    await writeToTerminal('', 0);
    await writeToTerminal('▲ Initializing systems...', 15, true);
    await writeToTerminal(`▲ Loading ${currentMode.name.toLowerCase()} modules...`, 15, true);
    await writeToTerminal('', 0);
    await writeToTerminal('Type "modes" to see available modes', 15, true);
    await writeToTerminal('Type "switch <mode>" to change modes', 15, true);
    await writeToTerminal('', 0);
    term.write('> ');
  };

  useEffect(() => {
    let cleanupFn: (() => void) | undefined;

    const initializeTerminal = async () => {
      if (initializationRef.current || !terminalRef.current) return;
      initializationRef.current = true;

      if (xtermRef.current) {
        xtermRef.current.dispose();
        xtermRef.current = null;
      }

      const term = new XTerm({
        theme: {
          background: '#0B132B',
          foreground: currentMode.color,
          cursor: '#5DE2FF',
          cursorAccent: '#0B132B',
          black: '#0B132B',
          blue: currentMode.color,
          cyan: '#5DE2FF',
          red: '#FF4A4A'
        },
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'IBM Plex Mono, Space Mono, monospace',
        letterSpacing: 1,
        rows: 18,
        cols: 60,
        allowTransparency: true
      });

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);

      terminalRef.current.innerHTML = '';
      term.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current = term;

      // Initialize content
      await initializeContent(term);

      // Handle input
      let currentLine = '';
      term.onKey(({ key, domEvent }) => {
        const ev = domEvent as KeyboardEvent;
        
        if (ev.keyCode === 13) { // Enter
          handleCommand(term, currentLine);
          currentLine = '';
        } else if (ev.keyCode === 8) { // Backspace
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write('\b \b');
          }
        } else {
          currentLine += key;
          term.write(key);
        }
      });

      const handleResize = () => {
        if (xtermRef.current) fitAddon.fit();
      };

      window.addEventListener('resize', handleResize);

      cleanupFn = () => {
        window.removeEventListener('resize', handleResize);
        if (xtermRef.current) {
          xtermRef.current.dispose();
          xtermRef.current = null;
        }
        initializationRef.current = false;
      };
    };

    initializeTerminal();

    return () => {
      cleanupFn?.();
    };
  }, [currentMode]);

  return (
    <TerminalContainer>
      <TerminalWindow>
        <TerminalContent ref={terminalRef} />
      </TerminalWindow>
    </TerminalContainer>
  );
};

export default Terminal; 