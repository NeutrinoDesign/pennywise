import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'nprogress/nprogress.css';

import './global.css';
import Browser from './browser';

// Enable Apple Glass styling on macOS
if (window.pennywise && typeof window.pennywise.getPlatform === 'function') {
  window.pennywise.getPlatform().then((p) => {
    if ((p || '').toLowerCase() === 'darwin') {
      document.documentElement.classList.add('apple-glass');
    }
  });
}

ReactDOM.render(<Browser/>, document.getElementById('root'));