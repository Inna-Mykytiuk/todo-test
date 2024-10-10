import { Route, Routes } from "react-router-dom";

import "./App.css";
import SharedLayout from "./components/SharedLayout";
import BoardDetails from "./pages/BoardDetails";
import BoardList from "./pages/BoardList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<BoardList />} />
        <Route path="/boards/:boardId" element={<BoardDetails />} />
      </Route>
    </Routes>
  );
}
