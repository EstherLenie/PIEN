import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes.jsx";
import AuthContextProvider from "./context/authContext.jsx";
import { SideViewerProvider } from "./components/sideViewer/sideViewer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <SideViewerProvider>
        <RouterProvider router={routes} />
      </SideViewerProvider>
    </AuthContextProvider>
  </StrictMode>
);
