import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/index.css";

// BrowserRouter wraps the entire app HERE (not inside App.jsx) so that
// any component, anywhere in the tree, can use React Router hooks
// like useNavigate() or useParams() without extra setup.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);