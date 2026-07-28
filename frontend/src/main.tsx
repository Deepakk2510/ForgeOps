import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { ThemeProvider } from "./components/providers/ThemeProvider";
import QueryProvider from "./providers/QueryProvider";

import { Toaster } from "sonner";

import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <App />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>
);