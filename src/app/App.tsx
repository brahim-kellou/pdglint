import React from 'react';
import './App.css';
import { ThemeProvider } from '@fluentui/react-theme-provider';
import { lightTheme, darkTheme } from '../styles';
import Typing from '../components/Typing';

function App() {
  return (
    <ThemeProvider applyTo="body" theme={darkTheme}>
      <div className="App">
        <Typing />
      </div>
    </ThemeProvider>

  );
}

export default App;
