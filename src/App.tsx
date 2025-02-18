import Terminal from './components/Terminal';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Space+Mono:wght@400;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #0B132B;
    font-family: 'IBM Plex Mono', 'Space Mono', monospace;
  }

  #root {
    width: 100vw;
    height: 100vh;
    background-color: #0B132B;
  }

  .xterm-viewport::-webkit-scrollbar {
    width: 8px;
  }

  .xterm-viewport::-webkit-scrollbar-track {
    background: #0B132B;
  }

  .xterm-viewport::-webkit-scrollbar-thumb {
    background: #3A86FF;
    border-radius: 4px;
  }

  .xterm-viewport::-webkit-scrollbar-thumb:hover {
    background: #5DE2FF;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Terminal />
    </>
  );
}

export default App;
