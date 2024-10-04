// src/App.tsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import BoardList from './components/BoardList';
import BoardDetails from './components/BoardDetails';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardList />} />
      <Route path="/boards/:boardId" element={<BoardDetails />} />
    </Routes>
  );
}

