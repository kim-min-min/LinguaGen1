import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// root 엘리먼트에 직접 스타일 적용
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.style.width = '100%';
  rootElement.style.height = '100%';
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
