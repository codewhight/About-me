import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import TodoApp from './pages/TodoApp';
import DataViz from './pages/DataViz';
import BoardGames from './pages/BoardGames';

// Initialize global scripts
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about.html" element={<About />} />
          <Route path="/todo-app.html" element={<TodoApp />} />
          <Route path="/data-viz.html" element={<DataViz />} />
          <Route path="/board-games.html" element={<BoardGames />} />
          
          {/* We will route the games below as well or use external links */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
