import { Route, Routes } from "react-router-dom";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";
import CompanyInfo from "@/pages/CompanyInfo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/companyinfo" element={<CompanyInfo />} />
    </Routes>
  );
}

export default App;
