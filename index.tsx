import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// vConsole
import Vconsole from 'vconsole';
let vConsole = new Vconsole();
export default vConsole

const root = ReactDOM.createRoot(rootElement);
root.render(
  <App />
);