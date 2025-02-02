import { Route, Routes } from "react-router-dom";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Home from "@/pages/Home";
import CompanyInfo from "@/pages/CompanyInfo";
import AgentInfo from "@/pages/AgentInfo";
import AgentsDashboard from "./pages/AgentsDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/companyinfo" element={<CompanyInfo />} />
      <Route path="/agentinfo/:id" element={<AgentInfo />} />
      <Route path="/agentsdashboard" element={<AgentsDashboard />} />
    </Routes>
  );
}

export default App;
