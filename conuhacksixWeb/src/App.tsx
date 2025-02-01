import { Route, Routes } from "react-router-dom";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

function App() {
  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<Signup />} path="/signup" />
    </Routes>
  );
}

export default App;
