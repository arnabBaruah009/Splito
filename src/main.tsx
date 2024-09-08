import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { AuthContextProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <StrictMode>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </StrictMode>
  </AuthContextProvider>
);
