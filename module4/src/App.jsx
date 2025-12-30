import { BrowserRouter } from "react-router-dom";
import RiskRoutes from "./routes/RiskRoutes";
 
export default function App() {
  return (
    <BrowserRouter>
      <RiskRoutes />
    </BrowserRouter>
  );
}