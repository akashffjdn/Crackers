import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
  
        <Analytics />
      </div>
    </BrowserRouter>
  );
}

export default App;
