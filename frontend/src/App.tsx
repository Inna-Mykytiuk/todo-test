import { Route, Routes } from "react-router-dom";
import BoardList from "./pages/BoardList";
import BoardDetails from "./pages/BoardDetails";
import SharedLayout from "./components/SharedLayout";

import "./App.css";

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
