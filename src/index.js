import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import App from './delauntor/App';
//import App from './drawpad/padapp';
//import App from './ipc2581/App';
import App from './ipc2581_three_js/App'
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
