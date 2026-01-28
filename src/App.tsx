/** 
 * App.tsx
 * Main router setup. Also imports local env overrides early for runtime keys.
 */

import './env.local'; // Ensure window.ENV is set before anything else runs

import { HashRouter, Route, Routes } from 'react-router';
import HomePage from './pages/Home';

/**
 * Root application component rendering all routes.
 */
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
}
