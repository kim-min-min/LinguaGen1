import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 30 * 60 * 1000, // 30분
      retry: 1,
    },
  },
});

// root 엘리먼트에 직접 스타일 적용
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.style.width = '100%';
  rootElement.style.height = '100%';
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
