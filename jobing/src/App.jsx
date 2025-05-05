import "./App.css";

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Container
import Container from "./components/common/Container";

// Pages
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
